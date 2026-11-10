type DkgFileLike = { active: boolean };

export type DkgFilesRow = {
  title: string;
  value?: string;
  isEmpty?: boolean;
};

const DEFAULT_TITLE = 'Uploaded DKG files';

export const formatDkgFilesRow = (
  files: DkgFileLike[] | undefined,
  isCm: boolean,
): DkgFilesRow => {
  if (!files) return { title: DEFAULT_TITLE };
  if (files.length === 0) return { title: DEFAULT_TITLE, isEmpty: true };

  const active = files.filter((file) => file.active).length;

  if (isCm) {
    const noun = files.length === 1 ? 'file' : 'files';
    return {
      title: `${files.length} uploaded ${noun}`,
      value: `${active} active`,
    };
  }
  return {
    title: DEFAULT_TITLE,
    value: `${active} active, ${files.length - active} disabled`,
  };
};
