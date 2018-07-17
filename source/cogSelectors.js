import _ from "lodash";

import {
  MINIMUM_LEVEL,
  MAXIMUM_LEVEL,
  BUILDING_COG_THRESHOLD,
  SELECTOR_TYPES
} from "./constants";

const { COG, DEPARTMENT, WILDCARD } = SELECTOR_TYPES;

const buildCogSelector = (type, name, department, minimum, maximum) => {
  // return a cog object
  return {
    type,
    name,
    department,
    levels: _.range(minimum, maximum + 1),
    isBuildingOnlyCog: minimum >= 7
  };
};

// prettier-ignore
export default [
  buildCogSelector(WILDCARD, "Any cog", null, MINIMUM_LEVEL, MAXIMUM_LEVEL),

  buildCogSelector(DEPARTMENT, "Bossbots", "Bossbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCogSelector(COG, "Flunky", "Bossbot", 1, 5),
  buildCogSelector(COG, "Pencil Pusher", "Bossbot", 2, 6),
  buildCogSelector(COG, "Yesman", "Bossbot", 3, 7),
  buildCogSelector(COG, "Micromanager", "Bossbot", 4, 8),
  buildCogSelector(COG, "Downsizer", "Bossbot", 5, 9),
  buildCogSelector(COG, "Head Hunter", "Bossbot", 6, 10),
  buildCogSelector(COG, "Corporate Raider", "Bossbot", 7, 11),
  buildCogSelector(COG, "The Big Cheese", "Bossbot", 8, 12),

  buildCogSelector(DEPARTMENT, "Lawbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCogSelector(COG, "Bottom Feeder", "Lawbot", 1, 5),
  buildCogSelector(COG, "Bloodsucker", "Lawbot", 2, 6),
  buildCogSelector(COG, "Double Talker", "Lawbot", 3, 7),
  buildCogSelector(COG, "Ambulance Chaser", "Lawbot", 4, 8),
  buildCogSelector(COG, "Back Stabber", "Lawbot", 5, 9),
  buildCogSelector(COG, "Spin Doctor", "Lawbot", 6, 10),
  buildCogSelector(COG, "Legal Eagle", "Lawbot", 7, 11),
  buildCogSelector(COG, "Big Wig", "Lawbot", 8, 12),

  buildCogSelector(DEPARTMENT, "Cashbots", "Cashbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCogSelector(COG, "Short Change", "Cashbot", 1, 5),
  buildCogSelector(COG, "Penny Pincher", "Cashbot", 2, 6),
  buildCogSelector(COG, "Tightwad", "Cashbot", 3, 7),
  buildCogSelector(COG, "Bean Counter", "Cashbot", 4, 8),
  buildCogSelector(COG, "Number Cruncher", "Cashbot", 5, 9),
  buildCogSelector(COG, "Money Bags", "Cashbot", 6, 10),
  buildCogSelector(COG, "Loan Shark", "Cashbot", 7, 11),
  buildCogSelector(COG, "Robber Baron", "Cashbot", 8, 12),

  buildCogSelector(DEPARTMENT, "Sellbots", "Sellbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCogSelector(COG, "Cold Caller", "Sellbot", 1, 5),
  buildCogSelector(COG, "Telemarketer", "Sellbot", 2, 6),
  buildCogSelector(COG, "Name Dropper", "Sellbot", 3, 7),
  buildCogSelector(COG, "Glad Hander", "Sellbot", 4, 8),
  buildCogSelector(COG, "Mover & Shaker", "Sellbot", 5, 9),
  buildCogSelector(COG, "Two-Face", "Sellbot", 6, 10),
  buildCogSelector(COG, "The Mingler", "Sellbot", 7, 11),
  buildCogSelector(COG, "Mr. Hollywood", "Sellbot", 8, 12)
];
