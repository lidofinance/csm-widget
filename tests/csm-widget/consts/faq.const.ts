import { widgetFullConfig } from 'tests/csm-widget/config';

export type FaqSection = {
  title: string;
  text: string;
  links: { name: string; url: string }[];
};

const IS_MAINNET = widgetFullConfig.standConfig.networkConfig.chainId === 1;

// values the widget reads from the chain, as it renders them
const NETWORK = IS_MAINNET
  ? {
      name: 'mainnet',
      discordChannel: 'csm-mainnet',
      withdrawalVault: '0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f',
      rewardsVault: '0x388C818CA8B9251b393131C08a736A67ccB19297',
      frame: '28 days',
      rebase: '225 epochs (24hrs)',
      // stake share limit of 0x01 CSM, the module of the FULL_OPERATOR preset
      shareLimit: '9%',
    }
  : {
      name: 'hoodi',
      discordChannel: 'csm-testnet',
      withdrawalVault: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
      rewardsVault: '0x9b108015fe433F173696Af3Aa0CF7CDb3E104258',
      frame: '14 days',
      rebase: '12 epochs (1hr 20min)',
      shareLimit: '16%',
    };

// bond curves are the same on both networks; 0x02 CSM is on hoodi only
const BOND = {
  first: '2.4 ETH',
  firstIcs: '1.5 ETH',
  second: '1.3 ETH',
  first0x02: '32.0 ETH',
  second0x02: '30.0 ETH',
};
const KEY_REMOVAL_FEE = '0.02 ETH';
const PERFORMANCE_LEEWAY = '3%';

const EIP_7002 = 'https://eips.ethereum.org/EIPS/eip-7002';
const DISCORD = 'https://discord.com/invite/lido';
const MERKLE_TREE = 'https://en.wikipedia.org/wiki/Merkle_tree';
const CSM_PORTAL =
  'https://operatorportal.lido.fi/modules/community-staking-module';
const PERFORMANCE_ORACLE = `${CSM_PORTAL}#block-c6dc8d00f13243fcb17de3fa07ecc52c`;
const ADDRESSES_MANAGEMENT = `${CSM_PORTAL}#block-d3ad2b2bd3994a06b19dccc0794ac8d6`;
const STAKESAURUS = 'https://dvt-homestaker.stakesaurus.com';
const MEV_BOOST_SETUP = `${STAKESAURUS}/keystore-generation-and-mev-boost/set-up-and-configure-mev-boost`;

const EJECTION_CASES = `The validator has excessive number of performance strikes assigned;
The validator was requested to exit by VEBO but have not exited in time;
Based on the Lido DAO decision;`;

const MEV_BOOST_LINE = IS_MAINNET
  ? 'Configure your MEV-Boost service. Min-bid may be configured either at MEV-Boost level or at the CL client, the current acceptable maximum value for min-bid is 0.07 based on community consensus and may change. Builder-boost-factor should be set to 100%, i.e. local and builder payloads should be treated with equal weights. The relay flags should be set to a list of values only using relays from the list of Vetted MEV-Boost Relays for Lido CSM. Note that at least one “must use” relay should be used. Relays not mentioned in the list are not allowed for use'
  : `Configure your MEV-Boost service. Do not set the \`min-bid\` flag (or set 0) and set the \`relay\` flags only to the list of designated MEV relays for Lido CSM on ${NETWORK.name}`;

const TECHNICAL_HELP = `For community assistance, join the "${NETWORK.discordChannel}" channel on the Lido Discord server to seek advice and guidance.`;

