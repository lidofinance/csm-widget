import { BrowserContext, Route } from '@playwright/test';

const IPFS_PATH = '/ipfs/';

export class IpfsGatewayProxyService {
  constructor(private readonly localGateway: `${string}/ipfs/`) {}

  async install(context: BrowserContext): Promise<void> {
    await context.route(
      (url) => url.pathname.includes(IPFS_PATH),
      async (route) => {
        const { pathname } = new URL(route.request().url());
        const cidPath = pathname.slice(
          pathname.indexOf(IPFS_PATH) + IPFS_PATH.length,
        );
        const target = `${this.localGateway}${cidPath}`;

        try {
          const response = await fetch(target);
          if (!response.ok) {
            return this.fail(route, cidPath, `${response.status}`);
          }
          console.info(`${target} reponse ok`);
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
