interface Window {
  // see _document.js for definition
  _paq: undefined | [string, ...unknown[]][];
}

declare module '*.svg' {
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  const content: any;
  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'>
  >;
  export default content;
}

declare module 'next/config' {
  type ConfigTypes = () => {
    // some properties may be confusing, but that's okay - "serverRuntimeConfig" accepts "process.env" without modification and/or validation.
    // see: config/get-secret-config.ts
    serverRuntimeConfig: {
      basePath: string | undefined;
      developmentMode: boolean;
      maintenance: boolean;

      defaultChain: string;

      rpcUrls_1: string | undefined;
      rpcUrls_17000: string | undefined;
      rpcUrls_560048: string | undefined;

      clApiUrls_1: string | undefined;
      clApiUrls_17000: string | undefined;
      clApiUrls_560048: string | undefined;

      ethseerApiUrl: string | undefined;
      ethseerApiToken: string | undefined;

      cspTrustedHosts: string | undefined;
      cspReportUri: string | undefined;
      cspReportOnly: string | undefined;

      rateLimit: string;
      rateLimitTimeFrame: string;
    };
    publicRuntimeConfig: {
      basePath: string | undefined;
      developmentMode: boolean;
    };
  };

  declare const getConfig: ConfigTypes;

  export default getConfig;
}