export const FAQ_GENERAL: FaqSection[] = [
  {
    title: 'Why run an Ethereum validator?',
    text: `Running an Ethereum validator allows one to:
Receive Staking Rewards: Validators get network rewards for performing their duties on the Ethereum blockchain (note: incorrectly or not performing duties incurs penalties).
Support the Network: By running a validator, you actively contribute to the decentralization and security of the Ethereum network. Validators play a crucial role in reaching consensus and validating transactions, which enhances the network's reliability and resilience.
Learn and Engage with the community: Operating a validator node provides valuable insights into blockchain technology and consensus mechanisms. Through hands-on experience, individuals can deepen their understanding of Ethereum's inner workings. Moreover, it provides an opportunity to engage with the Ethereum community, share knowledge, and contribute to the network's development.`,
    links: [],
  },
  {
    title: 'What is required to be a Node Operator in CSM?',
    text: `Node operation in CSM involves a long-term commitment to Ethereum's decentralization. Responsibilities include:
Hardware Setup: Setting up a computer that meets the system requirements for running validator nodes.
Configuration: Properly configuring nodes and validators, ensuring they are in sync with the Ethereum blockchain and other network participants.
Security Measures: Implementing robust security measures to safeguard against external threats and internal vulnerabilities.
Maintenance: Sustaining ongoing maintenance throughout the validator's lifespan, which involves monitoring performance, troubleshooting issues, and applying necessary updates.`,
    links: [],
  },
  {
    title: 'What do node operators receive in CSM?',
    text: `Node operators benefit from:
Daily Bond Rebase: The collateral for CSM NOs is eligible for rewards through stETH's rebase, even before validator activation.
Socialized Rewards: Rewards are smoothed across the largest validator set, mitigating volatility. This means that even in the event of small outages or disruptions, node operators can still receive rewards, reducing the risk of rewards loss.`,
    links: [
      {
        name: "rewards through stETH's rebase",
        url: 'https://help.lido.fi/en/articles/5230610-what-is-steth',
      },
    ],
  },
  {
    title: 'What are the risks of running a validator?',
    text: `Node operators face several risks, including:
Technical Risk: Maintaining reliable and secure hardware and software setups is essential. Any technical failure or vulnerability in the validator setup could lead to penalties.
Penalties for Misbehavior: Validators can be penalized for various reasons, such as going offline or attempting to manipulate the network.
Market Risk: The value of ETH can fluctuate significantly, impacting the value of the validator's staked ETH.
Network Risk: Validators are part of a decentralized network, and the security and stability of the Ethereum network as a whole can affect individual validators. Events such as network attacks or protocol upgrades may impact validator operations, leading to potential disruptions or losses.
Operational Risk: Validators require ongoing maintenance and monitoring to ensure smooth operation. Any operational issues, such as hardware failures or connectivity issues, could disrupt validator performance and result in rewards losses.
Slashing Risk: Validators can be slashed, meaning they lose a portion of their staked ETH, for violating network rules or behaving maliciously. Slashing can occur due to actions such as double signing or failing to validate correctly, resulting in significant penalties.`,
    links: [],
  },
  {
    title: 'How does CSM work?',
    text: `CSM consists of two permissionless modules: 0x01 CSM, for validators with a balance of 32 ETH, and 0x02 CSM, for validators with a balance of up to 2,048 ETH.
Refer to the CSM page for a more detailed explanation of its mechanics and functionalities.`,
    links: [{ name: 'the CSM page', url: CSM_PORTAL }],
  },
  {
    title: 'What makes CSM unique?',
    text: `CSM provides several unique features to attract and benefit community stakers:
Rewards Smoothing: Rewards, including Execution Layer (EL) rewards and MEV, are smoothed with other modules to provide more stable rewards comparable to operating validators solo.
Low Bond Requirement: A low bond for node operators makes participation more accessible to a broader range of prospective operators.
Exclusive Use of ETH (stETH): CSM exclusively uses ETH ((w)stETH) for bond and rewards, eliminating the need for other assets and simplifying the process for node operators. The bond can be submitted as ETH, wstETH, or stETH, and both bond and rewards can be withdrawn in any of the three forms (withdrawals in the form of ETH follow the normal Lido on Ethereum unstaking process).
Enhanced User Experience: Accessible through a multitude of options -- from a web UI to integrations with Dappnode, Stereum, Eth-Docker, Sedge, EthPillar, etc., CSM offers a leading user-friendly experience, with reduced gas fees for on-chain operations and simplified transactions for joining and claiming rewards.
Higher Reward Potential: Node operators are potentially able to earn more rewards compared to vanilla solo staking, making CSM an attractive option for operators looking to run more validators to earn rewards.`,
    links: [
      {
        name: 'normal Lido on Ethereum unstaking process',
        url: 'https://help.lido.fi/en/articles/7858323-how-do-i-unstake-my-steth',
      },
    ],
  },
  {
    title: 'How much bond is needed?',
    text: `In 0x01 CSM, the bond is ${BOND.first} for the first validator (${BOND.firstIcs} for Identified Community Stakers) and ${BOND.second} for subsequent validators. In 0x02 CSM, it is ${BOND.first0x02} for the first validator and ${BOND.second0x02} for subsequent validators.
The amount for the second and subsequent validators is ${BOND.second}
For the ${NETWORK.name}, the values for the bond curve are the following:`,
    links: [],
  },
  {
    title: 'How can I get help?',
    text: TECHNICAL_HELP,
    links: [{ name: 'Lido Discord server', url: DISCORD }],
  },
];

