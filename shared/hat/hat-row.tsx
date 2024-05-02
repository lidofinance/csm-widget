import { HatRowStyle } from './styles';
import { HatRowComponent } from './types';

export const HatRow: HatRowComponent = (props) => {
  return <HatRowStyle {...props} />;
};
