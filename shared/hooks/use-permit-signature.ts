import { hexValue, splitSignature } from '@ethersproject/bytes';
import { StethAbi } from '@lido-sdk/contracts';
import { useSDK } from '@lido-sdk/react';
import { TOKENS } from 'consts/tokens';
import { getUnixTime, hoursToSeconds } from 'date-fns/fp';
import { BigNumber, BytesLike, TypedDataDomain } from 'ethers';
import { useCallback } from 'react';
import {
  useAccount,
  useSTETHContractRPC,
  useWSTETHContractRPC,
} from 'shared/hooks';
import invariant from 'tiny-invariant';
import { Address, useChainId } from 'wagmi';

export type GatherPermitSignatureResult = {
  value: BigNumber;
  deadline: BigNumber;
  v: number;
  r: BytesLike;
  s: BytesLike;
};

const isStethPermit = (provider: unknown): provider is StethAbi => {
  return Boolean(
    provider && typeof provider === 'object' && 'eip712Domain' in provider,
  );
};

const EIP2612_TYPE = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
];

export const usePermitSignature = (spender: Address) => {
  const chainId = useChainId();
  const { providerWeb3 } = useSDK();
  const { address: owner } = useAccount();

  const wstethContract = useWSTETHContractRPC();
  const stethContract = useSTETHContractRPC();

  const gatherPermitSignature = useCallback(
    async (
      amount: BigNumber,
      token: TOKENS,
    ): Promise<GatherPermitSignatureResult> => {
      invariant(chainId, 'chainId is needed');
      invariant(owner, 'owner is needed');
      invariant(providerWeb3, 'providerWeb3 is needed');
      invariant(token, 'tokenProvider is needed');

      const getTokenProvider = (token: TOKENS) => {
        switch (token) {
          case TOKENS.STETH:
            return stethContract;
          case TOKENS.WSTETH:
            return wstethContract;
          default:
            throw new Error('Incorrect token for permit');
        }
      };
      const tokenProvider = getTokenProvider(token);
      const deadline = BigNumber.from(
        getUnixTime(new Date()) + hoursToSeconds(1),
      );

      let domain: TypedDataDomain;
      if (isStethPermit(tokenProvider)) {
        const eip712Domain = await tokenProvider.eip712Domain();
        domain = {
          name: eip712Domain.name,
          version: eip712Domain.version,
          chainId: eip712Domain.chainId.toNumber(),
          verifyingContract: eip712Domain.verifyingContract,
        };
      } else {
        domain = {
          name: 'Wrapped liquid staked Ether 2.0',
          version: '1',
          chainId,
          verifyingContract: tokenProvider.address,
        };
      }
      const nonce = await tokenProvider.nonces(owner);

      const message = {
        owner,
        spender,
        value: amount.toString(),
        nonce: hexValue(nonce),
        deadline: hexValue(deadline),
      };
      const types = {
        Permit: EIP2612_TYPE,
      };

      const signer = providerWeb3.getSigner();

      return signer
        ._signTypedData(domain, types, message)
        .then(splitSignature)
        .then((signature) => {
          return {
            value: amount,
            deadline,
            v: signature.v,
            r: signature.r,
            s: signature.s,
          };
        });
    },
    [chainId, owner, providerWeb3, stethContract, wstethContract, spender],
  );

  return gatherPermitSignature;
};