export const FAQ_KEYS: FaqSection[] = [
  {
    // the title ends with the network name
    title: 'How to set up a validator for CSM',
    // the copy icon after an address is read as a line break, hence ` , specify`
    text: `A detailed guide on preparing all the validation tools for CSM can be found here.
A shorter flow of setting up a CSM validator for ${NETWORK.name} looks as follows:
Generate new validator keys setting the withdrawal_address to the Lido Withdrawal Vault on ${NETWORK.name}: ${NETWORK.withdrawalVault} , specify the deposit amount of 32 ETH, and set WC type to 0x01 for 0x01 CSM or 0x02 for 0x02 CSM (do NOT make a deposit)
Configure your validator client (and/or beacon node) setting the fee_recipient flag to the designated fee recipient address (Lido Execution Layer Rewards Vault) on ${NETWORK.name}: ${NETWORK.rewardsVault} and import the newly generated CSM keystores
${MEV_BOOST_LINE}
Upload the newly generated deposit data file pertaining to your CSM keystores onto the Lido CSM Widget and provide the required bond amount in ETH/stETH/wstETH. Before uploading, make sure that nodes are synced, running, and corresponding keystores are imported. Hence, your setup is ready for the validator activation
Wait for your CSM validator keys to be deposited through the protocol and make sure your node remains online in the meantime!`,
    links: [
      { name: 'here', url: `${STAKESAURUS}/bonded-validators-setup/lido-csm` },
      {
        name: 'Generate new validator keys',
        url: `${STAKESAURUS}/keystore-generation-and-mev-boost/validator-key-generation`,
      },
      {
        name: 'Configure your validator client',
        url: `${STAKESAURUS}/native-solo-staking-setup/validator-client-setup`,
      },
      { name: 'Configure your MEV-Boost service', url: MEV_BOOST_SETUP },
      ...(IS_MAINNET
        ? [
            {
              name: 'based on community consensus',
              url: 'https://research.lido.fi/t/lido-node-operator-mev-boost-min-bid-guidance/3347',
            },
            {
              name: 'the list of Vetted MEV-Boost Relays for Lido CSM',
              url: 'https://enchanted-direction-844.notion.site/6d369eb33f664487800b0dedfe32171e?v=8e5d1f1276b0493caea8a2aa1517ed65',
            },
          ]
        : [
            {
              name: 'the list of designated MEV relays for Lido CSM on',
              url: 'https://www.notion.so/6d369eb33f664487800b0dedfe32171e?pvs=21',
            },
          ]),
      {
        name: 'Upload the newly generated deposit data',
        url: `${STAKESAURUS}/bonded-validators-setup/lido-csm/upload-remove-view-validator-keys`,
      },
      { name: 'the Lido CSM Widget', url: 'https://csm.lido.fi/' },
    ],
  },
  {
    title: 'Why upload a bond?',
    text: `Submitting a bond serves as a risk mitigation measure for both the Ethereum network and the Lido protocol.
There are several major reasons for a CSM Node Operator's bond to be penalized, including:
The operator has stolen EL rewards (MEV). Penalty amount = amount stolen + fixed stealing fine;
The validator's withdrawal balance is less than its highest confirmed balance. Penalty amount = (highest confirmed balance) - validator's withdrawal balance;
The operator has not exited the validators in time. Penalty amount = exitDelayPenalty (a fixed amount for every 32 ETH of balance in the validator set by the DAO);
The validator has been ejected via EIP-7002 due to an excessive number of strikes. Penalty amount = badPerformancePenalty (a fixed amount for every 32 ETH of balance in the validator set by the DAO);
Force ejection via EIP-7002 was triggered for the validator. Penalty amount = min(actual TW fee paid, maxWithdrawalRequestFee).`,
    links: [{ name: 'EIP-7002', url: EIP_7002 }],
  },
  {
    title: 'How much bond is needed?',
    text: `In 0x01 CSM, the bond is ${BOND.first} for the first validator (${BOND.firstIcs} for Identified Community Stakers) and ${BOND.second} for subsequent validators. In 0x02 CSM, it is ${BOND.first0x02} for the first validator and ${BOND.second0x02} for subsequent validators.
For the ${NETWORK.name}, the values for the bond curve are the following:`,
    links: [],
  },
  {
    title: 'What is the bond curve?',
    text: `The bond curve is a function that determines the amount of bond required for each subsequent validator operated by the node operator. For Identified Community Stakers (ICS), a unique bond curve function is applied to incentivize independent stakers participation.
The bond curve is based on the number of validators, not on their balance, so no additional bond is required when a 0x02 validator is topped up towards 2,048 ETH.
For the ${NETWORK.name}, the values for the bond curve are the following:`,
    links: [
      {
        name: 'The bond curve',
        url: `${CSM_PORTAL}#block-2d1c307d95fc4f8ab7c32b7584f795cf`,
      },
    ],
  },
  {
    title: 'Difference between bond types (ETH, stETH, wstETH)?',
    text: `Bonds are stored in the form of stETH to so that participation as a Node Operator is more capital efficient than if the bond were un-staked (or could only be staked if sufficient deposits to fill the submitted validators were present). While node operators can submit bond in ETH, stETH, or wstETH, any token other than stETH is converted to stETH for consistency in bond format.`,
    links: [],
  },
  {
    title: 'When does a validator become active?',
    text: `After key submission, and if keys have been successfully validated, two actions are required for a validator to be activated:
Deposit by Lido Protocol: The time to deposit a validator is unpredictable and depends on factors such as total stake inflows and outflows, gas considerations, module shares, CSM deposit queue size, and the Node Operator's place in the queue.
Activation on Ethereum Network: Once deposited, the validator enters the Beacon Chain activation queue. The time to activation depends on the total number of validators in the queue awaiting activation and the rate of queue processing, which varies based on the total number of active Ethereum validators.`,
    links: [],
  },
  {
    title: 'How do seed deposits and top-ups work in 0x02 CSM?',
    text: `0x02 CSM validators receive stake in two steps:
Seed deposit: Uploaded keys wait in the deposit queue for their initial 32 ETH deposit, the same way as in 0x01 CSM. This allows the validator to start the activation process without waiting for the full 2,048 ETH.
Top-ups: Once seeded, the validator enters the top-up queue, where it receives additional stake until it reaches 2,048 ETH. The top-up queue follows the order of the seed deposits, and only a limited number of validators can be in it at the same time. While the top-up queue is full, new seed deposits wait until a validator is fully topped up and frees a seat.
The time to fully top up a validator depends on factors such as total stake inflows and outflows, module shares, and the validator's position in the top-up queue. Hence, an active 0x02 CSM validator may not always have a balance of 2,048 ETH. Top-ups do not require additional bond.`,
    links: [],
  },
  {
    title: 'Why pay for key deletion?',
    text: `Key deletion incurs a removal fee of ${KEY_REMOVAL_FEE}, which is deducted from the Node Operator's bond per each deleted key to cover the maximal possible operational costs associated with the queue processing. This fee is intended to protect the module from potential DoS attacks by malicious actors who could clog the queue with empty slots by adding and removing keys, and covers the maximal possible operational costs associated with the queue processing. The fee discourages misuse, keeping the system clear of invalid keys or keys that don't end up being deposited to.`,
    links: [],
  },
  {
    title: "Can't see the key for deletion?",
    text: `Only keys that have not been deposited yet can be deleted. If a key has already been deposited, you can either exit the validator on the Consensus Layer (CL) or use the triggerable withdrawals mechanism to eject your validator (can be done on the "Keys" → "Delete" → "Eject" tab). Once withdrawn, the node operator can claim the excess bond.`,
    links: [
      {
        name: 'exit the validator on the Consensus Layer (CL)',
        url: `${STAKESAURUS}/bonded-validators-setup/lido-csm/exiting-csm-validators`,
      },
    ],
  },
  {
    title: 'How to stop validating in CSM?',
    text: `Exiting CSM validator keys works the same way as exiting solo staking validator keys. The guide on how to exit the validator can be found here.`,
    links: [
      {
        name: 'here',
        url: `${STAKESAURUS}/bonded-validators-setup/lido-csm/exiting-csm-validators#manual-exit`,
      },
    ],
  },
  {
    title:
      'What is the difference between removing, exiting, and ejecting a key?',
    text: `Removing a key is an operation when the validator key is removed from the Node Operator on-chain keys storage in CSM. Only non-deposited keys can be removed. Due to associated queue maintenance costs keyRemovalCharge is charged from the Node Operator's bond for each removed key.
Exiting a key (validator) is an operation when the Node Operator publishes a voluntary exit message associated with the corresponding active validator to the Beacon chain. Once published, the exit process will be started for the validator. Note that only activated validators might be exited. Also, a period of 256 epochs (approx. 27 hours) should pass since the validator activation before the voluntary exit message can be published.
Ejecting the key (validator) is an operation when the validator exit is initiated from the validator's withdrawal credentials on Execution layer. Since all validators in CSM have their withdrawal credentials set to Lido Withdrawal Vault, the process can only be initiated from this smart contract. CSM provides a proxy method for the Node Operators to voluntary eject their validators if they decide to do so. In this case, the Node Operator is responsible for attaching a corresponding payment to cover TW fee. Also, ejection can be invoked from the Lido protocol side in the following cases:
${EJECTION_CASES}`,
    links: [{ name: 'TW fee', url: EIP_7002 }],
  },
  {
    title: 'When does a validator become withdrawn?',
    text: `On the Ethereum network, a validator can be withdrawn after successfully exiting from the consensus layer, but the exact timing of withdrawal depends on several factors related to Ethereum protocol mechanics:
Exit Queue: When a validator initiates an exit, it enters an exit queue. The time required to exit depends on the number of validators exiting and the churn limit (the number of validators allowed to exit or enter per epoch).
Withdrawal Process: After exiting the active validator set, the validator enters a withdrawable state. This state is determined by the withdrawable epoch, which is set to the exit epoch + a minimum delay of 256 epochs (~27 hours).
Finalization of Withdrawal: Once the withdrawable epoch is reached, the validator balance will be transferred to the validator's withdrawal credentials (in the case of the Lido protocol, the Lido Withdrawal Vault) within the next iteration of the Consensus Layer withdrawal sweep cycle. How long this takes depends on the validator's position in the overall sweep cycle, and time difference between the withdrawable epoch and when its turn will come to be swept. Once the withdrawal has occurred, the fact of the withdrawal can be reported to CSM permissionlessly. Once that occurs, the part of the Node Operator's bond used for this validator is released. At this point, the Node Operator can claim the bond on the Bond & Rewards Claim tab.`,
    links: [],
  },
  {
    title: 'Why a key can get ejected?',
    text: `Validator ejection can be invoked from the Lido protocol side in the following cases:
${EJECTION_CASES}
Also, Node Operators can voluntary eject their validators if they decide to so. In this case, the Node Operator is responsible for attaching a corresponding payment to cover TW fee.`,
    links: [{ name: 'TW fee', url: EIP_7002 }],
  },
  {
    title: 'What is the CSM Stake Share Limit?',
    text: `The stake share limit is a parameter defined for each Staking Module based on its risk profile. It determines the percentage of the total stake in the Lido Protocol that can be allocated to the module, 0x01 CSM and 0x02 CSM each have their own stake share limit. Currently, the stake share limit for 0x01 CSM is set at ${NETWORK.shareLimit}.
The number of keys already in the deposit queue, and the position of your keys in this queue
The number of keys that will exit from CSM
Changes in the total volume of stake in the Lido Protocol (both net flows as well as whether overall Lido protocol stake increases or not)
In other words, if keys had not been deposited to before CSM reached its limit, they may still be deposited to later if:
The overall stake volume in the Lido Protocol increases
Keys exit from CSM, freeing up space for new keys
The DAO decides to increase CSM's stake share limit
While keys are awaiting deposit, Node Operators continue to receive daily bond rewards based on the bond they submitted. However, they do not receive Node Operator rewards, as the keys remain inactive until they are fully deposited.`,
    links: [],
  },
  {
    title: 'What to do in case of technical issues?',
    text: TECHNICAL_HELP,
    links: [{ name: 'Lido Discord server', url: DISCORD }],
  },
];

