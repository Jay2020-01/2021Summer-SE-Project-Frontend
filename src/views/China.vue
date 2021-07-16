<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <div class="china">
          <v-container class="my-5">
            <v-row>
              <v-col cols="12">
                <v-card tile style="height: 90vh" flat>
                  <iframe
                    :src="`${publicPath}static/China/index.html`"
                    style="width: 100%; height: 100%"
                    title="map"
                    id="ChinaMap"
                  ></iframe>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <!-- 高风险地区卡片 -->
        <v-card class="my-9" color="red">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h5 white--text"
                >高风险地区</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list v-if="high_flag" min-height="100px">
            <v-list-item v-for="(item, index) in high_risk_list" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row class="text-h6">
                    <v-col cols="3">{{ item.province_name }}</v-col>
                    <v-col cols="4">{{ item.city_name }}</v-col>
                    <v-col cols="5" class="red--text"
                      >现有确诊：{{ item.current_confirmed_count }}</v-col
                    >
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-else min-height="100px">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row class="text-h6">
                    <v-col cols="12">暂无高风险地区</v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- 中风险地区卡片 -->
        <v-card class="my-9" color="yellow darken-2">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="white--text text-h5"
                >中风险地区</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list v-if="middle_flag" min-height="100px">
            <v-list-item v-for="(item, index) in middle_risk_list" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row class="text-h6">
                    <v-col cols="3">{{ item.province_name }}</v-col>
                    <v-col cols="4">{{ item.city_name }}</v-col>
                    <v-col cols="5" class="yellow--text text--darken-2"
                      >现有确诊：{{ item.current_confirmed_count }}</v-col
                    >
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-else min-height="100px">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row class="text-h6">
                    <v-col cols="12">暂无中风险地区</v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <TotalCases
          :worldFlag="false"
          :infected="cases.total_confirmed"
          :recovered="cases.total_recovered"
          :deaths="cases.total_death"
          :vaccinated="cases.total_vaccinated"
          :today_confirmed="'+' + cases.today_confirmed"
          :today_recovered="'+' + cases.today_recovered"
          :today_death="'+' + cases.today_death"
          :today_vaccinated="'+' + cases.today_vaccinated + '万'"
        ></TotalCases>

        <!-- 定位卡片 -->
        <v-card class="my-9" color="light-blue">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title v-if="located" class="white--text text-h5">
                当前定位：{{ location.name }}
                <v-icon dark style="padding-bottom: 3px"
                  >mdi-map-marker-outline</v-icon
                >
              </v-list-item-title>
              <v-list-item-title v-else style="text-align: center"
                ><v-btn text @click="getLocation()" class="white--text text-h5">
                  点击获取定位，查看当前地区疫情数据
                  <v-icon dark style="padding-top: 3px"
                    >mdi-map-marker-outline</v-icon
                  >
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list v-if="located" min-height="100px">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row class="text-h6">
                    <v-col cols="2">
                      {{ cityName }}
                    </v-col>
                    <v-col cols="3" class="blue--text">
                      新增确诊： {{ location.today_confirm }}
                    </v-col>
                    <v-col cols="3" class="blue--text">
                      现有确诊： {{ location.total_nowConfirm }}
                    </v-col>
                    <v-col cols="4" class="blue--text"
                      >累计确诊：{{ location.total_Confirm }}</v-col
                    >
                  </v-row>
                  <v-row class="text-h6">
                    <v-col cols="2">
                      {{ provName }}
                    </v-col>
                    <v-col cols="3" class="blue--text">
                      新增确诊： {{ provinceData.today_confirm }}
                    </v-col>
                    <v-col cols="3" class="blue--text">
                      现有确诊： {{ provinceData.total_nowConfirm }}
                    </v-col>
                    <v-col cols="4" class="blue--text"
                      >累计确诊：{{ provinceData.total_Confirm }}</v-col
                    >
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list v-else min-height="100px">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row class="text-h6">
                    <v-col cols="12">暂无定位信息</v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- 中国地区卡片 -->
        <!-- <v-card class="my-9">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="blue--text text--darken-3 text-h6"
                >中国地区</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>

          <v-list>
            <v-list-item
              v-for="(item, index) in china_list.children"
              :key="index"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <v-row>
                    <v-col cols="2">{{ item.name }}</v-col>
                    <v-col cols="5">今日确诊：{{ item.today.confirm }}</v-col>
                    <v-col cols="5" class="blue--text text--darken-3"
                      >现有确诊：{{ item.total.nowConfirm }}</v-col
                    >
                  </v-row>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="5" class="green--text text--darken-3"
                      >累计治愈:{{ item.total.heal }}</v-col
                    >
                    <v-col cols="5" class="red--text text--darken-3"
                      >累计死亡:{{ item.total.dead }}</v-col
                    >
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card> -->
      </v-col>
    </v-row>
    <!-- 中国信息列表 -->
    <v-row>
      <v-col md="8">
        <v-card class="ma-4">
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="搜索"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            class="font-weight-black"
            :headers="headers"
            :items="china_list"
            :search="search"
            item-key="name"
            show-expand
          >
            <template v-slot:expanded-item="{ item }">
              <td :colspan="7" style="padding: 0">
                <v-data-table
                  class="font-weight-black grey lighten-3"
                  :headers="subheaders"
                  hide-default-footer
                  :items="item.cities"
                  light
                >
                  <template v-slot:[`item.icon`]>
                    <v-icon>mdi-circle-small</v-icon>
                  </template>
                </v-data-table>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-footer dark padless class="ma-4">
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
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
// import Tweets from './components/Tweets.vue';
import API from "../API";
import TotalCases from "../components/TotalCasesCardChina";
// import VueAMap from "vue-amap";
import AMapLoader from "@amap/amap-jsapi-loader";

