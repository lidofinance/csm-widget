import { Button, Description, H3 } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MODULE_METADATA, OPERATOR_TYPE_METADATA } from 'consts';
import { FC } from 'react';
import { useOperatorTypeCurve } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { Parameters } from './parameters';
import { TypeColumnStyle, TypeCtaStyle, TypeTextStyle } from './styles';
import { getTypeTagline } from './type-taglines';
import { VisibleType } from './use-visible-types';

export const TypeCard: FC<{ type: VisibleType }> = ({ type }) => {
  const metadata = type.type ? OPERATOR_TYPE_METADATA[type.type] : undefined;
  const curve = useOperatorTypeCurve(type.type);

  return (
    <TypeColumnStyle
      data-testid={
        metadata
          ? `operatorTypeCard-${metadata.short.toLowerCase()}`
          : 'operatorTypeCard-cm'
      }
    >
      {type.type && (
        <div>
          <TypeBadgeButton
            displayType={type.type}
            curve={curve}
            data-testid="operatorTypeCardBadge"
          />
        </div>
      )}
      <TypeTextStyle>
        <H3 as="h2">
          {metadata?.short ?? MODULE_METADATA[MODULE_NAME.CM].title}
        </H3>
        <Description as="p">{getTypeTagline(type.type)}</Description>
      </TypeTextStyle>
      {type.type && curve && <Parameters type={type.type} />}
      <TypeCtaStyle>
        <LocalLink href={type.href} matomoEvent={type.matomoEvent}>
          <Button variant={type.primary ? 'primary' : 'outline'}>
            {type.label}
          </Button>
        </LocalLink>
      </TypeCtaStyle>
    </TypeColumnStyle>
  );
};