export const FAQ_BOND_REWARDS: FaqSection[] = [
  {
    title: 'What rewards do I get in CSM?',
    text: `When CSM operators use the Lido protocol to run validators, they can receive two types of rewards:
Node Operator rewards: a share of rewards from staker locked stake amount, currently calculated pro-rata based on the effective balance of validators operated as a share of total protocol stake, with possible reductions for bad performance.
Bond rebase: staking rewards pertaining to the bonded tokens (stETH).`,
    links: [
      {
        name: 'possible reductions for bad performance',
        url: PERFORMANCE_ORACLE,
      },
    ],
  },
  {
    title: 'How often do I get rewards?',
    text: `Node Operator rewards on ${NETWORK.name} are calculated and made claimable by the CSM Oracle every ${NETWORK.frame}. Rewards do not have to be claimed during every reporting frame, and can be left to accumulate to be claimed later.
Bond rebase part of the rewards come from stETH being a rebasing token and the bond being stored in stETH. After each Accounting Oracle report that happens on ${NETWORK.name} every ${NETWORK.rebase}, the share rate changes. Hence, the same amount of stETH shares will now be equal to a bigger stETH token balance.`,
    links: [],
  },
  {
    title: 'Why didn’t I get rewards?',
    text: `If your validator's performance was below the threshold within the CSM Performance Oracle frame (${NETWORK.frame} for ${NETWORK.name}) the validator does not receive rewards for the given frame. Read more about the CSM Performance Oracle.`,
    links: [{ name: 'the CSM Performance Oracle', url: PERFORMANCE_ORACLE }],
  },
  {
    title: 'Why add a bond?',
    text: `Submitting a bond serves as a risk mitigation measure for both the Ethereum network and the Lido protocol.
There are several major reasons for a CSM Node Operator's bond to be penalized, including:
The operator has stolen EL rewards (MEV). Penalty amount = amount stolen + fixed stealing fine;
The validator's withdrawal balance is less than 32 ETH. Penalty amount = 32 - validator's withdrawal balance;
The operator has not exited the validators in time. Penalty amount = exitDelayPenalty (a fixed amount set by the DAO);
The validator has been ejected via EIP-7002 due to an excessive number of strikes. Penalty amount = badPerformancePenalty (a fixed amount set by the DAO);
Force ejection via EIP-7002 was triggered for the validator. Penalty amount = min(actual TW fee paid, maxWithdrawalRequestFee).`,
    links: [{ name: 'EIP-7002', url: EIP_7002 }],
  },
  {
    title: 'How to claim ETH using a withdrawal NFT',
    text: `Claiming bond and rewards in a form of ETH constitutes an stETH withdrawal process (unstake).
The withdrawal process consists of several steps you need to do:
Submit a withdrawal request by choosing ETH as a token for bond/rewards claim. As a result of this step, you will receive a withdrawal NFT.
Claim your ETH after request fulfilment. The fulfilment process takes 1-5 days (or longer), depending on a variety of factors. To know if your ETH is ready to be claimed you, can check its status on the Claim page. If your request is marked as "Ready to claim", it is time for you to get your ETH back.
For more information about withdrawals, follow the page.`,
    links: [
      {
        name: 'depending on a variety of factors',
        url: 'https://help.lido.fi/en/articles/7858315-how-long-does-an-ethereum-withdrawal-take',
      },
      {
        name: 'follow the page',
        url: 'https://help.lido.fi/en/collections/3993867-ethereum-withdrawals',
      },
    ],
  },
];

