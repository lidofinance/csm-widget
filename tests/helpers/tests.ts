import { Tags } from 'tests/consts/common.const';

declare global {
  interface String {
    toCut(decimalPlaces: number): string;
  }
}

String.prototype.toCut = function (decimalPlaces: number) {
  const result = this.split(/\./);
  let respLength: number | undefined;
  if (result.length === 2) {
    respLength = result[0].length + 1 + decimalPlaces;
  }
  let response = this.slice(0, respLength);
  const responseParts = response.split(/\./);
  if (responseParts.length === 1) response = `${response}.0`;

  return response;
};

export const prepareGrep = (testTag: string | undefined) => {
  if (!testTag || testTag.trim() === '' || testTag === '-') {
    return undefined;
  }

  const tags = testTag.split('|');
  const includeTags = [];
  const excludeTags = [];

  if (!testTag.includes(Tags.forked.replace(/^@+/, ''))) {
    excludeTags.push(Tags.forked.replace(/^@+/, ''));
  }

  for (const tag of tags) {
    if (tag.startsWith('!')) {
      // remove '!' for invert tags
      excludeTags.push(tag.slice(1));
    } else {
      includeTags.push(tag);
    }
  }

  // create regexp for include and exclude tags
  const includePattern = includeTags.map((tag) => `(?=.*${tag})`).join('');
  const excludePattern = excludeTags.map((tag) => `(?!.*${tag})`).join('');

  const fullPattern = new RegExp(`^${excludePattern}${includePattern}.*$`);

  return fullPattern;
};

/**
 * Repeatedly calls an asynchronous callback function with the specified arguments until it returns a truthy value
 * or the timeout is reached.
 *
 * @param callback - An asynchronous function that takes arguments of type T and returns a promise.
 * @param args - The arguments to pass to the callback function.
 * @param timeout - The maximum amount of time (in milliseconds) to wait for the callback to return a truthy value.
 * @returns A promise that resolves with the callback's result if it returns a truthy value within the timeout.
 * @throws An error if the timeout is reached before the callback returns a truthy value.
 *
 * @template T - The type of the arguments to be passed to the callback function.
 */
export const waitForCallback = async <T>(
  callback: (args: T) => Promise<any>,
  args: T,
  timeout: number,
): Promise<any> => {
  let shouldTerminate = false;
  setTimeout(() => {
    shouldTerminate = true;
  }, timeout);

  let result;
  while (!shouldTerminate) {
    result = await callback(args).catch((err) => {
      console.error(`Callback failed: ${err}`);
    });
    if (result) return result;
  }

  throw new Error(
    `callback still not done after ${
      timeout / 1000
    } sec.\nCallback result: ${result}`,
  );
};
