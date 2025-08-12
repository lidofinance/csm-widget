import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ApplyFormNetworkData } from './types';

const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/;

export const useApplyFormValidation = (networkData: ApplyFormNetworkData) => {
  return useMemo(() => {
    return zodResolver(
      z.object({
        mainAddress: z
          .string()
          .regex(ethereumAddressRegex, 'Invalid Ethereum address')
          .refine(
            (address) => address === networkData.connectedAddress,
            'Address must match connected wallet'
          ),
        additionalAddresses: z
          .array(
            z.object({
              address: z
                .string()
                .regex(ethereumAddressRegex, 'Invalid Ethereum address'),
              signature: z
                .string()
                .min(1, 'Signature is required')
                .regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format'),
            })
          )
          .max(5, 'Maximum 5 additional addresses allowed')
          .refine(
            (addresses) => {
              const addressSet = new Set(addresses.map(a => a.address.toLowerCase()));
              return addressSet.size === addresses.length;
            },
            'Duplicate addresses are not allowed'
          )
          .refine(
            (addresses) => {
              const mainAddr = networkData.connectedAddress?.toLowerCase();
              return addresses.every(a => a.address.toLowerCase() !== mainAddr);
            },
            'Additional address cannot be the same as main address'
          ),
        socialProof: z.object({
          twitter: z
            .string()
            .optional()
            .refine(
              (url) => !url || urlRegex.test(url),
              'Invalid Twitter post URL'
            )
            .refine(
              (url) => !url || url.includes('twitter.com') || url.includes('x.com'),
              'URL must be a Twitter/X post'
            ),
          discord: z
            .string()
            .optional()
            .refine(
              (url) => !url || urlRegex.test(url),
              'Invalid Discord post URL'
            )
            .refine(
              (url) => !url || url.includes('discord.com'),
              'URL must be a Discord post'
            ),
        }),
      })
    );
  }, [networkData.connectedAddress]);
};