export const FAQ_LOCKED_BOND: FaqSection[] = [
  {
    title: 'Why is the bond locked?',
    text: `Bond may be locked in the case of delayed penalties, typically for MEV stealing event reported by a dedicated committee. This measure ensures that node operators are held accountable for any misbehavior or rule violations.`,
    links: [],
  },
  {
    title: 'How to unlock the bond?',
    text: `To unlock the bond, the penalty amount, which includes the stolen amount and a fixed stealing fine, must be compensated on the "Locked bond" tab. This action can be performed from the Manager Address of the Node Operator.
If there are disputes regarding the penalty, node operators can start a public discussion about the penalty applied on the Lido research forum under the CSM Support category.`,
    links: [
      { name: 'CSM Support', url: 'https://research.lido.fi/c/csm-support/21' },
    ],
  },
  {
    title: 'Consequences of not compensating?',
    text: `In case of refusal to compensate the penalty, a protocol rule violation occurs which results in the reset of all node operator benefits. The locked bond is burned to compensate all stETH holders for the rewards stolen.`,
    links: [],
  },
];

export const FAQ_ROLES: FaqSection[] = [
  {
    title: 'What are rewards and manager addresses?',
    text: `There are two addresses associated with your Node Operator that have different scope of responsibilities for managing your Node Operator.
The Rewards Address is used for:
Claiming bond and rewards
Adding extra bond amount
Covering locked bond
Proposing a new Rewards Address
Resetting the Manager Address to the current Rewards Address
Setting up rewards splits
The Manager Address is used for:
Adding new keys
Removing existing keys
Adding extra bond amount
Claiming bond and rewards to the Rewards Address
Covering locked bond
Proposing a new Manager Address
Read more about addresses management here.`,
    links: [{ name: 'here', url: ADDRESSES_MANAGEMENT }],
  },
  {
    title: 'Why should these addresses be different?',
    text: `It's recommended to use different addresses for security reasons. For example, a hot wallet may be used for the Manager Address to simplify daily operations, while a cold wallet (or something like a Safe) is preferable for the Rewards Address to enhance security.
Read more about addresses management here.`,
    links: [{ name: 'here', url: ADDRESSES_MANAGEMENT }],
  },
  {
    title: 'How to accept a change in address request?',
    text: `To accept a change in address request, connect to the CSM widget with the new address, navigate to the "Roles" → "Inbox requests" tab, select and accept the request, and confirm the transaction in your wallet. Changes are made once the transaction is processed.`,
    links: [],
  },
  {
    title: 'What to do if the change is submitted to a wrong address?',
    text: `If a role change was submitted to the wrong address, the change can be revoked. For Rewards Address changes, navigate to "Roles" → "Rewards Address" → "Cancel". For Manager Address changes, go to "Roles" → "Manager address" → "Cancel"`,
    links: [],
  },
  {
    title: 'What happens to rewards after changing the Rewards Address?',
    text: `Rewards claimed to the previous Rewards Address remain there. After changing the Rewards Address, all rewards and excess bond accumulated on the bond balance can be claimed to the new Rewards Address. In the event of validator withdrawal, upon claiming of the bond, it would also be returned to the new Rewards Address.`,
    links: [],
  },
  {
    title: 'What is a Rewards Splitter?',
    text: `The Rewards Splitter allows distributing Node Operator rewards across up to 10 additional addresses, each receiving a set percentage in stETH. Split recipients receive their shares first, and the remaining part is sent to the Rewards Address when rewards are claimed. This can be used, for example, for infrastructure providers that charge a percentage of the rewards, or for opt-in donations.
Splits apply to Node Operator rewards only, not to the bond rebase. They can only be changed when there are no claimable rewards, and the initial configuration can only be changed after the first rewards distribution, so make sure to review the recipient addresses carefully.`,
    links: [],
  },
  {
    title: 'What is a Rewards Claimer?',
    text: `The Rewards Claimer is an optional address authorized to claim rewards on behalf of the Node Operator. It does not receive any funds, as claimed rewards are always sent to the Rewards Address. This is useful for automating reward claims without giving access to the Rewards or Manager Address.`,
    links: [],
  },
];

