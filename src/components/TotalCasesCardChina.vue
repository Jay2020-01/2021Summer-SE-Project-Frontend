<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-card class="d-flex flex-column justify-center align-center">
          <v-badge inline color="red" :content="today_confirmed">
            <span :class="['display-1 font-weight-bold']"
              ><ICountUp :endVal="infected"
            /></span>
          </v-badge>

          <span :class="['mt-4 title font-weight-bold']">确诊</span>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="d-flex flex-column justify-center align-center">
          <v-badge inline color="green" :content="today_recovered">
            <span :class="['display-1 font-weight-bold']"
              ><ICountUp :endVal="recovered"
            /></span>
          </v-badge>

          <span :class="['mt-4 title font-weight-bold']">治愈</span>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card class="d-flex flex-column justify-center align-center">
          <v-badge inline color="pink" :content="today_death">
            <span :class="['display-1 font-weight-bold']"
              ><ICountUp :endVal="deaths"
            /></span>
          </v-badge>
          <span :class="['mt-4 title font-weight-bold']">死亡</span>
        </v-card>
      </v-col>

      <v-col v-if="!worldFlag" cols="6">
        <v-card class="d-flex flex-column justify-center align-center">
          <v-badge inline color="blue" :content="today_vaccinated">
            <span :class="['display-1 font-weight-bold']"
              ><ICountUp :endVal="vaccinated" :options="options" />
              <span class="text-h5 font-weight-bold"> 亿 </span>
            </span>
          </v-badge>
          <span :class="['mt-4 title font-weight-bold']">疫苗接种</span>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ICountUp from "vue-countup-v2";
export default {
  props: [
    "worldFlag",
    "infected",
    "recovered",
    "deaths",
    "vaccinated",
    "today_confirmed",
    "today_recovered",
    "today_death",
    "today_vaccinated",
  ],
  components: {
    ICountUp,
  },
  created() {
    if (this.worldFlag) {
      this.cols = 4;
    } else {
      this.cols = 3;
    }
  },
  computed: {},
  methods: {},
  data() {
    return {
      cols: 0,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimalPlaces: 2,
        decimal: ".",
        prefix: "",
        suffix: "",
      },
    };
  },
};
</script>
