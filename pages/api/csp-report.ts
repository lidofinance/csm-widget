import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import {
  defaultErrorHandler,
  httpMethodGuard,
  HttpMethod,
  rateLimit,
} from 'utilsApi';
import { API } from 'types';

export const config = {
  api: {
    bodyParser: { sizeLimit: '32kb' },
  },
};

const cspReport: API = async (req, res) => {
  let violation = {};

  if (typeof req.body == 'object') {
    violation = req.body;
  } else if (typeof req.body === 'string') {
    try {
      violation = JSON.parse(req.body);
    } catch {
      console.warn({
        type: 'CSP Violation',
        parseError: true,
        bodyLen: req.body?.length,
      });
      res.status(200).send({ status: 'ok' });
      return;
    }
  }

  console.warn({
    type: 'CSP Violation',
    // Nested, never spread: a spread lets the caller overwrite pino's own record fields.
    report: violation,
  });

  res.status(200).send({ status: 'ok' });
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  defaultErrorHandler,
])(cspReport);
