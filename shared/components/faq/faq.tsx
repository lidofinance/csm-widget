import { Accordion } from '@lidofinance/lido-ui';
import { useFaqList } from 'providers/faq-provider';
import { FC, memo, useCallback } from 'react';
import { Section } from 'shared/components';
import styled from 'styled-components';
import { trackMatomoFaqEvent } from 'utils';
import { replaceAll } from 'utils/replaceAll';

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
  const handleExpand = useCallback(
    (id: string) => () => trackMatomoFaqEvent(id),
    [],
  );

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
            onExpand={handleExpand(id)}
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
