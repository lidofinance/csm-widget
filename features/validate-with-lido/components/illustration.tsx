import { FC } from 'react';

type IllustrationProps = {
  src: { src: string };
  width: number;
  className?: string;
};

export const Illustration: FC<IllustrationProps> = ({
  src,
  width,
  className,
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className={className}
    src={src.src}
    width={width}
    height={width}
    alt=""
  />
);
