import { FC, PropsWithChildren, useEffect } from 'react';
import { useConnect, useConnection } from 'wagmi';

// Auto-connects the mock connector on mount so useDappStatus() reports a
// connected address. Renders nothing until connected to avoid a "no-access"
// flash and any SSR/client hydration mismatch (server render is unconnected).
export const AutoConnect: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected } = useConnection();
  const { connect, connectors } = useConnect();
  useEffect(() => {
    if (!isConnected && connectors[0]) {
      connect({ connector: connectors[0] });
    }
  }, [isConnected, connect, connectors]);
  return isConnected ? <>{children}</> : null;
};
