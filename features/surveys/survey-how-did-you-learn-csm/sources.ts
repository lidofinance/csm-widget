type Option = {
  label: string;
  value: string;
  otherTitle?: string;
};

type OptionSource = Option & {
  options?: Option[];
  subTitle?: string;
};

export const sources: OptionSource[] = [
  {
    label: 'Lido Community Lifeguard',
    value: 'lifeguard',
    subTitle: 'Who was it?',
    options: [
      { label: 'Sam (Stakesaurus)', value: 'sam' },
      { label: 'Isaac (enti)', value: 'isaac' },
      { label: 'StakeCat', value: 'stakecat' },
    ],
  },
  {
    label: 'Crypto Community',
    value: 'community',
    subTitle: 'Specify the community',
    options: [
      { label: 'Lido', value: 'lido' },
      { label: 'EthStaker', value: 'ethstaker' },
      { label: 'SEEDLatam', value: 'seedlatam' },
      { label: 'Bitskwela', value: 'bitskwela' },
      { label: 'ETH Mexico', value: 'ethmexico' },
      { label: 'Next Finance Tech', value: 'nextfinancetech' },
      { label: 'SSV', value: 'ssv' },
      { label: 'Obol', value: 'obol' },
      { label: 'Other', value: 'other', otherTitle: 'What was the community?' },
    ],
  },
  {
    label: 'Live Event',
    value: 'event',
    subTitle: 'Specify the event',
    options: [
      { label: 'EthCC', value: 'ethcc' },
      { label: 'KBW', value: 'kbw' },
      { label: 'Token 2049', value: 'token2049' },
      { label: 'ETH Sofia', value: 'ethsofia' },
      { label: 'Merge Madrid', value: 'mergemadrid' },
      {
        label: 'Lido gathering (Singapore)',
        value: 'lidogathering',
      },
      { label: 'Stakers Guild (Brussels)', value: 'stakersguild' },
      { label: 'Other', value: 'other', otherTitle: 'What was the event?' },
    ],
  },
  {
    label: 'Online Event',
    value: 'online',
    subTitle: 'What was the event?',
    options: [
      { label: 'Lido NOCCs', value: 'lidonocc' },
      { label: 'Lido CS Roundtables', value: 'lidocsroundtables' },
      { label: 'EthStaker Community Call - CSM', value: 'ethstakercsm' },
      { label: 'Other', value: 'other', otherTitle: 'What was the event?' },
    ],
  },
  { label: 'Friend or Colleague', value: 'friend' },
  { label: 'Other', value: 'other', otherTitle: 'Please, specify the source' },
];
