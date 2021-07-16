<template>
  <div class="world">
    <!-- <h1 class="subtitle-1 grey--text">World</h1> -->
    <br />
    <v-row>
      <v-col cols="12" md="9">
        <TotalCases
          :worldFlag="true"
          :infected="cases.total_confirmed"
          :recovered="cases.total_recovered"
          :deaths="cases.total_death"
          :vaccinated="cases.total_vaccinated"
          :today_confirmed="'+' + cases.today_confirmed"
          :today_recovered="'+' + cases.today_recovered"
          :today_death="'+' + cases.today_death"
          :today_vaccinated="'+' + cases.today_vaccinated + '万'"
        ></TotalCases>
        <v-container class="my-5">
          <!-- <div ref="globeViz" id="globeViz">
        <button @click='diyfun'>地球</button>
      </div> -->
          <!-- css copy begin-->
          <v-row>
            <v-col cols="12">
              <v-card ref="vcard1" tile style="" flat>
                <div ref="globeViz" id="globeViz">
                  <button @click="diyfun">全球疫情</button>
                </div>
                <!-- bottom div -->
                <div class="bottom-info-container" v-show="show_timeline">
                  <div style="display: flex; justify-content: center">
                    <div class="timeline-container">
                      <button
                        disabled
                        style="margin-right: 10px"
                        class="play-button"
                        @click="show_daily_change2()"
                      >
                        Play
                      </button>
                      <input
                        class="slider"
                        disabled
                        type="range"
                        min="0"
                        max="1"
                        step="1"
                        @input="update_when_drag()"
                      />
                      <span
                        style="font-size: 14px; color: #ccd6f6"
                        class="slider-date"
                      ></span>
                    </div>
                  </div>
                  <div
                    style="font-size: 14px; color: #ccd6f6; margin-top: 35px"
                  >
                    疫情数据 <span class="updated"></span>
                  </div>
                  <div style="color: #e6f1ff; padding: 0 5px">
                    确诊: <span id="infected">0</span> • 死亡:
                    <span id="deaths">0</span> • 治愈:
                    <span id="recovered">0</span>
                  </div>
                  <!-- <div style="margin-top: 5px;">
        <a
          href="https://github.com/sorxrob/covid-3d"
          rel="noopener noreferrer"
          target="_BLANK"
          style="color: #ffffff; text-decoration: none;"
          >More Information</a
        >
      </div> -->
                </div>
                <!-- bottom div end -->
              </v-card>
            </v-col>
          </v-row>
          <!-- css copy end -->
          <!-- html copied  from here -->
          <!-- <div class="top-info-container">
        <div class="title">COVID-19</div>
        <div class="title-desc" ref="title_desc_div">
          Loading countries affected by the virus...
        </div>
      </div> -->

          <!-- html copied  end here -->
        </v-container>
      </v-col>
      <v-col cols="12" md="3">
        <Ranking />
      </v-col>
    </v-row>
                <v-footer dark padless class="ma-4">
      <v-card class="flex" flat tile>
        <v-card-title class="teal lighten-1">
          <!-- <strong class="subheading">国内实时数据</strong><a href="https://lab.isaaclin.cn/nCoV/">https://lab.isaaclin.cn/nCoV/</a>
        <strong class="subheading">国内历史数据</strong><a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series">https://github.com/CSSEGISandData/COVID-19/...</a>
         <strong class="subheading">国外历史数据</strong><a href="https://github.com/bumbeishvili/covid19-daily-data">https://github.com/bumbeishvili/covid19-daily-data</a> -->
         <v-btn text class="text-h6" @click="gotoPage('https://lab.isaaclin.cn/nCoV/')">国内实时数据: https://lab.isaaclin.cn/nCoV/ </v-btn>
         <v-btn text class="text-h6" @click="gotoPage('https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series')" >国内历史数据: https://github.com/CSSEGISandData/... </v-btn>
         <v-btn text class="text-h6" @click="gotoPage('https://github.com/bumbeishvili/covid19-daily-data')" >国外历史数据: https://github.com/bumbeishvili/... </v-btn>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
import axios from "axios";
import TotalCases from "../components/TotalCasesCard.vue";
import Ranking from "../components/Ranking.vue";

import { myfun } from "../test.js"; //注意路径
import { init } from "../app.js";
import { polygonFromCenter } from "../app.js";
import { getCases } from "../app.js";
import { updateCounters } from "../app.js";
import { updatePolygonsData } from "../app.js";
import { updatePointOfView } from "../app.js";
import { play_button_click } from "../app.js";
//import { earthResize } from "../app.js";

