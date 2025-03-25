export const HEALTHY_RPC_SERVICES_ARE_OVER = 'Healthy RPC services are over!';

export class ClientError extends Error {}

export class UnsupportedChainIdError extends ClientError {
  constructor(message?: string) {
    super(message || 'Unsupported chainId');
  }
}

export class UnsupportedHTTPMethodError extends ClientError {
  constructor(message?: string) {
    super(message || 'Unsupported HTTP method');
  }
}
