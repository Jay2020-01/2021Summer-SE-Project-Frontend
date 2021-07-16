<template>
  <div class="traffic">
    <!-- <h1 class="subtitle-1 grey--text">News</h1> -->
    <v-container class="my-5">
      <v-row class="mx-10">
        <v-col
          cols="12"
          md="3"
          class="px-6"
          v-for="(news, index) in news_list"
          :key="index"
        >
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              style="border-radius: 15px"
              flat
            >
              <v-img
                :src="news.img_url"
                height="150px"
                class="white--text align-end"
                @click="jumpToNews(news.sourceUrl)"
              >
                <v-card-title
                  class="text-h5 font-weight-black"
                  style="text-shadow: 1px 1px 5px #000000"
                >
                  {{ news.title }}
                </v-card-title>
              </v-img>

              <v-card-subtitle class="text-subtitle-1">
                时间：{{ news.pubDate }}
              </v-card-subtitle>

              <v-card-subtitle class="text-subtitle-1">
                来源：{{ news.infoSource }}
              </v-card-subtitle>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="orange lighten-2"
                  text
                  :class="{ 'show-btns': !hover }"
                  class="text-h6"
                  @click="news.show = !news.show"
                  right
                >
                  摘要
                </v-btn>

                <v-btn
                  icon
                  @click="news.show = !news.show"
                  :class="{ 'show-btns': !hover }"
                  class="text-subtitle-1"
                >
                  <v-icon>{{
                    news.show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="news.show">
                  <v-divider></v-divider>

                  <v-card-text class="text-subtitle-1">
                    {{ news.summary }}
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    news_list: [
      {
        pubDate: "2021年07月10日 09:00:27",
        title: "全国｜新增确诊 26 例 其中本土 7 例",
        summary:
          "7月9日0—24时，31个省（自治区、直辖市）和新疆生产建设兵团报告新增确诊病例26例，其中境外输入病例19例（上海6例，云南4例，四川3例，陕西3例，天津2例，广东1例），本土病例7例（均在云南）；无新增死亡病例；新增疑似病例2例，均为境外输入病例（均在上海）。\n当日新增治愈出院病例16例，解除医学观察的密切接触者1025人，重症病例与前一日持平。\n境外输入现有确诊病例417例（其中重症病例4例",
        infoSource: "央视新闻app",
        sourceUrl:
          "http://app.cctv.com/special/cportal/detail/arti/index.html?id=ArtisySeI6RFrx4URyBIPxV7210710&isfromapp=1",
        show: false,
        img_url: "https://picsum.photos/1920/1080?random=0",
      },
    ],
  }),
  async created() {
    await this.getNews();
  },
  methods: {
    // 给时间加前置0
    addZero(time) {
      return time < 10 ? "0" + time : time;
    },
    // 时间戳转换为时间函数
    timestampToTime(cjsj) {
      var date = new Date(cjsj); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "年";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "月";
      var D = this.addZero(date.getDate()) + "日 ";
      var h = this.addZero(date.getHours()) + ":";
      var m = this.addZero(date.getMinutes()) + ":";
      var s = this.addZero(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    getNews() {
      var url = "https://lab.isaaclin.cn/nCoV/api/news?page=1&num=20";
      axios.get(url).then((res) => {
        this.news_list = [];
        // console.log(res.data);
        var i = 0;
        for (var news of res.data.results) {
          var temp = {};
          temp.pubDate = this.timestampToTime(parseInt(news.pubDate));
          temp.title = news.title;
          temp.summary = news.summary;
          temp.infoSource = news.infoSource;
          temp.sourceUrl = news.sourceUrl;
          temp.show = false;
          temp.img_url = "https://picsum.photos/1920/1080?random=" + i++;
          // console.log(temp);
          this.news_list.push(temp);
        }
      });
    },
    jumpToNews(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.85;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>