import _ from "lodash";

import { MINIMUM_LEVEL, MAXIMUM_LEVEL } from "./constants";

const buildCog = (name, type, minimum, maximum) => {
  // return a cog object
  return {
    name: name,
    type: type,
    levels: _.range(minimum, maximum + 1)
  };
};

export default [
  buildCog("Bossbots", "Bossbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCog("Flunky", "Bossbot", 1, 5),
  buildCog("Pencil Pusher", "Bossbot", 2, 6),
  buildCog("Yesman", "Bossbot", 3, 7),
  buildCog("Micromanager", "Bossbot", 4, 8),
  buildCog("Downsizer", "Bossbot", 5, 9),
  buildCog("Head Hunter", "Bossbot", 6, 10),

  buildCog("Lawbots", "Lawbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCog("Bottom Feeder", "Lawbot", 1, 5),
  buildCog("Bloodsucker", "Lawbot", 2, 6),
  buildCog("Double Talker", "Lawbot", 3, 7),
  buildCog("Ambulance Chaser", "Lawbot", 4, 8),
  buildCog("Back Stabber", "Lawbot", 5, 9),
  buildCog("Spin Doctor", "Lawbot", 6, 10),

  buildCog("Cashbots", "Cashbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCog("Short Change", "Cashbot", 1, 5),
  buildCog("Penny Pincher", "Cashbot", 2, 6),
  buildCog("Tightwad", "Cashbot", 3, 7),
  buildCog("Bean Counter", "Cashbot", 4, 8),
  buildCog("Number Cruncher", "Cashbot", 5, 9),
  buildCog("Money Bags", "Cashbot", 6, 10),

  buildCog("Sellbots", "Sellbot", MINIMUM_LEVEL, MAXIMUM_LEVEL),
  buildCog("Cold Caller", "Sellbot", 1, 5),
  buildCog("Telemarketer", "Sellbot", 2, 6),
  buildCog("Name Dropper", "Sellbot", 3, 7),
  buildCog("Glad Hander", "Sellbot", 4, 8),
  buildCog("Mover & Shaker", "Sellbot", 5, 9),
  buildCog("Two-Face", "Sellbot", 6, 10)
];
