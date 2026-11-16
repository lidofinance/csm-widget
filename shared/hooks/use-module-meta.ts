import { MODULE_METADATA } from 'consts/module';
import { useModule } from 'modules/web3';

export const useModuleMeta = () => {
  const { module } = useModule();
  return module ? MODULE_METADATA[module] : undefined;
};
