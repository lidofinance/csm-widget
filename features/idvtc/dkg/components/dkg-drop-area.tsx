import { FC, PropsWithChildren } from 'react';
import type { useDkgUploadZone } from '../hooks/use-dkg-upload-zone';
import { DropArea } from '../styles';

type Zone = ReturnType<typeof useDkgUploadZone>;

type Props = {
  zone: Pick<Zone, 'getRootProps' | 'getInputProps' | 'isDragAccept'>;
};

export const DkgDropArea: FC<PropsWithChildren<Props>> = ({
  zone,
  children,
}) => (
  <DropArea {...zone.getRootProps()} $dragActive={zone.isDragAccept}>
    <input {...zone.getInputProps()} />
    {children}
  </DropArea>
);