import Globe from "globe.gl";
import {
  request,
  getCoordinates,
  numberWithCommas,
  formatDate,
} from "../index.js";
import {
  GLOBE_IMAGE_URL,
  BACKGROUND_IMAGE_URL,
  GEOJSON_URL,
  // GEOJSON_URL2,
  CASES_API,
} from "../constants.js";
import * as d3 from "d3";

let world;
let flagName;
const flagEndpoint = "https://corona.lmao.ninja/assets/img/flags";

//window.addEventListener("resize", earthResize());

export default {
  components: {
    TotalCases,
    Ranking,
  },
  data: () => ({
    show_timeline: false,
    //earth_proper_width: this.$refs.globeViz.scrollWidth,
    cases: {
      total_confirmed: 0,
      total_recovered: 0,
      total_death: 0,
      today_confirmed: 0,
      today_recovered: 0,
      today_death: 0,
      data: [],
    },
  }),
  async created() {
    await this.getCases();
    this.diyfun();
  },
  methods: {
    diyfun: function () {
      myfun();
      //console.log(this.$refs.globeViz);

      console.log(
        "this.$refs.globeViz.clientHeight:" + this.$refs.globeViz.clientHeight
      );
      console.log(
        "this.$refs.globeViz.scrollWidth:" + this.$refs.globeViz.scrollWidth
      );
      this.show_timeline = true;
      init(this.$refs.globeViz, this.$refs.globeViz.scrollWidth);
    },
    show_daily_change2() {
      play_button_click();
    },
    update_when_drag() {
      updateCounters();
      updatePolygonsData();
    },
    getCases() {
      var url = "http://10.251.254.94:8000/cherry/global_china_sum/";
      axios.get(url).then((res) => {
        this.cases.total_confirmed = res.data.global.sum_total_confirm;
        this.cases.total_recovered = res.data.global.sum_total_cure;
        this.cases.total_death = res.data.global.sum_total_dead;
        this.cases.today_confirmed = res.data.global.sum_new_confirm;
        this.cases.today_recovered = res.data.global.sum_new_cure;
        this.cases.today_death = res.data.global.sum_new_dead;
      });
    },
        gotoPage(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
#globeViz {
  width: 100%;
  height: 100%;
  border: #000 1px solid;
}

.top-info-container {
  z-index: 1;
  top: 20px;
  position: absolute;
  color: white;
  text-align: center;
  width: 100%;
}

.bottom-info-container {
  z-index: 1;
  bottom: 20px;
  position: absolute;
  color: white;
  text-align: center;
  width: 100%;
}

.title {
  font-size: 35px;
  color: #e6f1ff;
}

.title-desc {
  margin-top: 5px;
  color: #ccd6f6;
  padding: 0 5px;
}

#infected {
  color: goldenrod;
}

#deaths {
  color: #ff4848;
}

#recovered {
  color: #1ae021;
}

.card2 {
  font-family: "Space Mono", monospace;
  transition: 0.3s;
  background-color: black;
  width: 190px;
  border: 2px solid steelblue;
  border-radius: 10px;
  z-index: 2;
}

.container {
  /* padding: 3px 16px; */
  padding-top: 1px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  text-align: left;
}

.card2-img {
  object-fit: contain;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card2-title {
  font-weight: bold;
  border: 2px solid steelblue;
}

.card2-spacer {
  height: 5px;
}

.bottom-info {
  display: flex;
  flex-direction: column;
  font-size: 11px;
}

.scene-tooltip {
  z-index: 2;
}

.timeline-container {
  z-index: 1;
  position: absolute;
  display: flex;
  color: #fff;
  width: 60%;
  align-items: center;
}

@media only screen and (max-width: 768px) {
  .timeline-container {
    width: 90%;
  }
}

.slider {
  -webkit-appearance: none;
  height: 2px;
  width: 100%;
  margin-right: 10px;
  border-radius: 5px;
  background: #ccd6f6;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
  border: 2px solid #ccd6f6;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
  border: 2px solid #ccd6f6;
}

.play-button {
  border-radius: 5px;
  padding: 5px;
  font-size: 14px;
  cursor: pointer;
  background-color: rgba(1, 1, 1, 0);
  border: 1px solid #ccd6f6;
  color: #ccd6f6;
  outline: none;
  width: 5em;
}
.v-btn {
  text-transform: none;
}
</style>