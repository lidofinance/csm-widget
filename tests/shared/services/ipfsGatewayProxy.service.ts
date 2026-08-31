import { BrowserContext, Route } from '@playwright/test';

const IPFS_PATH = '/ipfs/';
// subdomain gateways: https://<cid>.ipfs.<host>/<path>
const SUBDOMAIN_CID = /^([^.]+)\.ipfs\./;

export class IpfsGatewayProxyService {
  constructor(private readonly localGateway: `${string}/ipfs/`) {}

  async install(context: BrowserContext): Promise<void> {
    await context.route(
      (url) => this.extractCidPath(url) !== null,
      async (route) => {
        const cidPath = this.extractCidPath(new URL(route.request().url()));
        if (cidPath === null) return route.fallback();

        const target = `${this.localGateway}${cidPath}`;

        try {
          const response = await fetch(target);
          if (!response.ok) {
            return this.fail(route, cidPath, `${response.status}`);
          }

          await route.fulfill({
            status: 200,
            body: Buffer.from(await response.arrayBuffer()),
            headers: {
              'content-type':
                response.headers.get('content-type') ??
                'application/octet-stream',
              'access-control-allow-origin': '*',
            },
          });
        } catch (error) {
          await this.fail(route, cidPath, (error as Error).message);
        }
      },
    );

    await context.route('https://raw.githubusercontent.com/**', (route) =>
      route.abort('failed'),
    );
  }

  /**
   * Both gateway layouts the SDK builds from DEFAULT_IPFS_GATEWAYS:
   * `<host>/ipfs/<cid>/<path>` and `<cid>.ipfs.<host>/<path>`.
   */
  private extractCidPath(url: URL): string | null {
    const subdomain = url.hostname.match(SUBDOMAIN_CID);
    if (subdomain) {
      const subPath = url.pathname === '/' ? '' : url.pathname;
      return `${subdomain[1]}${subPath}`;
    }

    const pathIndex = url.pathname.indexOf(IPFS_PATH);
    if (pathIndex === -1) return null;

    return url.pathname.slice(pathIndex + IPFS_PATH.length);
  }

  private async fail(
    route: Route,
    cidPath: string,
    reason: string,
  ): Promise<void> {
    console.warn(`[ipfs-proxy] miss ${cidPath} (${reason})`);
    await route.fulfill({
      status: 502,
      body: `local ipfs miss: ${cidPath} (${reason})`,
    });
  }
}
