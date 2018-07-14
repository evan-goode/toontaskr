import _ from "lodash";

const getInvasionAvailableLevels = (cog, street) => {
  if (_.head(cog.levels) > _.last(street.levels)) {
    return [_.head(cog.levels)];
  } else if (_.tail(cog.levels) < _.head(street.levels)) {
    return [_.tail(cog.levels)];
  }
  return _.intersection(cog.levels, street.levels);
};

export const score = ({
  street,
  cog,
  neighborhood,
  invasion,
  minimum,
  maximum
}) => {
  if (neighborhood && neighborhood !== street.neighborhood) return 0;
  const desiredLevels = _.range(minimum, maximum + 1);
  if (invasion) {
    if (cog) {
      if (cog.isSpecies) {
        if (cog.name !== invasion.cog.name) return 0;
      } else {
        if (cog.type !== invasion.cog.type) return 0;
      }
    }
    const availableLevels = getInvasionAvailableLevels(invasion.cog, street);
    return (
      _.intersection(availableLevels, desiredLevels).length /
      availableLevels.length
    );
  } else {
    if (cog && cog.isBuildingCog) return 0;
    const availableLevels = _.intersection(
      ..._.compact([cog && cog.levels, street.levels])
    );
    const levelProbability =
      _.intersection(availableLevels, desiredLevels).length /
      street.levels.length;
    const typeProbability = cog ? street.frequencies[cog.type] : 1;
    return levelProbability * typeProbability;
  }
};
