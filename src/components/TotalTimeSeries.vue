<template>
  <div>
    <v-card>
      <v-row>
        <v-col cols="12" md="3">
          <v-card-title>世界疫情发展趋势</v-card-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="8">
          <v-combobox
            v-model="selections"
            :items="countries"
            label="选择或搜索国家以显示其疫情发展趋势"
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
      <v-card-text id="worldTimeSeries">
        <div id="world-chart-line2">
          <apexchart
            type="line"
            height="240"
            :options="ChartOptions"
            :series="worldSeries"
          ></apexchart>
        </div>
        <div id="world-chart-line">
          <apexchart
            type="area"
            height="120"
            :options="ChartOptionsLine"
            :series="worldSeriesLine"
          ></apexchart>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue-apexcharts";
import WorldCountries from "../../public/static/worldcountries";
import colors from "vuetify/lib/util/colors";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data: () => ({
    selections: ["全球"],
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
    countries: [],
    worldSeries: [],
    ChartOptions: {
      chart: {
        id: "world_chart2",
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

    worldSeriesLine: [],
    ChartOptionsLine: {
      chart: {
        id: "world_chart1",
        height: 130,
        type: "area",
        brush: {
          target: "world_chart2",
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
    await this.addCountry("全球");
    this.countries.push("全球");
    WorldCountries.WORLD_COUNTRIES.forEach((location) => {
      this.countries.push(location.translation);
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
      var seriesLen = this.worldSeries.length;
      var seletionsLen = this.selections.length;
      if (seriesLen - 3 == seletionsLen * 3) {
        for (let i = 0; i < 3; i++) {
          var removedIndex = this.worldSeries.findIndex(
            (country) =>
              -1 ==
              this.selections.findIndex(
                (selection) => country.translation == selection
              )
          );
          // console.log(this.worldSeries[removedIndex].translation);
          this.removeCountry(removedIndex);
        }
      } else {
        this.addCountry(this.selections[seletionsLen - 1]);
        // console.log("add");
      }
    },
    addCountry(country_translation) {
      var country;
      var url;
      if (country_translation == "全球") {
        country = { name: "total", translation: "全球" };
        url = "http://10.251.254.94:8000/cherry/get_total_timeserise/";
      } else {
        country = WorldCountries.WORLD_COUNTRIES.find(
          (location) => location.translation == country_translation
        );
        url = `http://10.251.254.94:8000/cherry/get_country_timeseries/${country.name}/`;
      }

      axios.get(url).then((res) => {
        var timeSeries = res.data[`${country.name}`];
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
          key: `${country.name}`,
          name: `${country.translation}累计确诊`,
          translation: `${country.translation}`,
          data: confirmSeriesArray,
        };
        var death_series = {
          key: `${country.name}`,
          name: `${country.translation}累计死亡`,
          translation: `${country.translation}`,
          data: deathSeriesArray,
        };
        var cure_series = {
          key: `${country.name}`,
          name: `${country.translation}累计治愈`,
          translation: `${country.translation}`,
          data: cureSeriesArray,
        };
        this.worldSeries.push(confirm_series);
        this.worldSeries.push(death_series);
        this.worldSeries.push(cure_series);

        this.worldSeries.sort(function (a, b) {
          return b.data[b.data.length - 1].y - a.data[a.data.length - 1].y;
        });

        var brush_confirm_series = {
          name: "累计确诊",
          data: confirmSeriesArray,
        };
        var brush_death_series = { name: "累计死亡", data: deathSeriesArray };
        var brush_cure_series = { name: "累计治愈", data: cureSeriesArray };

        if (this.worldSeriesLine.length == 0) {
          this.worldSeriesLine.push(brush_confirm_series);
          this.worldSeriesLine.push(brush_death_series);
          this.worldSeriesLine.push(brush_cure_series);
        }
      });
    },
    removeCountry(index) {
      if (index != -1) {
        this.worldSeries.splice(index, 1);
        // this.$forceUpdate();
      }
    },
  },
};
</script>
