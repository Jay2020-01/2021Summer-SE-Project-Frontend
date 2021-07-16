<template>
  <v-card>
    <v-card-text id="chart">
      <apexchart
        ref="chart"
        type="pie"
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
    series: [44, 55, 13, 43, 22],
    chartOptions: {
      chart: {
        id: "a-pei-chart",
        height: 350,
        type: "pie",
      },
      title: {
        text: "一个饼状图",
        align: "left",
      },
      labels: ["Class A", "Class B", "Class C", "Class D", "Class E"],
      plotOptions: {
        pie: {
          expandOnClick: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  }),
};
</script>

<style>
</style>