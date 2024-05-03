import { FallbackWalletStyle } from './styles';
import { useErrorMessage } from './useErrorMessage';

export const Fallback = () => {
  const error = useErrorMessage();

  if (error) {
    return <FallbackWalletStyle>{error}</FallbackWalletStyle>;
  }

  return null;
};
