export const HEALTHY_RPC_SERVICES_ARE_OVER = 'Healthy RPC services are over!';

export class ClientError extends Error {
  status = 400;
}

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

export class InvalidRequestError extends ClientError {
  constructor(message?: string) {
    super(message || 'Invalid Request');
  }
}

export class SizeTooLargeError extends ClientError {
  constructor(message?: string) {
    super(message || 'Response size too large');
  }
}

export class UpstreamError extends Error {}
