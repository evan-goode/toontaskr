import "babel-polyfill";

import fetch from "node-fetch";
import fuzzy from "fuzzy";
import _ from "lodash";

const invasionAPIEndpoint = "https://www.toontownrewritten.com/api/invasions";

const range = function(start, end, increment) {
  let array = [];
  for (let index = start; index <= end; index += increment || 1) {
    array.push(index);
  }
  return array;
};
const findByKey = function(key, value, array) {
  for (const element of array) {
    if (element[key] === value) {
      return element;
    }
  }
};
const intersectRatio = function(a, b) {
  return _.intersection(a, b).length / (a.length || 1);
};
const formatPercentage = function(number) {
  return Math.round(100 * number) + "%";
};
const fuzz = function(query, list) {
  const results = fuzzy.filter(query, list);
  return results.map(element => {
    return element.string;
  })[0];
};
const generateStreet = (name, neighborhood, frequencies, minimum, maximum) => {
  // return a street object, makes the code below a lot more concise
  return {
    name: name,
    neighborhood: neighborhood,
    frequencies: {
      bossbot: frequencies[0],
      lawbot: frequencies[1],
      cashbot: frequencies[2],
      sellbot: frequencies[3]
    },
    levels: _.range(minimum, maximum + 1)
  };
};
const generateCog = (name, type, minimum, maximum) => {
  // return a cog object
  return {
    name: name,
    type: type,
    levels: _.range(minimum, maximum + 1)
  };
};

const streets = [
  generateStreet("Loopy Lane", "Toontown Central", [0.1, 0.7, 0.1, 0.1], 1, 3),
  generateStreet(
    "Punchline Place",
    "Toontown Central",
    [0.1, 0.1, 0.4, 0.4],
    1,
    3
  ),
  generateStreet(
    "Silly Street",
    "Toontown Central",
    [0.25, 0.25, 0.25, 0.25],
    1,
    3
  ),

  generateStreet("Barnacle Boulevard", "Donald's Dock", [0.9, 0.1, 0, 0], 3, 6),
  generateStreet("Seaweed Street", "Donald's Dock", [0, 0, 0.9, 0.1], 3, 6),
  generateStreet(
    "Lighthouse Lane",
    "Donald's Dock",
    [0.4, 0.4, 0.1, 0.1],
    3,
    6
  ),

  generateStreet("Elm Street", "Daisy Gardens", [0, 0.2, 0.1, 0.7], 3, 6),
  generateStreet("Maple Street", "Daisy Gardens", [0.1, 0.7, 0, 0.2], 3, 6),
  generateStreet("Oak Street", "Daisy Gardens", [0, 0.2, 0.1, 0.7], 3, 6),

  generateStreet("Alto Avenue", "Minnie's Melodyland", [0, 0, 0.5, 0.5], 3, 6),
  generateStreet(
    "Baritone Boulevard",
    "Minnie's Melodyland",
    [0, 0, 0.9, 0.1],
    3,
    6
  ),
  generateStreet(
    "Tenor Terrace",
    "Minnie's Melodyland",
    [0.5, 0.5, 0, 0],
    3,
    6
  ),

  generateStreet("Sleet Street", "The Brrrgh", [0.1, 0.2, 0.3, 0.4], 5, 7),
  generateStreet("Walrus Way", "The Brrrgh", [0.1, 0.2, 0.3, 0.4], 5, 7),
  generateStreet("Polar Place", "The Brrrgh", [0.1, 0.2, 0.3, 0.4], 7, 9),

  generateStreet(
    "Lullaby Lane",
    "Donald's Dreamland",
    [0.25, 0.25, 0.25, 0.25],
    6,
    9
  ),
  generateStreet(
    "Pajama Place",
    "Donald's Dreamland",
    [0.05, 0.05, 0.85, 0.05],
    6,
    9
  )
];
let neighborhoodNames = streets.map(street => {
  return street.neighborhood;
});
neighborhoodNames.push("any");

