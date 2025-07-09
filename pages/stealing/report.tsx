import { PATH } from 'consts/urls';
import { StealingReportPage } from 'features/stealing';
import { useHasReportStealingRole } from 'modules/web3';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utils';

const Page = () => {
  const { isPending } = useHasReportStealingRole();

  return (
    <GateLoaded additional={isPending}>
      <Gate
        rule="EL_STEALING_REPORTER"
        fallback={<Navigate path={PATH.HOME} />}
      >
        <StealingReportPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
