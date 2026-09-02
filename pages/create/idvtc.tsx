import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CreateOperatorRoute } from 'features/create-node-operator';
import { getProps } from 'utilsApi';

const Page = () => <CreateOperatorRoute type={OPERATOR_TYPE.CSM_IDVTC} />;

export default Page;

export const getServerSideProps = getProps();
