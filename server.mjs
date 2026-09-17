import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
// cannot import from next.config.mjs because this will break env load
const CACHE_CONTROL_HEADER = 'x-cache-control';

// allows us to override cache-control header
const overrideSetHeader = (res) => {
  const setHeader = res.setHeader;
  let cacheControlOverwritten = false;
  res.setHeader = function (header, value) {
    if (header.toLowerCase() === CACHE_CONTROL_HEADER) {
      cacheControlOverwritten = true;

      return setHeader.call(this, 'Cache-Control', value);
    }

    // no-store must win over the overwritten value: Next's renderError sets it on SSR error pages
    if (
      header.toLowerCase() === 'cache-control' &&
      cacheControlOverwritten &&
      !/no-store/i.test(String(value))
    ) {
      return this;
    }

    return setHeader.call(this, header, value);
  };
};

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);

        overrideSetHeader(res);

        await handle(req, res, parsedUrl);
      } catch (err) {
        // an unhandled rejection here kills the process (--unhandled-rejections=throw); url.parse throws on e.g. `GET http://[ HTTP/1.1`
        console.error(err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end();
        } else {
          res.destroy();
        }
      }
    })
      .once('error', (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.debug(`> Ready on http://${hostname}:${port}`);
      });
    // prevents malicious client from slowly sending headers and rest of request
    server.headersTimeout = 10_000;
    server.requestTimeout = 30_000;
    server.maxHeadersCount = 50;
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
