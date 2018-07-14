<template lang="html">
  <section>
    <select name="cog" v-model="selected.cog" @change="update" autofocus>
      <option value>Any cog</option>
      <option v-for="cog in cogs" v-bind:value="cog">{{cog.name}}</option>
    </select>
    <select name="neighborhood" v-model="selected.neighborhood" @change="update">
      <option value>Any neighborhood</option>
      <option v-for="neighborhood in neighborhoods" v-bind:value="neighborhood">{{neighborhood}}</option>
    </select>
    <select name="minimum" v-model="selected.minimum" @change="update">
      <option v-for="minimum in minima" v-bind:disabled="minimum > selected.maximum"v-bind:value="minimum">{{minimum}}</option>
    </select>
    <select name="maximum" v-model="selected.maximum" @change="update">
      <option v-for="maximum in maxima" v-bind:disabled="maximum < selected.minimum" v-bind:value="maximum">{{maximum}}</option>
    </select>
    <p>Best:</p>
    <ol v-if="bestStreets.length">
      <li v-for="scoredStreet in bestStreets">{{scoredStreet.street.name}}: {{scoredStreet.score}}</li>
    </ol>
  </section>
</template>

<script>
import _ from "lodash";

import { MINIMUM_LEVEL, MAXIMUM_LEVEL } from "../constants";
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
    bestStreets: []
  }),
  methods: {
    update: function() {
      const { cog, neighborhood, minimum, maximum } = this.selected;
      const scoredStreets = streets
        .map(street => ({
          street,
          score: score({ street, cog, neighborhood, minimum, maximum })
        }))
        .filter(scoredStreet => scoredStreet.score);
      this.bestStreets = scoredStreets.sort((a, b) => b.score - a.score);
    }
  },
  created: function() {
    this.update();
  }
};
</script>
