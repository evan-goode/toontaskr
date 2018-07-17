import _ from "lodash";

import cogSelectors from "./cogSelectors";
import { SELECTOR_TYPES } from "./constants";
const { COG, DEPARTMENT, NEIGHBORHOOD, WILDCARD } = SELECTOR_TYPES;

// returns an array of the levels that an invading cog could have on the given
// street
const getInvasionAvailableLevels = (cog, street) => {
  if (_.head(cog.levels) > _.last(street.levels)) {
    // If the cog is too high-level for the street, then return the lowest level
    // that the cog can have
    return [_.head(cog.levels)];
  } else if (_.tail(cog.levels) < _.head(street.levels)) {
    // If the cog is too low-level for the street, then return the highest level
    // that the cog can have
    return [_.tail(cog.levels)];
  }
  return _.intersection(cog.levels, street.levels);
};

// assigns to a street object a score representing the proportion of cogs
// predicted to spawn on that street that match given parameters. This function
// is based on analysis of the cog spawning algorithm found in old TTR/TTI
// server code. Specifically, the relevant function is pickLevelTypeAndTrack
// in toontown/suit/DistributedSuitPlannerAI.py. Although it's possible, I have
// no reason to believe that the TTR developers have sinced changed the spawning
// algorithm.
export const score = ({
  street,
  cogSelector,
  neighborhoodSelector,
  invasion,
  minimum,
  maximum
}) => {
  // If we are in the wrong neighborhood, then the score is zero.
  if (
    neighborhoodSelector.type === NEIGHBORHOOD &&
    neighborhoodSelector.name !== street.neighborhood.name
  ) {
    return 0;
  }

  // the specified level range
  const desiredLevels = _.range(minimum, maximum + 1);

  if (invasion) {
    // If the invading cog is different from the specified cog, then the score
    // is zero.
    if (cogSelector.type === COG && cogSelector.name !== invasion.cog.name) {
      return 0;
    } else if (
      cogSelector.type === DEPARTMENT &&
      cogSelector.department !== invasion.cog.department
    ) {
      return 0;
    }

    const availableLevels = getInvasionAvailableLevels(invasion.cog, street);

    // Return the proportion of spawnable cog levels that are within the
    // specified range.
    return (
      _.intersection(availableLevels, desiredLevels).length /
      availableLevels.length
    );
  } else {
    // There is no invasion.

    // If the specified cog is a building-only cog, then the score is zero.
    if (cogSelector.isBuildingOnlyCog) return 0;

    // the levels that the specified cog could have on the specified street
    // If no cog is specified, availableLevels represents the levels any cog
    // could have on the specified street.
    const availableLevels = _.intersection(
      ..._.compact([cogSelector.levels, street.levels])
    );

    // If there are no levels that the specified cog could have on the specified
    // street, then the score is zero.
    if (!availableLevels.length) return 0;
    const desiredAvailableLevels = _.intersection(
      availableLevels,
      desiredLevels
    );

    // If there is no intersection between the desired level range and the
    // available level range, then the score is zero.
    if (!desiredAvailableLevels.length) return 0;

    const typeProbability =
      cogSelector.type === WILDCARD
        ? 1
        : street.frequencies[cogSelector.department];

    const scorers = {};
    scorers[COG] = () => {
      // Get the number of possible species-level combinations given that a
      // spawning cog belongs to the specified department.
      const allCombinationsLength = cogSelectors
        .filter(
          other =>
            other.type === COG && other.department === cogSelector.department
        )

        // A reduce probably uses less memory than storing each combination
        // and then counting them.
        .reduce(
          (sum, other) =>
            sum + _.intersection(other.levels, street.levels).length,
          0
        );

      // Return typeProbability multiplied by the proportion of possible
      // species-level combinations that are within the specified parameters
      return (
        typeProbability *
        (desiredAvailableLevels.length / allCombinationsLength)
      );
    };
    scorers[DEPARTMENT] = () =>
      // Return typeProbability multiplied by the proportion of spawnable cog
      // levels that are within the specified range.
      typeProbability * (desiredAvailableLevels.length / street.levels.length);
    scorers[WILDCARD] = () =>
      // Return the proportion of spawnable cog levels that are within the
      // specified range.
      desiredAvailableLevels.length / street.levels.length;
    return scorers[cogSelector.type]();
  }
};
