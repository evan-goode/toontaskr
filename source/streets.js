import _ from "lodash";

const buildStreet = (name, neighborhood, frequencies, minimum, maximum) => {
  // return a street object, makes the code below a lot more concise
  const [Bossbot, Lawbot, Cashbot, Sellbot] = frequencies;
  return {
    name,
    neighborhood,
    frequencies: {
      Bossbot,
      Lawbot,
      Cashbot,
      Sellbot
    },
    levels: _.range(minimum, maximum + 1)
  };
};

export default [
  buildStreet("Loopy Lane", "Toontown Central", [0.1, 0.7, 0.1, 0.1], 1, 3),
  buildStreet(
    "Punchline Place",
    "Toontown Central",
    [0.1, 0.1, 0.4, 0.4],
    1,
    3
  ),
  buildStreet(
    "Silly Street",
    "Toontown Central",
    [0.25, 0.25, 0.25, 0.25],
    1,
    3
  ),

  buildStreet("Barnacle Boulevard", "Donald's Dock", [0.9, 0.1, 0, 0], 3, 6),
  buildStreet("Seaweed Street", "Donald's Dock", [0, 0, 0.9, 0.1], 3, 6),
  buildStreet("Lighthouse Lane", "Donald's Dock", [0.4, 0.4, 0.1, 0.1], 3, 6),

  buildStreet("Elm Street", "Daisy Gardens", [0, 0.2, 0.1, 0.7], 3, 6),
  buildStreet("Maple Street", "Daisy Gardens", [0.1, 0.7, 0, 0.2], 3, 6),
  buildStreet("Oak Street", "Daisy Gardens", [0, 0.2, 0.1, 0.7], 3, 6),

  buildStreet("Alto Avenue", "Minnie's Melodyland", [0, 0, 0.5, 0.5], 3, 6),
  buildStreet(
    "Baritone Boulevard",
    "Minnie's Melodyland",
    [0, 0, 0.9, 0.1],
    3,
    6
  ),
  buildStreet("Tenor Terrace", "Minnie's Melodyland", [0.5, 0.5, 0, 0], 3, 6),

  buildStreet("Sleet Street", "The Brrrgh", [0.1, 0.2, 0.3, 0.4], 5, 7),
  buildStreet("Walrus Way", "The Brrrgh", [0.1, 0.2, 0.3, 0.4], 5, 7),
  buildStreet("Polar Place", "The Brrrgh", [0.1, 0.2, 0.3, 0.4], 7, 9),

  buildStreet(
    "Lullaby Lane",
    "Donald's Dreamland",
    [0.25, 0.25, 0.25, 0.25],
    6,
    9
  ),
  buildStreet(
    "Pajama Place",
    "Donald's Dreamland",
    [0.05, 0.05, 0.85, 0.05],
    6,
    9
  )
];

export const neighborhoods = [
  "Toontown Central",
  "Donald's Dock",
  "Daisy Gardens",
  "Minnie's Melodyland",
  "The Brrrgh",
  "Donald's Dreamland"
];
