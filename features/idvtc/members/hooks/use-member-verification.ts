import { useCallback, useState } from 'react';
import { compareLowercase } from 'utils';
import { isAddress, isHex } from 'viem';
import { useVerifyMemberOwnership } from './use-verify-member-ownership';

type VerifyArgs = {
  address: string;
  signature: string;
  // addresses already taken by other members; checked at call time so callers
  // don't need to reactively subscribe to the whole member set.
  otherAddresses?: string[];
};

// Owns the transient verification state (isVerifying/error) and the validation
// gauntlet shared by the manual-init rows and the rotate editor. The caller owns
// where the verified flag and the address/signature live (local state vs RHF).
export const useMemberVerification = () => {
  const verifyOwnership = useVerifyMemberOwnership();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const verify = useCallback(
    async ({
      address,
      signature,
      otherAddresses = [],
    }: VerifyArgs): Promise<boolean> => {
      if (isVerifying) return false;
      if (!isAddress(address)) {
        setError('Invalid Ethereum address');
        return false;
      }
      if (otherAddresses.some((a) => compareLowercase(a, address))) {
        setError('This address is already used by another member');
        return false;
      }
      if (!isHex(signature)) {
        setError('Invalid signature format');
        return false;
      }
      setIsVerifying(true);
      try {
        const ok = await verifyOwnership({ address, signature });
        setError(
          ok ? undefined : 'Invalid signature for this address and message',
        );
        return ok;
      } catch {
        setError('Verification failed');
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [isVerifying, verifyOwnership],
  );

  return { isVerifying, error, verify, setError } as const;
};
