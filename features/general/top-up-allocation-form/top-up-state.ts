export type TopUpCopy = { status: string; description: string };

export const getTopUpCopy = (enabled: boolean): TopUpCopy =>
  enabled
    ? {
        status: 'Top-up are currently enabled',
        description:
          'Your Node Operator is eligible for receiving top-up deposits',
      }
    : {
        status: 'Top-up are currently disabled',
        description:
          'Your Node Operator is not eligible for receiving top-up deposits. Only the CMC can enable top-ups.',
      };
