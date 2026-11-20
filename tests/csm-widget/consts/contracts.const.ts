import { Address } from 'viem';
import { widgetFullConfig } from 'tests/csm-widget/config';

type ModuleContracts = {
  module: Address;
  accounting: Address;
  ejector: Address;
  permissionlessGate: Address;
};

type CsmContracts = {
  stETH: Address;
  wstETH: Address;
  csm: ModuleContracts & { icsGate: Address; idvtcGate: Address };
  csm02: ModuleContracts;
};

const CONTRACTS: Record<number, CsmContracts> = {
  1: {
    stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    csm: {
      module: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
      accounting: '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
      ejector: '0x610B517D380f287c239C93F8eF6FfBd567AA4bA5',
      permissionlessGate: '0xb8cd8F059Ad7a5dB8CAfDe34aAb007317F7156C8',
      icsGate: '0xB314D4A76C457c93150d308787939063F4Cc67E0',
      idvtcGate: '0xa12760721A72A7199aB38059DA6690b9Cd4ed7B8',
    },
    csm02: {
      module: '0x792Cd25e4aE3578375031FB55e048E163A804F7B',
      accounting: '0x3696dDd942A9e156F5D4728505D1b9a32dCef900',
      ejector: '0x2EE500885870b020e84E86a09A5d26D1EEec3E5E',
      permissionlessGate: '0x78e36353FE904c3685585D9F3204D4aAcb3Ad506',
    },
  },
  560048: {
    stETH: '0x3508A952176b3c15387C97BE809eaffB1982176a',
    wstETH: '0x7E99eE3C66636DE415D2d7C880938F2f40f94De4',
    csm: {
      module: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
      accounting: '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
      ejector: '0xCAe028378d69D54dc8bF809e6C44CF751F997b80',
      permissionlessGate: '0xd7bD8D2A9888D1414c770B35ACF55890B15de26a',
      icsGate: '0x10a254E724fe2b7f305F76f3F116a3969c53845f',
      idvtcGate: '0x887F8512F9998045f4b5993e6eaa6BCfE5F02A94',
    },
    csm02: {
      module: '0xbb7dd81FAC80f3Effa10eA8b973c15AE65a4CAf9',
      accounting: '0x04A0294bF3306532309D7DD776D4A7eF502313e0',
      ejector: '0xf8a71C08DBe7D2efaD76D3951a3065B8cE20e4f0',
      permissionlessGate: '0x5AD784cD0A3291e083b015a81E53c6ec70bd5Ef7',
    },
  },
};

export const contracts =
  CONTRACTS[widgetFullConfig.standConfig.networkConfig.chainId];
