import { FallbackWalletStyle } from './styles';
import { useErrorMessage } from './use-error-message';

export const Fallback = () => {
  const error = useErrorMessage();

  if (error) {
    return <FallbackWalletStyle>{error}</FallbackWalletStyle>;
  }

  return null;
};
