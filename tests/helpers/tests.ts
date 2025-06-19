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
