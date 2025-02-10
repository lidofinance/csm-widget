import { PATH } from 'consts/urls';
import { SurveysHomePage } from 'features/surveys';
import { getProps } from 'lib/getProps';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';

const Page = () => {
  return (
    <GateLoaded>
      <Gate rule="IS_NODE_OPERATOR" fallback={<Navigate path={PATH.HOME} />}>
        <SurveysHomePage />
      </Gate>
    </GateLoaded>
  );
};

export default Page;

export const getServerSideProps = getProps();
