type EpicNode = {
  readonly name: string;
  readonly features: readonly string[];
};

type FeatureOf<Epic extends EpicNode> = Epic['features'] extends readonly []
  ? { feature?: never }
  : { feature: Epic['features'][number] | null };

type SuiteDetails = {
  tag?: string | string[];
  annotation: { type: string; description: string }[];
};

export const createQaseTree =
  <Epics extends Record<string, EpicNode>>() =>
  <Epic extends Epics[keyof Epics]>(
    options: {
      epic: Epic;
      story?: string;
      tag?: string | string[];
    } & FeatureOf<Epic>,
  ): [string, SuiteDetails] => {
    const { epic, story, tag } = options;
    const feature = (options as { feature?: string | null }).feature;

    const levels = [epic.name, feature, story].filter(
      (level): level is string => !!level,
    );

    return [
      `${levels.join('. ')}.`,
      {
        ...(tag ? { tag } : {}),
        annotation: levels.map((description) => ({
          type: 'QaseSuite',
          description,
        })),
      },
    ];
  };