export const FAQ_OPERATOR_TYPES: FaqSection[] = [
  {
    title: 'What is a Node Operator type?',
    text: `Node Operator type is a set of custom parameters values for a Node Operator in CSM. Node Operator type is determined based on the Node Operator's bond curve. The full list of parameters for the Node Operator is:
keyRemovalCharge - a fee charged for each deleted deposit data record;
generalDelayedPenaltyAdditionalFine - an additional fine charged for each validator that has stolen EL rewards;
keysLimit - a limit on the number of active keys for the Node Operator;
queuePriority and maxDeposits - parameters defining the priority queue for the Node Operator;
rewardShareData - a share of the Node Operator rewards that the Node Operator receives for each validator. Can be customized depending on the key index in the Node Operator's keys storage;
performanceLeeway - a leeway for the Node Operator's validator's performance, which is used to define a performance threshold. Can be customized depending on the key index in the Node Operator's keys storage;
strikesLifetime and strikesThreshold - parameters defining the Node Operator's strikes system, which is used to decide on the Node Operator's validator's ejection due to systematic bad performance;
badPerformancePenalty - a penalty charged for each validator that has been ejected due to bad performance;
performanceCoefficients - coefficients used to calculate the Node Operator's performance based on the validator's effectiveness in performing duties like attestation, proposing blocks, and sync committee participation;
allowedExitDelay - an allowed delay between the moment Node Operator's validator was requested to exit and the moment it is actually initiated exit process;
exitDelayFee - a penalty charged for each validator that has been requested to exit but has not exited within the allowed delay;
maxElWithdrawalRequestFee - a maximum fee charged for each Node Operator's validator that has been forcefully ejected using EIP-7002;`,
    links: [{ name: 'EIP-7002', url: EIP_7002 }],
  },
  {
    title: 'What operator types exist?',
    text: `Currently there are three Node Operator types:
CSM 0x01 operator - the default Node Operator type assigned to all new Node Operators joining CSM via the Default Gate;
Identified Community Staker - the custom Node Operator type assigned to the new Node Operators joining via the Identified Community Stakers Gate. This type can also be claimed by the Node Operators who have passed the identification process after joining CSM via the Default Gate;
Identified DVT Clusters (IDVTC) - the custom Node Operator type designed for DVT Clusters and creates a more capital-efficient path for independent stakers who are willing to identify themselves and operate validators collaboratively via DVT. This approach combines the trust properties of ICS with the operational resilience of DVT, aligning incentives for small independent operators who share validator rewards within a cluster;
CSM 0x02 operator - the Node Operator type assigned to all Node Operators joining 0x02 CSM, designed for validators with 0x02 withdrawal credentials and a balance of up to 2,048 ETH. Although it is shown as a Node Operator type, 0x02 CSM is a separate module, so it is possible to run validators in 0x01 CSM and 0x02 CSM at the same time, with a separate Node Operator in each module.`,
    links: [],
  },
];

