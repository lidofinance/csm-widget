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
