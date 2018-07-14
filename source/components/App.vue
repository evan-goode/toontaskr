<template lang="html">
  <section>
    <select name="cog" v-model="selected.cog" autofocus>
      <option value>Any cog</option>
      <option v-for="cog in cogs" v-bind:value="cog">{{cog.name}}</option>
    </select>
    <select name="neighborhood" v-model="selected.neighborhood">
      <option value>Any neighborhood</option>
      <option v-for="neighborhood in neighborhoods" v-bind:value="neighborhood">{{neighborhood}}</option>
    </select>
    <select name="minimum" v-model="selected.minimum">
      <option v-for="minimum in minima" v-bind:disabled="minimum > selected.maximum"v-bind:value="minimum">{{minimum}}</option>
    </select>
    <select name="maximum" v-model="selected.maximum">
      <option v-for="maximum in maxima" v-bind:disabled="maximum < selected.minimum" v-bind:value="maximum">{{maximum}}</option>
    </select>
    <p>Best streets:</p>
    <ol v-if="bestStreets.length">
      <li v-for="scoredStreet in bestStreets">
        <p>{{scoredStreet.street.name}}: {{scoredStreet.score}}</p>
        <p v-if="scoredStreet.invasion">{{scoredStreet.invasion.cog.name}} invasion in {{scoredStreet.invasion.district}}: {{scoredStreet.invasion.progress}}</p>
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
  POLL_INTERVAL
} from "../constants";
import cogs from "../cogs";
import streets, { neighborhoods } from "../streets";
import { score } from "../toontown";

export default {
  name: "App",
  data: () => ({
    cogs,
    neighborhoods,
    minima: _.range(MAXIMUM_LEVEL, MINIMUM_LEVEL - 1),
    maxima: _.range(MAXIMUM_LEVEL, MINIMUM_LEVEL - 1),
    selected: {
      cog: "",
      neighborhood: "",
      minimum: MINIMUM_LEVEL,
      maximum: MAXIMUM_LEVEL
    },
    invasions: []
  }),
  computed: {
    bestStreets: function() {
      const { cog, neighborhood, minimum, maximum } = this.selected;
      const { invasions } = this;
      const scoredStreetsByInvasion = [...invasions, null].map(invasion =>
        streets.map(street => ({
          street,
          invasion,
          score: score({
            street,
            cog,
            neighborhood,
            invasion,
            minimum,
            maximum
          })
        }))
      );
      return _.flatten(scoredStreetsByInvasion)
        .filter(scoredStreet => scoredStreet.score)
        .sort((a, b) => b.score - a.score || +!!b.invasion - +!!a.invasion);
    }
  },
  methods: {
    updateInvasions: async function() {
      const response = await fetch(INVASION_API_ENDPOINT);
      const json = await response.json();
      if (json.error) {
        throw json.error;
      }
      this.invasions = Object.keys(json.invasions).map(district => {
        const name = json.invasions[district].type.replace("\u0003", "");
        const cog = cogs.find(cog => name === cog.name);
        return {
          district,
          cog,
          progress: json.invasions[district].progress
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
