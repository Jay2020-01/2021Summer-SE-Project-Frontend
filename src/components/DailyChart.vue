<template>
  <v-card>
    <v-card-text id="chart">
      <apexchart
        ref="chart"
        type="line"
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
        name: "确诊",
        data: [28, 29, 33, 36, 32, 32, 33],
      },
      {
        name: "治愈",
        data: [15, 19, 22, 27, 23, 18, 18],
      },
      {
        name: "死亡",
        data: [8, 7, 10, 9, 12, 9, 8],
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#77B6EA", "#00897B", "#545454"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "新增确诊、治愈、死亡人数",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  }),

  watch: {
    data(val) {
      const datesCombined = val.map((i) => i.dates).flat(1);
      const uniqueDates = [...new Set(datesCombined.map((i) => i.date))];
      const categories = uniqueDates.slice(
        Math.max(uniqueDates.length - 10, 1)
      );
      const categories11 = uniqueDates.slice(
        Math.max(uniqueDates.length - 11, 1)
      );
      this.$refs.chart.updateOptions({
        xaxis: {
          categories,
        },
      });
      const series = [
        {
          name: "确诊",
          data: Array(categories11.length).fill(0),
        },
        {
          name: "治愈",
          data: Array(categories11.length).fill(0),
        },
        {
          name: "死亡",
          data: Array(categories11.length).fill(0),
        },
      ];
      datesCombined.forEach((item) => {
        const categoryIdx = categories11.indexOf(item.date);
        series[0].data[categoryIdx] += item.confirmed;
        series[1].data[categoryIdx] += item.death;
      });

      for (let i = categories11.length - 1; i > 0; i -= 1) {
        series[0].data[i] -= series[0].data[i - 1];
        series[1].data[i] -= series[1].data[i - 1];
      }

      series[0].data = series[0].data.slice(1, 11);
      series[1].data = series[1].data.slice(1, 11);
      this.$refs.chart.updateSeries(series);
    },
  },
};
</script>