AMapLoader.load({
  key: "ef2882cf78e40ff2ba58dd128034eea0", // 申请好的Web端开发者Key，首次调用 load 时必填
  version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  AMapUI: {
    // 是否加载 AMapUI，缺省不加载
    version: "1.1", // AMapUI 缺省 1.1
    plugins: [], // 需要加载的 AMapUI ui插件
  },
  Loca: {
    // 是否加载 Loca， 缺省不加载
    version: "1.3.2", // Loca 版本，缺省 1.3.2
  },
})
  .then((AMap) => {
    var map = new AMap.Map("container");
    // console.log(map);
  })
  .catch((e) => {
    console.log(e);
  });

// VueAMap.initAMapApiLoader({
//   key: "ef2882cf78e40ff2ba58dd128034eea0",
//   plugin: [],
//   v: "1.4.4",
// });

export default {
  name: "Home",
  components: {
    TotalCases,
  },

  data: () => ({
    located: false,
    // municipalities:false,
    location: {
      name: "当前未定位",
      today_confirm: 0,
      total_nowConfirm: 0,
      total_Confirm: 0,
    },
    provinceData: {
      today_confirm: 0,
      total_nowConfirm: 0,
      total_Confirm: 0,
    },
    provName: "",
    cityName: "",
    publicPath: process.env.BASE_URL,
    drawer: null,
    cases: {
      total_confirmed: 0,
      total_recovered: 0,
      total_death: 0,
      total_vaccinated: 13.82482,
      today_confirmed: 0,
      today_recovered: 0,
      today_death: 0,
      today_vaccinated: 832.0,
      data: [],
    },
    chinaData: {},
    selected: {},
    dialog: false,
    loading: false,
    snackbar: false,
    fatalityRate: {
      byAge: [],
      bySex: [],
      byComorbidity: [],
    },
    // 总风险地区列表
    total_list: [],
    high_flag: true,
    middle_flag: true,
    // 中风险地区
    middle_risk_list: [
      {
        city_name: "深圳",
        province_name: "广东省",
        current_confirmed_count: 37,
        total_confirm: 554,
        total_suspected: 3,
        total_dead: 3,
        total_cure: 514,
        flag: 1,
      },
    ],
    // 高风险地区
    high_risk_list: [
      {
        city_name: "深圳",
        province_name: "广东省",
        current_confirmed_count: 37,
        total_confirm: 554,
        total_suspected: 3,
        total_dead: 3,
        total_cure: 514,
        flag: 1,
      },
    ],
    // 中国列表
    search: "",
    headers: [
      {
        text: "省份",
        align: "start",
        // filterable: false,
        value: "name",
        width: 250,
      },
      { text: "新增确诊", value: "today_confirm" },
      { text: "现存确诊", value: "total_nowConfirm" },
      { text: "累计确诊", value: "total_confirm" },
      { text: "死亡", value: "total_dead" },
      { text: "治愈", value: "total_heal" },
    ],
    subheaders: [
      {
        text: "",
        align: "start",
        value: "icon",
        width: 56,
      },
      {
        text: "城市",
        align: "start",
        value: "name",
        width: 250,
      },
      { text: "新增确诊", value: "today_confirm" },
      { text: "现存确诊", value: "total_nowConfirm" },
      { text: "累计确诊", value: "total_confirm" },
      { text: "死亡", value: "total_dead" },
      { text: "治愈", value: "total_heal" },
    ],
    china_list: [
      {
        name: "台湾",
        today_confirm: 40,
        total_nowConfirm: 3136,
        total_confirm: 15128,
        total_dead: 715,
        total_heal: 11277,
        cities: [],
      },
    ],
  }),

  computed: {
    // ...mapState(["isDarkTheme"]),
    locations() {
      const data = [];
      this.cases.data.forEach((item) => {
        const idx = data.findIndex(
          (i) => i["Country/Region"] === item["Country/Region"]
        );
        const { confirmed } = item.dates[item.dates.length - 1];
        const { recovered } = item.dates[item.dates.length - 1];
        const { death } = item.dates[item.dates.length - 1];
        if (idx === -1) {
          const obj = {
            ...item,
            confirmed,
            recovered,
            death,
          };
          delete obj["Province/State"];
          delete obj.dates;
          data.push(obj);
        } else {
          data[idx].confirmed += confirmed;
          data[idx].recovered += recovered;
          data[idx].death += death;
        }
      });
      return data.sort((a, b) => b.confirmed - a.confirmed);
    },
    mainlandChinaCases() {
      return this.cases.data.filter(
        (i) => i["Country/Region"] === "Mainland China"
      );
    },
  },

  async created() {
    this.getDanger();
    // this.$vuetify.theme.dark = this.isDarkTheme;
    this.loading = true;
    // this.cases = await API.getCases();
    await this.getCases();
    this.fatalityRate = await API.getFatalityRate();
    const that = this;
    this.chinaData = await API.getChianData();
    const d = JSON.parse(this.chinaData.data);
    const china = d.areaTree[0];
    // console.log(china);
    this.getChinaListData(china);
    // this.getLocation();
    var temp = await this.sleep(500);
    window.frames.ChinaMap.contentWindow.updateData(china);
    this.loading = false;
  },

  // mounted() {
  //   document.addEventListener("swUpdated", () => {
  //     this.snackbar = true;
  //   });
  //   const that = this;
  // },

  watch: {
    // isDarkTheme(val) {
    //   this.$vuetify.theme.dark = val;
    // },
  },

  methods: {
    ...mapMutations(["TOGGLE_THEME"]),
    sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    getLocation() {
      const that = this;

      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });

        geolocation.getCurrentPosition(function (status, result) {
          if (status == "complete") {
            onComplete(result);
          } else {
            onError(result);
          }
        });

        function onComplete(data) {
          // data是具体的定位信息
          // console.log(data);
          // console.log(that.china_list);

          let tmp_prov = that.china_list.find(
            (province) =>
              province.name.slice(0, 2) ===
              data.addressComponent.province.slice(0, 2)
          );

          that.provinceData.today_confirm = tmp_prov.today_confirm;
          that.provinceData.total_nowConfirm = tmp_prov.total_nowConfirm;
          that.provinceData.total_Confirm = tmp_prov.total_confirm;

          that.provName = data.addressComponent.province;

          if (data.addressComponent.city === "") {
            that.location.name =
              data.addressComponent.province + data.addressComponent.district;

            that.cityName = data.addressComponent.district;

            let district = tmp_prov.cities.find(
              (city) =>
                city.name.slice(0, 2) ===
                data.addressComponent.district.slice(0, 2)
            );

            that.location.today_confirm = district.today_confirm;
            that.location.total_nowConfirm = district.total_nowConfirm;
            that.location.total_Confirm = district.total_confirm;
            // console.log(that.location);
          } else {
            that.location.name =
              data.addressComponent.province + data.addressComponent.city;

            that.cityName = data.addressComponent.city;

            let tmp_city = tmp_prov.cities.find(
              (city) =>
                city.name.slice(0, 2) == data.addressComponent.city.slice(0, 2)
            );
            // console.log(tmp_city == undefined);
            that.location.today_confirm = tmp_city.today_confirm;
            that.location.total_nowConfirm = tmp_city.total_nowConfirm;
            that.location.total_Confirm = tmp_city.total_confirm;
            // console.log(that.location);
          }
          that.located = true;
        }

        function onError(data) {
          // 定位出错
          console.log(data);
        }
      });
      // AMap.plugin("AMap.CitySearch", function () {
      //   var citySearch = new AMap.CitySearch();

      //   citySearch.getLocalCity(function (status, result) {
      //     if (status === "complete" && result.info === "OK") {
      //       // 查询成功，result即为当前所在城市信息
      //   });
      // });
    },
    view(location) {
      if (this.$vuetify.breakpoint.smAndDown) {
        this.drawer = false;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      const { Lat, Long } = location;
      // console.log(location);
      this.$refs.map.flyTo(Lat, Long);
    },
    viewDetails(location) {
      this.selected = {
        ...location,
        confirmed: +location.dates[location.dates.length - 1].confirmed,
        death: +location.dates[location.dates.length - 1].death,
        recovered: +location.dates[location.dates.length - 1].recovered,
        today_confirmed: +location.today.confirmed,
        today_recovered: +location.today.recovered,
        today_death: +location.today.death,
      };
      this.dialog = true;
    },
    endReached() {
      this.$refs.tweets.loadMore();
    },
    reload() {
      window.location.reload(true);
    },
    getCases() {
      var url = "http://10.251.254.94:8000/cherry/global_china_sum/";
      axios.get(url).then((res) => {
        this.cases.total_confirmed = res.data.china.sum_total_confirm;
        this.cases.total_recovered = res.data.china.sum_total_cure;
        this.cases.total_death = res.data.china.sum_total_dead;
        this.cases.today_confirmed = res.data.china.sum_new_confirm;
        this.cases.today_recovered = res.data.china.sum_new_cure;
        this.cases.today_death = res.data.china.sum_new_dead;
      });
    },
    // 获取中高风险地区数据
    getDanger() {
      var url = "http://10.251.254.94:8000/cherry/get_danger/";
      axios.get(url).then((res) => {
        this.total_list = res.data;
        this.high_risk_list = [];
        this.middle_risk_list = [];
        for (var i = 0; i < this.total_list.length; i++) {
          if (this.total_list[i].flag == 1) {
            this.middle_risk_list.push(this.total_list[i]);
          } else {
            this.high_risk_list.push(this.total_list[i]);
          }
        }
        if (this.high_risk_list.length == 0) this.high_flag = false;
        if (this.middle_risk_list.length == 0) this.middle_flag = false;
      });
    },
    getChinaListData(china) {
      this.china_list = [];
      // console.log(china);
      for (var province of china.children) {
        console.log(province);
        var temp = {};
        temp.name = province.name;
        temp.today_confirm = province.today.confirm;
        temp.total_nowConfirm = province.total.nowConfirm;
        temp.total_confirm = province.total.confirm;
        temp.total_dead = province.total.dead;
        temp.total_heal = province.total.heal;
        temp.cities = [];

        province.children.forEach((city) => {
          var temp_city = {
            icon: "",
            name: city.name,
            today_confirm: city.today.confirm,
            total_nowConfirm: city.total.nowConfirm,
            total_confirm: city.total.confirm,
            total_dead: city.total.dead,
            total_heal: city.total.heal,
          };
          temp.cities.push(temp_city);
        });
        this.china_list.push(temp);
      }
    },
    gotoPage(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
.ps {
  height: 70vh;
}
.v-data-table,
/deep/ table,
/deep/ tr,
/deep/ td {
  font-size: large !important;
}

.v-data-table,
/deep/ table,
/deep/ tr,
/deep/ th {
  font-size: large !important;
}

.v-btn {
  text-transform: none;
}
</style>

