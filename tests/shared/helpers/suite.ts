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

/**
 * Builds the two `test.describe` arguments from the suite tree:
 * `{ epic: 'Bond & Rewards', feature: 'Claim', story: 'Penalty' }` becomes the
 * title `'Bond & Rewards. Claim. Penalty.'` and one QaseSuite annotation per
 * level, so it is spread into the describe:
 *
 * ```ts
 * test.describe(...suite({ epic, feature, story }), () => { ... });
 * ```
 */
export const createSuite =
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
