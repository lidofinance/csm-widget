import { Button, Grid, H2, Stack } from '@lidofinance/lido-app-ui';
import {
  LIDO_OPERATOR_PORTAL_CM,
  LIDO_OPERATOR_PORTAL_CURATED,
  LIDO_OPERATOR_PORTAL_SDVT,
} from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { CSM_FAMILY_MODULES } from 'consts/modules';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';
import { useCanCreateCM } from 'shared/hooks';
import moduleCsm from 'assets/illustrations/module-csm.webp';
import moduleCurated from 'assets/illustrations/module-curated.webp';
import moduleCuratedV2 from 'assets/illustrations/module-curated-v2.webp';
import moduleDvt from 'assets/illustrations/module-dvt.webp';
import { CsmJoinButtons, ModuleStatusTag } from '../components';
import { ModuleCard } from './module-card';
import { useManageModule } from './use-manage-module';

const CM_MODULES = [MODULE_NAME.CM];

export const ModulesSection: FC = () => {
  const { canCreate: canCreateCm } = useCanCreateCM();
  const csm = useManageModule(CSM_FAMILY_MODULES);
  const cm = useManageModule(CM_MODULES);

  return (
    <Stack direction="column" gap={16} align="stretch">
      <H2>Modules</H2>
      <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
        <ModuleCard
          id="csm"
          tag={<ModuleStatusTag variant="csm" />}
          title="Community Staking"
          description="Permissionless bonded module geared towards solo and community stakers"
          illustration={moduleCsm}
          buttons={
            <CsmJoinButtons
              size="small"
              onManage={csm.hasOperators ? csm.manage : undefined}
            />
          }
        />
        <ModuleCard
          id="curated-v2"
          tag={<ModuleStatusTag variant="no-onboardings" />}
          title="Curated v2"
          description="Allow-listed bonded module for professional staking providers"
          illustration={moduleCuratedV2}
          learnMoreHref={LIDO_OPERATOR_PORTAL_CM}
          learnMoreEvent={MATOMO_CLICK_EVENTS_TYPES.validateLearnMoreCm}
          buttons={
            cm.hasOperators ? (
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.validateManageCm);
                  cm.manage();
                }}
              >
                Manage
              </Button>
            ) : (
              canCreateCm && (
                <Button
                  href={PATH.CREATE_CM}
                  variant="primary"
                  size="small"
                  onClick={() =>
                    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.validateCreateCm)
                  }
                >
                  Create new NO
                </Button>
              )
            )
          }
        />
        <ModuleCard
          id="curated"
          tag={<ModuleStatusTag variant="no-onboardings" />}
          title="Curated"
          description="Permissioned module for professional Node Operators"
          illustration={moduleCurated}
          learnMoreHref={LIDO_OPERATOR_PORTAL_CURATED}
          learnMoreEvent={MATOMO_CLICK_EVENTS_TYPES.validateLearnMoreCurated}
        />
        <ModuleCard
          id="sdvt"
          tag={<ModuleStatusTag variant="no-onboardings" />}
          title="Simple DVT"
          description="Permissioned module that utilizes DVT through Obol and SSV implementations"
          illustration={moduleDvt}
          learnMoreHref={LIDO_OPERATOR_PORTAL_SDVT}
          learnMoreEvent={MATOMO_CLICK_EVENTS_TYPES.validateLearnMoreSdvt}
        />
      </Grid>
    </Stack>
  );
};
