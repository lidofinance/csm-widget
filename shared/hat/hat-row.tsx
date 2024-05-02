import { HatFloatStyle, HatRowStyle } from './styles';
import { HatRowComponent } from './types';

export const HatRow: HatRowComponent = (props) => {
  return <HatRowStyle {...props} />;
};

export const HatFloat: HatRowComponent = (props) => {
  return <HatFloatStyle {...props} />;
};
