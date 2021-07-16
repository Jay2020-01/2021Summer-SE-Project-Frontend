<template>
  <v-card>
    <v-card-text id="chart">
      <apexchart
        type="radar"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: ["data"],
  data: () => ({
    series: [
      {
        name: "Series 1",
        data: [80, 50, 30, 40, 100, 20],
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "radar",
      },
      title: {
        text: "Basic Radar Chart",
      },
      xaxis: {
        categories: ["January", "February", "March", "April", "May", "June"],
      },
    },
  }),
};
</script>
