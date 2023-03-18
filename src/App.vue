<template>
  <section>
    <select autofocus name="cogSelector" v-model="selected.cogSelector">
      <option v-for="cogSelector in cogSelectors" :value="cogSelector">
        {{cogSelector.name}}
      </option>
    </select>
    <select name="neighborhoodSelector" v-model="selected.neighborhoodSelector">
      <option
        v-for="neighborhoodSelector in neighborhoodSelectors"
        :value="neighborhoodSelector">
        {{neighborhoodSelector.name}}
      </option>
    </select>
    <select name="minimum" v-model="selected.minimum">
      <option
        v-for="minimum in minima"
        :disabled="minimum > selected.maximum"
        :value="minimum">
        {{minimum}}
      </option>
    </select>
    <select name="maximum" v-model="selected.maximum">
      <option
        v-for="maximum in maxima"
        :disabled="maximum < selected.minimum"
        :value="maximum">
        {{maximum}}
      </option>
    </select>
    <p>Best streets:</p>
    <ol v-if="bestStreets.length">
      <li v-for="scoredStreet in bestStreets">
        <p>{{scoredStreet.street.name}} ({{scoredStreet.street.neighborhood.name}}): {{(100 * scoredStreet.score).toFixed(1)}}%</p>
        <p v-if="scoredStreet.invasion">
          {{scoredStreet.invasion.cog.name}} invasion in
          {{scoredStreet.invasion.district}}:
          {{formatProgress(scoredStreet.invasion.progress)}} complete
        </p>
      </li>
    </ol>
    <p v-else>No streets match your query</p>
  </section>
</template>
<script>
import _ from "lodash";

import {
  MINIMUM_LEVEL,
  MAXIMUM_LEVEL,
  INVASION_API_ENDPOINT,
  INVALID_API_CHARACTERS,
  POLL_INTERVAL,
  SELECTOR_TYPES
} from "./constants";
const { COG } = SELECTOR_TYPES;
import cogSelectors from "./cogSelectors";
import streets, { neighborhoodSelectors } from "./streets";

import { score } from "./toontown";

export default {
  name: "App",
  data: () => ({
    cogSelectors,
    neighborhoodSelectors,
    minima: _.range(MAXIMUM_LEVEL, MINIMUM_LEVEL - 1),
    maxima: _.range(MAXIMUM_LEVEL, MINIMUM_LEVEL - 1),
    selected: {
      cogSelector: _.head(cogSelectors),
      neighborhoodSelector: _.head(neighborhoodSelectors),
      minimum: MINIMUM_LEVEL,
      maximum: MAXIMUM_LEVEL
    },
    invasions: []
  }),
  computed: {
    bestStreets: function() {
      const {
        cogSelector,
        neighborhoodSelector,
        minimum,
        maximum
      } = this.selected;
      const { invasions } = this;
      const scoredStreetsByInvasion = [null, ...invasions].map(invasion =>
        streets.map(street => ({
          street,
          invasion,
          score: score({
            street,
            cogSelector,
            neighborhoodSelector,
            invasion,
            minimum,
            maximum
          })
        }))
      );
      return _.flatten(scoredStreetsByInvasion)
        .filter(scoredStreet => scoredStreet.score)
        .sort((a, b) => {
          const scoreDifference = b.score - a.score;
          if (scoreDifference) return scoreDifference;
          const getInvasionRemaining = scoredStreet =>
            (scoredStreet.invasion &&
              scoredStreet.invasion.progress.total -
                scoredStreet.invasion.progress.defeated) ||
            0;
          return getInvasionRemaining(b) - getInvasionRemaining(a);
        });
    }
  },
  methods: {
    formatProgress: progress =>
      `${Math.round((100 * progress.defeated) / progress.total)}%`,
    updateInvasions: async function() {
      const response = await fetch(INVASION_API_ENDPOINT);
      const json = await response.json();
      if (json.error) {
        throw json.error;
      }
      this.invasions = Object.keys(json.invasions).map(district => {
        const name = json.invasions[district].type
          .split("")
          .filter(character => !INVALID_API_CHARACTERS.includes(character))
          .join("");
        const cog = cogSelectors.find(
          cogSelector => cogSelector.type === COG && name === cogSelector.name
        );
        const [defeated, total] = json.invasions[district].progress
          .split("/")
          .map(string => +string);
        return {
          district,
          cog,
          progress: { defeated, total }
        };
      });
    }
  },
  created: function() {
    this.updateInvasions();
    setInterval(this.updateInvasions, POLL_INTERVAL);
  }
};
</script>
