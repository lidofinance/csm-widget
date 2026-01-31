// Type definition override for @lidofinance/lido-ui SVG components
import { ComponentType, SVGProps } from 'react';

// Define the corrected props interface for SVG icon components only
interface FixedSVGProps
  extends Omit<
    SVGProps<SVGSVGElement>,
    'onPointerEnterCapture' | 'onPointerLeaveCapture'
  > {
  onPointerEnterCapture?: SVGProps<SVGSVGElement>['onPointerEnterCapture'];
  onPointerLeaveCapture?: SVGProps<SVGSVGElement>['onPointerLeaveCapture'];
  as?: keyof JSX.IntrinsicElements | undefined;
  forwardedAs?: keyof JSX.IntrinsicElements | undefined;
}

// Module augmentation to fix only pure SVG icon components
declare module '@lidofinance/lido-ui' {
  // Pure SVG icon components that need pointer capture props fix
  export const ArrowTop: ComponentType<FixedSVGProps>;
  export const ArrowBottom: ComponentType<FixedSVGProps>;
  export const ArrowLeft: ComponentType<FixedSVGProps>;
  export const ArrowBack: ComponentType<FixedSVGProps>;
  export const External: ComponentType<FixedSVGProps>;
  export const Copy: ComponentType<FixedSVGProps>;
  export const Check: ComponentType<FixedSVGProps>;
  export const Plus: ComponentType<FixedSVGProps>;
  export const Close: ComponentType<FixedSVGProps>;
  export const Warning: ComponentType<FixedSVGProps>;
  export const LidoLogo: ComponentType<FixedSVGProps>;
  export const Eth: ComponentType<FixedSVGProps>;
  export const Dark: ComponentType<FixedSVGProps>;
  export const Light: ComponentType<FixedSVGProps>;
  export const LockSmall: ComponentType<FixedSVGProps>;
  export const Lock: ComponentType<FixedSVGProps>;
  export const CheckLarge: ComponentType<FixedSVGProps>;
  export const LedgerFail: ComponentType<FixedSVGProps>;
  export const LedgerConfirm: ComponentType<FixedSVGProps>;
  export const LedgerLoading: ComponentType<FixedSVGProps>;
  export const LedgerSuccess: ComponentType<FixedSVGProps>;
}
