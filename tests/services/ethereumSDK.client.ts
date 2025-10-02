import { test } from '@playwright/test';
import { LidoSDK, VIEM_CHAINS, CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { NetworkConfig } from '@lidofinance/wallets-testing-wallets';
import { createWalletClient, formatEther, http, PrivateKeyAccount } from 'viem';
import { HDAccount } from 'viem/accounts';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export class SdkService extends LidoSDK {
  constructor(
    private account: HDAccount | PrivateKeyAccount,
    networkConfig: NetworkConfig,
  ) {
    super({
      chainId: networkConfig.chainId,
      rpcUrls: [networkConfig.rpcUrl],
      web3Provider: createWalletClient({
        account: account,
        chain: VIEM_CHAINS[networkConfig.chainId as CHAINS],
        transport: http(networkConfig.rpcUrl),
      }),
      logMode: 'none',
    });
  }

  async getWstETHRate() {
    return test.step('[SDK] Get rate of wstETH to stETH', async () => {
      const wstETH = await this.wrap.convertWstethToSteth(
        BigInt(1000000000000000000),
      );
      return formatEther(wstETH);
    });
  }

  async getBalanceByToken(tokenName: TOKENS) {
    let formatBalance;
    switch (tokenName) {
      case TOKENS.eth:
        formatBalance = await this.core.balanceETH(this.account.address);
        break;
      case TOKENS.steth:
        formatBalance = await this.steth.balance(this.account.address);
        break;
      case TOKENS.wsteth:
        formatBalance = await this.wsteth.balance(this.account.address);
        break;
      default:
        throw new Error(`Uknown token name: ${tokenName}`);
    }

    return formatEther(formatBalance);
  }
}
