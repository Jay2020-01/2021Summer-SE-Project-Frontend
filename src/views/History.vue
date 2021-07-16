<template>
  <div class="history">
    <v-row>
      <v-col offset="2" cols="8">
        <!-- <h1 class="subtitle-1 grey--text">History</h1> -->
        <br />
        <v-row class="my-3"> </v-row>
        <!-- <v-container class="my-5"> content </v-container> -->
        <TotalTimeSeries />
        <br />
        <v-row class="my-3"> </v-row>
        <CountryTimeSeries />
        <!-- <DailyChart /> -->
        <!-- <v-row>
      <v-col cols="12" md="1"></v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="5">
        <DailyChart />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="5">
        <PieChart />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="1"></v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="5">
        <ColoumChart />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="5">
        <RadarChart />
      </v-col>
      <v-spacer></v-spacer>
    </v-row> -->
        <v-footer dark padless class="mt-10">
          <v-card class="flex" flat tile>
            <v-card-title class="teal lighten-1">
              <!-- <strong class="subheading">国内实时数据</strong><a href="https://lab.isaaclin.cn/nCoV/">https://lab.isaaclin.cn/nCoV/</a>
        <strong class="subheading">国内历史数据</strong><a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">https://github.com/CSSEGISandData/COVID-19/...</a>
         <strong class="subheading">国外历史数据</strong><a href="https://github.com/bumbeishvili/covid19-daily-data">https://github.com/bumbeishvili/covid19-daily-data</a> -->
              <v-btn
                text
                class="text-h6"
                @click="gotoPage('https://lab.isaaclin.cn/nCoV/')"
                >国内实时数据: https://lab.isaaclin.cn/nCoV/
              </v-btn>
              <v-btn
                text
                class="text-h6"
                @click="
                  gotoPage(
                    'https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series'
                  )
                "
                >国内历史数据: https://github.com/CSSEGISandData/...
              </v-btn>
              <v-btn
                text
                class="text-h6"
                @click="
                  gotoPage('https://github.com/bumbeishvili/covid19-daily-data')
                "
                >国外历史数据: https://github.com/bumbeishvili/...
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-title>
          </v-card>
        </v-footer>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ColoumChart from "../components/ColoumChart.vue";
import RadarChart from "../components/RadarCharts.vue";
import DailyChart from "../components/DailyChart";
import PieChart from "../components/PieChart";
import TotalTimeSeries from "../components/TotalTimeSeries.vue";
import CountryTimeSeries from "../components/CountryTimeSeries.vue";

export default {
  components: {
    TotalTimeSeries,
    CountryTimeSeries,
    ColoumChart,
    RadarChart,
    DailyChart,
    PieChart,
  },
  methods: {
    gotoPage(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>
