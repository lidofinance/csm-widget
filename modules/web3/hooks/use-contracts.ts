import {
  CSAccountingAbi,
  CSEarlyAdoptionAbi,
  CSFeeDistributorAbi,
  CSFeeOracleAbi,
  CSModuleAbi,
  CSVerifierAbi,
  ExitBusOracleAbi,
  HashConsensusAbi,
  StakingRouterAbi,
} from 'abi';
import { useCsmAddress } from 'shared/hooks';

export const useCSModule = () => {
  const address = useCsmAddress('CSModule');
  return { abi: CSModuleAbi, address };
};

export const useCSAccounting = () => {
  const address = useCsmAddress('CSAccounting');
  return { abi: CSAccountingAbi, address };
};

export const useCSEarlyAdoption = () => {
  const address = useCsmAddress('CSEarlyAdoption');
  return { abi: CSEarlyAdoptionAbi, address };
};

export const useCSFeeDistributor = () => {
  const address = useCsmAddress('CSFeeDistributor');
  return { abi: CSFeeDistributorAbi, address };
};

export const useCSFeeOracle = () => {
  const address = useCsmAddress('CSFeeOracle');
  return { abi: CSFeeOracleAbi, address };
};

export const useCSVerifier = () => {
  const address = useCsmAddress('CSVerifier');
  return { abi: CSVerifierAbi, address };
};

export const useExitBusOracle = () => {
  const address = useCsmAddress('ExitBusOracle');
  return { abi: ExitBusOracleAbi, address };
};

export const useHashConsensus = () => {
  const address = useCsmAddress('HashConsensus');
  return { abi: HashConsensusAbi, address };
};

export const useStakingRouter = () => {
  const address = useCsmAddress('StakingRouter');
  return { abi: StakingRouterAbi, address };
};
