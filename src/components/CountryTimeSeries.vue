<template>
  <div>
    <v-card>
      <v-row>
        <v-col cols="12" md="3">
          <v-card-title>中国疫情发展趋势</v-card-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="8">
          <v-combobox
            v-model="selections"
            :items="provinces"
            label="选择或搜索省份以显示其疫情发展趋势"
            @change="handleChange()"
            multiple
            chips
          >
            <template v-slot:selection="data">
              <v-chip
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :input-value="data.selected"
                :disabled="data.disabled"
                @click:close="data.parent.selectItem(data.item)"
              >
                {{ data.item }}
                <v-icon small @click="data.parent.selectItem(data.item)">
                  $delete
                </v-icon>
              </v-chip>
            </template>
          </v-combobox>
        </v-col>
      </v-row>

      <v-card-text id="chinaTimeSeries">
        <div id="china-chart-line2">
          <apexchart
            type="line"
            height="240"
            :options="ChartOptions"
            :series="chinaSeries"
          ></apexchart>
        </div>
        <div id="china-chart-line">
          <apexchart
            type="area"
            height="120"
            :options="ChartOptionsLine"
            :series="chinaSeriesLine"
          ></apexchart>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue-apexcharts";
import Provinces from "../../public/static/China/provinces";
import colors from "vuetify/lib/util/colors";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data: () => ({
    selections: ["全国"],
    colors_arr: [
      "amber",
      "blue",
      "blueGrey",
      "brown",
      "cyan",
      "deepOrange",
      "deepPurple",
      "green",
      "grey",
      "indigo",
      "lightBlue",
      "lime",
      "orange",
      "pink",
      "purple",
      "teal",
      "yellow",
    ],
    provinces: [],
    chinaSeries: [],
    ChartOptions: {
      chart: {
        id: "china_chart2",
        type: "line",
        height: 230,
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
      },
      colors: ["#f44336", "#000000", "#8bc34a"],
      stroke: {
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      legend: {
        position: "right",
      },
    },

    chinaSeriesLine: [],
    ChartOptionsLine: {
      chart: {
        id: "china_chart1",
        height: 130,
        type: "area",
        brush: {
          target: "china_chart2",
          enabled: true,
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date("05 Jul 2021").getTime(),
            max: new Date("12 Jul 2021").getTime(),
          },
        },
      },
      colors: ["#f44336", "#000000", "#8bc34a"],
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.91,
          opacityTo: 0.1,
        },
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        tickAmount: 2,
      },
    },
  }),
  async created() {
    this.prepareColor();
    await this.addProvince("全国");
    this.provinces.push("全国");
    Provinces.provinces.forEach((province) => {
      this.provinces.push(province);
    });
  },
  methods: {
    prepareColor() {
      this.colors_arr.forEach((color) => {
        // console.log(colors[color].base);
        this.ChartOptions.colors.push(colors[color].base);
      });
    },
    handleChange() {
      var seriesLen = this.chinaSeries.length;
      var seletionsLen = this.selections.length;
      if (seriesLen - 3 == seletionsLen * 3) {
        for (let i = 0; i < 3; i++) {
          var removedIndex = this.chinaSeries.findIndex(
            (province) =>
              -1 ==
              this.selections.findIndex(
                (selection) => province.key == selection
              )
          );
          // console.log(this.chinaSeries[removedIndex].translation);
          this.removeProvince(removedIndex);
        }
      } else {
        this.addProvince(this.selections[seletionsLen - 1]);
        // console.log("add");
      }
    },
    addProvince(province) {
      var url;
      if (province == "全国") {
        url = "http://10.251.254.94:8000/cherry/get_country_timeseries/china/";
      } else {
        url = `http://10.251.254.94:8000/cherry/get_province_timeseries/${province}/`;
      }

      axios.get(url).then((res) => {
        var timeSeries;
        if (province == "全国") timeSeries = res.data.china;
        else timeSeries = res.data[`${province}`];
        // console.log(timeSeries);
        var confirmSeriesArray = [];
        var deathSeriesArray = [];
        var cureSeriesArray = [];
        for (var day in timeSeries) {
          confirmSeriesArray.push({
            x: day,
            y: timeSeries[day].total_confirm,
          });
          deathSeriesArray.push({ x: day, y: timeSeries[day].total_dead });
          cureSeriesArray.push({ x: day, y: timeSeries[day].total_cure });
        }
        var confirm_series = {
          key: `${province}`,
          name: `${province}累计确诊`,
          data: confirmSeriesArray,
        };
        var death_series = {
          key: `${province}`,
          name: `${province}累计死亡`,
          data: deathSeriesArray,
        };
        var cure_series = {
          key: `${province}`,
          name: `${province}累计治愈`,
          data: cureSeriesArray,
        };
        this.chinaSeries.push(confirm_series);
        this.chinaSeries.push(death_series);
        this.chinaSeries.push(cure_series);

        this.chinaSeries.sort(function (a, b) {
          return b.data[b.data.length - 1].y - a.data[a.data.length - 1].y;
        });

        var brush_confirm_series = {
          name: "累计确诊",
          data: confirmSeriesArray,
        };
        var brush_death_series = { name: "累计死亡", data: deathSeriesArray };
        var brush_cure_series = { name: "累计治愈", data: cureSeriesArray };

        if (this.chinaSeriesLine.length == 0) {
          this.chinaSeriesLine.push(brush_confirm_series);
          this.chinaSeriesLine.push(brush_death_series);
          this.chinaSeriesLine.push(brush_cure_series);
        }
      });
    },
    removeProvince(index) {
      if (index != -1) {
        this.chinaSeries.splice(index, 1);
        // this.$forceUpdate();
      }
    },
  },
};
</script>
