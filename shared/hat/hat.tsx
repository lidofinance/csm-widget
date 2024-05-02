import { HatStyle } from './styles';
import { HatComponent } from './types';

export const Hat: HatComponent = (props) => {
  return <HatStyle color="accent" {...props} />;
};
