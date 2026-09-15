type SuiteDetails = {
  tag?: string | string[];
  annotation: { type: string; description: string }[];
};

export const createQaseTree =
  <Epic extends string, Feature extends string>() =>
  ({
    epic,
    feature,
    story,
    tag,
  }: {
    epic?: Epic;
    feature?: Feature;
    story?: string;
    tag?: string | string[];
  }): [string, SuiteDetails] => {
    const levels = [epic, feature, story].filter(
      (level): level is Epic | Feature | string => !!level,
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
