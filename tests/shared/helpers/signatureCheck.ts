import {
  encodeDeployData,
  erc6492SignatureValidatorAbi,
  erc6492SignatureValidatorByteCode,
  hashMessage,
} from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export const VALID_SIGNATURE = '0x01';

export const buildSignatureCheckData = async (message: string) => {
  const signer = privateKeyToAccount(generatePrivateKey());
  return encodeDeployData({
    abi: erc6492SignatureValidatorAbi,
    bytecode: erc6492SignatureValidatorByteCode,
    args: [
      signer.address,
      hashMessage(message),
      await signer.signMessage({ message }),
    ],
  });
};
