import { FC, PropsWithChildren } from 'react';
import type { useDkgUploadZone } from '../hooks/use-dkg-upload-zone';
import s from '../styles.module.css';

type Zone = ReturnType<typeof useDkgUploadZone>;

type Props = {
  zone: Pick<Zone, 'getRootProps' | 'getInputProps' | 'isDragAccept'>;
};

export const DkgDropArea: FC<PropsWithChildren<Props>> = ({
  zone,
  children,
}) => (
  <div
    {...zone.getRootProps()}
    className={s.dropArea}
    data-drag-active={zone.isDragAccept || undefined}
  >
    <input {...zone.getInputProps()} />
    {children}
  </div>
);
