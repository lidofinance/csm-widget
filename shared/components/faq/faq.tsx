import { FC, memo, useCallback } from 'react';
import { Accordion } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { Section } from 'shared/components';
import { replaceAll } from 'utils/replaceAll';
import { useFaqList } from 'providers/faq-provider';
import { trackMatomoEvent } from 'utils';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export interface FaqProps {
  // faqList: FAQItem[];
  replacements?: {
    [key: string]: string;
  };
}

const FaqItem = styled.div`
  p {
    margin: 0 0 1.6em;
  }

  p + ul,
  p + ol,
  ul + p,
  ol + p {
    margin-top: -1.6em;
  }

  ul > li,
  ol > li {
    margin-top: 0;
    margin-bottom: 0;

    & > p {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  a {
    text-decoration: none;
  }
`;

export const Faq: FC<FaqProps> = memo(({ replacements }) => {
  const faqList = useFaqList();

  // TODO: track link click inside faq
  const handleExpand = useCallback(() => {
    // TODO: track faq id
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.faqExpand);
  }, []);

  if (faqList.length === 0) return null;

  return (
    <Section title="FAQ">
      {faqList.map(({ id, title, content }, index) => {
        const html = replaceAll(content, replacements);

        return (
          <Accordion
            key={id}
            defaultExpanded={index === 0}
            summary={String(title)}
            onExpand={handleExpand}
          >
            <FaqItem
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </Accordion>
        );
      })}
    </Section>
  );
});
