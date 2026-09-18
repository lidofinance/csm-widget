export type Hex = `0x${string}`;
export type ChainName = 'hoodi' | 'mainnet';
export type ModuleName = 'csm' | 'cm' | 'csm02';

export type GateSelector =
  'po' | 'pto' | 'pgo' | 'do' | 'eeo' | 'iodc' | 'iodcp' | 'ics' | 'idvtc';

export type Addresses = {
  module: Hex;
  accounting: Hex;
  metaRegistry?: Hex;
  gates?: Partial<Record<GateSelector, Hex>>;
};

export const STAKING_ROUTER: Record<ChainName, Hex> = {
  mainnet: '0xFdDf38947aFB03C621C71b06C9C70bce73f12999',
  hoodi: '0xCc820558B39ee15C7C45B59390B503b83fb499A8',
};

export const ADDRESSES: Record<
  ChainName,
  Partial<Record<ModuleName, Addresses>>
> = {
  mainnet: {
    csm: {
      module: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
      accounting: '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
      gates: {
        ics: '0xB314D4A76C457c93150d308787939063F4Cc67E0',
        idvtc: '0xa12760721A72A7199aB38059DA6690b9Cd4ed7B8',
      },
    },
    cm: {
      module: '0xDa5F930cE326EB5205085D66c72A4E79d60cB8C1',
      accounting: '0x2F91e3A8C5d6593bf4F8403fCfeCcd62dF59f6F6',
      metaRegistry: '0xA64b339eebD3dC3De848298B6a140955932901d8',
      gates: {
        po: '0x6093EFA6B5E2FF3be54d1c895c9deA932805c49F',
        pto: '0x8c002c6eE10cf8adb78D1F9EB2e134FdaF8A7C1a',
        pgo: '0x207798e6fD1aa7Ee8a63782A64c959cD6727b78C',
        do: '0xeF273Ca4A21Ba7B414Ae3C9f9b443038cb133F72',
        eeo: '0x3BbBb175f7F07954DE00052b20E1c5572223F24D',
        iodc: '0x86A8d4E0db5938D21d98047544668FCCB1A9ADc8',
        iodcp: '0x773933F9db8964A17d62fb808f2EC7A2de4247CC',
      },
    },
  },
  hoodi: {
    csm: {
      module: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
      accounting: '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
      gates: {
        ics: '0x10a254E724fe2b7f305F76f3F116a3969c53845f',
        idvtc: '0x887F8512F9998045f4b5993e6eaa6BCfE5F02A94',
      },
    },
    cm: {
      module: '0x87EB69Ae51317405FD285efD2326a4a11f6173b9',
      accounting: '0x7f7356D29aCd915F1934220956c3305808ceB235',
      metaRegistry: '0x857289cCBFBc4C134Cc312022a104CD9b38d8AAE',
      gates: {
        po: '0xF1862d120831eBE31f7202378Ff3Ae63A5658ae3',
        pto: '0x410A309dF81B782190188CDB3d215729cc6bC1f3',
        pgo: '0xa5A604b172787e017b1b118F02fE54fC1D696519',
        do: '0xE966874cDB6A4282ED75Cd10439e3799e5531a2D',
        eeo: '0x5c063da03e3f21443716D75a2205EE16706e1153',
        iodc: '0x1cD655Ac53CfE8269DE0DBfc0140B074623C4A6B',
        iodcp: '0x28518be9894C20135F280a9539617783b08a04c7',
      },
    },
    csm02: {
      module: '0xbb7dd81FAC80f3Effa10eA8b973c15AE65a4CAf9',
      accounting: '0x04A0294bF3306532309D7DD776D4A7eF502313e0',
    },
  },
};
