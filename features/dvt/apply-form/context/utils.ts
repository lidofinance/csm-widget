import { Address } from 'viem';

export const generateDiscordMessage = (address: Address) =>
  `This post is proof that I am the owner of this Discord account. My address to get verified for IDVTC: ${address.toLowerCase()}`;

export const generateClusterMemberMessage = (
  memberAddress: Address,
  mainAddress: Address,
) =>
  `Verify ownership of address ${memberAddress.toLowerCase()} for DVT cluster with main address ${mainAddress.toLowerCase()}`;
