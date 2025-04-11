/* eslint-disable no-console */
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';
import externalLinks from 'remark-external-links';
import { getConfig } from 'config';
import { CHAINS } from '@lido-sdk/constants';

export type FaqItem = {
  id: string;
  content: string;
  title: string;
  earlyAdoptionMember: boolean | null;
  onlyWithReferrer: boolean | null;
  anchor: string | null;
};

export type FaqGetter = () => Promise<FaqItem[]>;

const readFaqFile = async ([scope, id]: string[]): Promise<FaqItem> => {
  const fileContents = await import(`faq/${scope}/${id}.md`);
  const matterResult = matter(fileContents.default);

  const processedContent = await remark()
    .use(externalLinks, { target: '_blank', rel: ['nofollow', 'noopener'] })
    .use(html)
    .process(matterResult.content);

  return {
    id,
    content: processedContent.toString(),
    title: String(matterResult.data.title || id),
    anchor: matterResult.data.anchor ?? null,
    earlyAdoptionMember: matterResult.data.earlyAdoption ?? null,
    onlyWithReferrer: matterResult.data.onlyWithReferrer ?? null,
  };
};

const { defaultChain } = getConfig();
const chainName = CHAINS[defaultChain].toLowerCase();

export const readFaqFiles = async (fileNames: string[]) => {
  const ids = fileNames.map((name) => [chainName, name]);
  return Promise.all(ids.map(readFaqFile));
};

export const getFaqMain = () =>
  readFaqFiles([
    'main-1',
    'main-2',
    'main-3',
    'main-4',
    'main-5',
    'main-6',
    'main-7',
    'main-7a',
    'main-8',
  ]);

export const getFaqKeys = () =>
  readFaqFiles([
    'keys-1',
    'keys-2',
    'keys-3',
    'keys-3a',
    'keys-4',
    'keys-4a',
    'keys-5',
    'keys-6',
    'keys-7',
    'keys-8',
    'keys-9',
    'keys-10',
    'keys-13',
    'keys-11',
    'keys-12',
  ]);

export const getFaqBond = () =>
  readFaqFiles(['bond-1', 'bond-2', 'bond-3', 'bond-4', 'bond-5']);

export const getFaqLocked = () =>
  readFaqFiles(['locked-1', 'locked-2', 'locked-3']);

export const getFaqRoles = () =>
  readFaqFiles(['roles-1', 'roles-2', 'roles-3', 'roles-4', 'roles-5']);
