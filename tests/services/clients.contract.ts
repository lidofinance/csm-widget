import {
  CSAccountingContract,
  CSFeeOracleContract,
  HashConsensusContract,
} from './contractClients';

export type ContractClients = {
  CSAccounting: CSAccountingContract;
  CSFeeOracle: CSFeeOracleContract;
  HashConsensus: HashConsensusContract;
};

export const contractClients: ContractClients = {
  CSAccounting: new CSAccountingContract(),
  CSFeeOracle: new CSFeeOracleContract(),
  HashConsensus: new HashConsensusContract(),
};
