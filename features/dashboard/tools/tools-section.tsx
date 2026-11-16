import { FC } from 'react';
import { Grid, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { ToolCard } from './tool-card';
import { useTools } from './use-tools';

export const ToolsSection: FC = () => {
  const tools = useTools();
  if (tools.length === 0) return null;

  return (
    <Stack direction="column" gap={20}>
      <SectionTitle
        size="large"
        title="Tools"
        dataTestId={{ root: 'toolsSection' }}
      />
      <Grid minItemWidth={220} gap={8}>
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </Grid>
    </Stack>
  );
};
