import { PATH } from 'consts/urls';
import { StealingCancelPage } from 'features/stealing';
import { useHasReportStealingRole } from 'modules/web3';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { getProps } from 'utilsApi';

const Page = () => {
  const { isPending } = useHasReportStealingRole();

  return (
    <GateLoaded additional={isPending}>
      <Gate
        rule="EL_STEALING_REPORTER"
        fallback={<Navigate path={PATH.HOME} />}
      >
        <StealingCancelPage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