const cogs = [
  generateCog("Flunky", "Bossbot", 1, 5),
  generateCog("Pencil Pusher", "Bossbot", 2, 6),
  generateCog("Yesman", "Bossbot", 3, 7),
  generateCog("Micromanager", "Bossbot", 4, 8),
  generateCog("Downsizer", "Bossbot", 5, 9),
  generateCog("Head Hunter", "Bossbot", 6, 10),

  generateCog("Bottom Feeder", "Lawbot", 1, 5),
  generateCog("Bloodsucker", "Lawbot", 2, 6),
  generateCog("Double Talker", "Lawbot", 3, 7),
  generateCog("Ambulance Chaser", "Lawbot", 4, 8),
  generateCog("Back Stabber", "Lawbot", 5, 9),
  generateCog("Spin Doctor", "Lawbot", 6, 10),

  generateCog("Short Change", "Cashbot", 1, 5),
  generateCog("Penny Pincher", "Cashbot", 2, 6),
  generateCog("Tightwad", "Cashbot", 3, 7),
  generateCog("Bean Counter", "Cashbot", 4, 8),
  generateCog("Number Cruncher", "Cashbot", 5, 9),
  generateCog("Money Bags", "Cashbot", 6, 10),

  generateCog("Cold Caller", "Sellbot", 1, 5),
  generateCog("Telemarketer", "Sellbot", 2, 6),
  generateCog("Name Dropper", "Sellbot", 3, 7),
  generateCog("Glad Hander", "Sellbot", 4, 8),
  generateCog("Mover & Shaker", "Sellbot", 5, 9),
  generateCog("Two-Face", "Sellbot", 6, 10)
];

const buildingCogs = [
  generateCog("Corporate Raider", "Bossbot", 7, 11),
  generateCog("The Big Cheese", "Bossbot", 8, 12),

  generateCog("Legal Eagle", "Lawbot", 7, 11),
  generateCog("Big Wig", "Lawbot", 8, 12),

  generateCog("Loan Shark", "Cashbot", 7, 11),
  generateCog("Robber Baron", "Cashbot", 8, 12),

  generateCog("The Mingler", "Sellbot", 7, 11),
  generateCog("Mr. Hollywood", "Sellbot", 8, 12)
];

let cogNames = cogs.map(cog => {
  return cog.name;
});
const cogTypes = ["Bossbot", "Lawbot", "Cashbot", "Sellbot"];
cogNames = cogNames.concat([...cogTypes, "any"]);

const score = function(street, neighborhood, cog, type, minimum, maximum) {
  let probabilities = [1];

  if (neighborhood && street.neighborhood !== neighborhood) {
    return 0;
  }
  type = type || (cog ? cog.type : false);
  if (type) {
    type = type.toLowerCase();
    probabilities.push(street.frequencies[type]);
  }
  if (cog) {
    probabilities.push(intersectRatio(street.levels, cog.levels));
    probabilities.push(1 / street.levels.length);
    if (minimum && maximum) {
      probabilities.push(
        intersectRatio(
          intersection(cog.levels, street.levels),
          range(minimum, maximum)
        )
      );
    }
  } else if (minimum && maximum) {
    probabilities.push(intersectRatio(street.levels, range(minimum, maximum)));
  }

  // street.levels.length coincidentally equals the number of cog species that can spawn on a street
  return probabilities.reduce((a, b) => {
    return a * b;
  });
};

const sort = function(streets, neighborhood, cog, type, minimum, maximum) {
  const scored = streets.map(street => {
    street.score = score(street, neighborhood, cog, type, minimum, maximum);
    return street;
  });
  return scored.sort((a, b) => {
    return b.score - a.score;
  });
};

(async function() {
  const args = process.argv.slice(2);
  const cogName = fuzz(args[0], cogNames);
  const neighborhoodName = fuzz(args[1], neighborhoodNames);
  let minimum = null;
  let maximum = null;
  try {
    minimum = parseInt(args[2]);
    maximum = parseInt(args[3]);
  } finally {
  }
  let cog = null;
  let cogType = null;
  if (cogTypes.includes(cogName)) {
    // if the first argument is a type of cog, not a species
    cogType = cogName;
  } else if (cogName !== "any") {
    cog = findByKey("name", cogName, cogs);
  }

  const neighborhood = neighborhoodName === "any" ? null : neighborhoodName;

  const best = sort(streets, neighborhood, cog, cogType, minimum, maximum);

  best.slice(0, 3).map(street => {
    console.log(
      [formatPercentage(street.score), street.name, street.neighborhood].join(
        "\t"
      )
    );
  });

  if (cog || cogType) {
    const invasionRequest = await fetch(invasionAPIEndpoint);
    const invasionJSON = await invasionRequest.json();
    const invasions = invasionJSON.invasions;
    for (const invasion in invasions) {
      const name = invasions[invasion].type.replace("\u0003", "");
      const progress = invasions[invasion].progress;
      if (
        (cog && name === cog.name) ||
        (cogType &&
          findByKey("name", name, cogs.concat(buildingCogs)).type == cogType)
      ) {
        const progressPercentage = formatPercentage(
          progress
            .split("/")
            .map(a => parseInt(a))
            .reduce((a, b) => {
              return a / b;
            })
        );
        console.log(`${name} invasion in ${invasion}: ${progressPercentage}`);
      }
    }
  }
})();
