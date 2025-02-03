import { FC } from 'react';
import { TitleStyled, ItemStyled, SubtitleStyled } from './styles';
import { Loader, Tooltip } from '@lidofinance/lido-ui';
import { StatusChip } from 'shared/components';
import { InfraStatus } from './types';
import { LoaderWrapperStyle } from 'shared/navigate/splash/loader-banner/styles';

export type InfraItemProps = {
  title: string;
  subtitle: string;
  tooltip?: string;
  status: InfraStatus;
  isLoading: boolean;
};

export const InfraItem: FC<InfraItemProps> = ({
  title,
  tooltip,
  subtitle,
  status,
  isLoading,
}) => {
  const body = (
    <ItemStyled>
      <div>
        <TitleStyled>{title}</TitleStyled>
        <SubtitleStyled>{subtitle}</SubtitleStyled>
      </div>

      {isLoading ? (
        <LoaderWrapperStyle>
          <Loader size="small" color="secondary" />
        </LoaderWrapperStyle>
      ) : (
        <StatusChip status={status} />
      )}
    </ItemStyled>
  );

  if (tooltip) {
    return (
      <Tooltip placement="top" title={tooltip}>
        {body}
      </Tooltip>
    );
  }
  return body;
};