export const FAQ_MONITORING: FaqSection[] = [
  {
    title: 'What is the performance threshold?',
    text: `The performance threshold is a relative variable determined as follows:
CSM Performance threshold (%) = Average validator performance across the whole Ethereum network (%) - ${PERFORMANCE_LEEWAY}
A performance threshold is utilized to determine the allocation of the actual Node Operator rewards. Validators with performance above the threshold are included in the allocation pool, while the rest are not.`,
    links: [],
  },
  {
    title: 'How does the CSM Performance Oracle work?',
    text: `The Performance Oracle calculates validators performance based on their attestation, block proposal, and sync committee participation effectiveness. The exact formulas for performance calculation can be found here. The Performance Oracle compares the performance of each validator with the performance threshold to determine whether the validator should or should not be included in the rewards distribution during the frame.
The frame for the Performance Oracle report is set to ${NETWORK.frame}. The Performance Oracle creates a Merkle tree with the allocation of the Node Operator rewards and delivers the root on-chain. To make the original tree available to users, it is published on IPFS and GitHub.`,
    links: [
      {
        name: 'here',
        url: 'https://hackmd.io/@lido/csm-v2-tech#Updated-CSM-Performance-Oracle-metric',
      },
      { name: 'Merkle tree', url: MERKLE_TREE },
      { name: 'IPFS', url: 'https://ipfs.tech/' },
      { name: 'GitHub', url: 'https://github.com/lidofinance/csm-rewards' },
    ],
  },
  {
    title: 'What is a strike?',
    text: `A strike is an indicator of the validator performing below the performance threshold in the given frame. Strikes have a lifetime — a time after which the strike is no longer considered valid and gets removed form the strikes Merkle tree delivered by the Performance Oracle.`,
    links: [{ name: 'Merkle tree', url: MERKLE_TREE }],
  },
  {
    title: 'How are the strikes assigned?',
    text: `Strikes are assigned on per-validator basis. If the validator's performance within a Performance Oracle frame is below the threshold, a strike will be assigned and reported on-chain by the Performance Oracle using Merkle tree.`,
    links: [{ name: 'Merkle tree', url: MERKLE_TREE }],
  },
  {
    title: 'What to do in case of a strike assigned?',
    text: `Since a strike is an indicator of the validator performing below the performance threshold in the given frame, Node Operators should improve their validator's performance to avoid getting additional strikes. If the validator gets more than strikesThreshold strikes assigned, it will be ejected using EIP-7002. In case of ejection both badPerformancePenalty and min(actual TW fee paid, maxWithdrawalRequestFee)will be confiscated from the Node Operator's bond upon validator withdrawal reporting.
If Node Operators are unable to maintain validator's performance above the performance threshold they should voluntary exit their validators immediately to avoid damaging overall protocol's performance and application of the corresponding penalties.`,
    links: [{ name: 'EIP-7002', url: EIP_7002 }],
  },
];
