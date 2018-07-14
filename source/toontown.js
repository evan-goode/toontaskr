import _ from "lodash";

export const score = ({ street, cog, neighborhood, minimum, maximum }) => {
  if (neighborhood && neighborhood !== street.neighborhood) return 0;
  const levelRanges = _.compact([
    cog && cog.levels,
    street.levels,
    _.range(minimum, maximum + 1)
  ]);
  const intersectingLevels = _.intersection(...levelRanges);
  const levelProbability = intersectingLevels.length / street.levels.length;
  const typeProbability = cog ? street.frequencies[cog.type] : 1;
  return levelProbability * typeProbability;
};
