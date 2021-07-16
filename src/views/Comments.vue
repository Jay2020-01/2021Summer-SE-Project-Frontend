<template>
  <div class="knowledge">
    <!-- <h1 class="subtitle-1 grey--text">Knowledge</h1> -->
    <v-container class="my-5">
      <v-row>
        <v-col cols="1">
          <!-- 返回按钮行 -->
          <v-row class="my-2">
            <v-btn class="ma-1" dark absolute fab color="primary" @click="gotoQuestionList()">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            
          </v-row>
        </v-col>
        <!-- 左侧普通问题区 -->
        <v-col offset="0" cols="5">
          <!-- 返回按钮行 -->
          <!-- <v-row class="mb-3">
            <v-btn class="ma-2" outlined small fab color="primary">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            
          </v-row> -->
          <!-- 问题行 -->
          <v-row class="my-2">
            <v-card class="mx-auto" width="100%">
              <!-- <v-card-title>
                    <v-icon large left> mdi-twitter </v-icon>
                    <span class="text-h6 font-weight-light">Twitter</span>
                  </v-card-title> -->

              <v-card-text class="text-h5 font-weight-bold">
                {{ question.title }}
              </v-card-text>
              <v-card-text class="text-h5 font-weight-bold">
                {{ question.content }}
              </v-card-text>

              <v-card-actions>
                <v-list-item class="grow">
                  <v-list-item-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                      alt=""
                      src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{
                      question.username
                    }}</v-list-item-title>
                  </v-list-item-content>

                  <v-row align="center" justify="end">
                    <!-- <v-icon class="mr-1"> mdi-heart </v-icon>
                        <span class="subheading mr-2">256</span>
                        <span class="mr-1">·</span>
                        <v-icon class="mr-1"> mdi-share-variant </v-icon>
                        <span class="subheading">45</span> -->
                    <v-icon class="mr-1"> mdi-clock </v-icon>
                    <span class="subheading">{{ question.ctime }}</span>
                  </v-row>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-row>

          <!-- 发布回答行 -->
          <v-row>
            <v-textarea
              outlined
              rows="2"
              auto-grow
              v-model="content"
              row-height="50px"
              class="text-h6"
              name="input-7-4"
              label="输入回答"
            ></v-textarea>
          </v-row>

          <!-- 发送按钮行 -->
          <v-row class="mb-4" style="height: 48px">
            <v-alert
              v-model="alert_flag"
              type="warning"
              transition="scale-transition"
              outlined
              dismissible
              dense
            >
              请先登录再发帖！
            </v-alert>
            <v-spacer> </v-spacer>
            <v-btn large color="primary" @click="createComment()">
              <v-icon left> mdi-pencil </v-icon>
              发送回答
            </v-btn>
          </v-row>

          <!-- 回答行 -->
          <v-row>
            <span class="my-5 text-h4 font-weight-bold"> 全部回答 </span>
          </v-row>
          <v-row
            v-for="(item, index) in question.comments"
            :key="index"
            class="my-2"
          >
            <v-card
              class="mx-auto"
              width="100%"
              :color="item.flag ? 'red' : 'White'"
              :dark="item.flag"
            >
              <!-- <v-card-title>
                    <v-icon large left> mdi-twitter </v-icon>
                    <span class="text-h6 font-weight-light">Twitter</span>
                  </v-card-title> -->
              <v-card-text class="text-h5 font-weight-bold">
                {{ item.content }}
              </v-card-text>

              <v-card-actions>
                <v-list-item class="grow">
                  <v-list-item-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                      alt=""
                      src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      >{{ item.username }}
                      <span v-if="item.flag"
                        >（权威用户）</span
                      ></v-list-item-title
                    >
                  </v-list-item-content>

                  <v-row align="center" justify="end">
                    <!-- <v-icon class="mr-1"> mdi-heart </v-icon>
                        <span class="subheading mr-2">256</span>
                        <span class="mr-1">·</span>
                        <v-icon class="mr-1"> mdi-share-variant </v-icon>
                        <span class="subheading">45</span> -->
                    <!-- <v-btn
                      depressed
                      color="error"
                      class="mr-3"
                      v-if="showDeleteBtn(item.uid)"
                      @click="item.overlay = !item.overlay"
                    > -->
                    <v-btn
                      depressed
                      color="error"
                      class="mr-3"
                      v-if="showDeleteBtn(item.uid)"
                      @click="changeOverlay(item)"
                    >
                      删除
                    </v-btn>
                    <v-icon class="mr-1"> mdi-clock </v-icon>
                    <span class="subheading">{{ item.ctime }}</span>
                  </v-row>
                </v-list-item>
              </v-card-actions>
              <v-overlay :absolute="true" :opacity="0.8" :value="item.overlay">
                <!-- <v-btn color="error" @click="item.overlay = false"> -->
                <v-btn color="error" @click="deleteConfirm(item)">
                  确认删除
                </v-btn>
              </v-overlay>
            </v-card>
          </v-row>
        </v-col>

        <!-- 右侧疫情谣言区 -->
        <v-col offset="1" cols="4">
          <!-- 疫情谣言轮播 -->
          <v-row>
            <v-carousel
              cycle
              show-arrows-on-hover
              hide-delimiter-background
              height="400px"
            >
              <v-carousel-item
                v-for="(item, i) in romour_list"
                :key="i"
                :src="item.src"
                reverse-transition="fade-transition"
                transition="fade-transition"
                class="pa-4"
              >
                <v-card class="" width="100%" height="100%" color="blue" dark>
                  <v-card-title>
                    <v-icon large left> mdi-twitter </v-icon>
                    <span class="text-h6 font-weight-bold">谣言</span>
                  </v-card-title>

                  <v-card-text class="text-h5 font-weight-bold">
                    {{ item.title }}
                  </v-card-text>

                  <v-card class="mx-5" light flat>
                    <v-card-text class="text-h5 font-weight-bold">
                      {{ item.mainSummary }}
                    </v-card-text>
                  </v-card>

                  <v-card-actions>
                    <v-list-item class="grow">
                      <v-spacer> </v-spacer>

                      <v-row align="center" justify="end" class="ma-4">
                        <v-list-item-avatar color="grey darken-3" size="30">
                          <v-img
                            class="elevation-6"
                            alt=""
                            src="../assets/dingxianglogo.jpeg"
                          ></v-img>
                        </v-list-item-avatar>
                        <span class="text-h6 font-weight-bold"
                          >丁香园·丁香医生</span
                        >
                      </v-row>

                      <!-- <v-row align="center" justify="end">
                        <v-icon class="mr-1"> mdi-heart </v-icon>
                        <span class="subheading mr-2">256</span>
                        <span class="mr-1">·</span>
                        <v-icon class="mr-1"> mdi-share-variant </v-icon>
                        <span class="subheading">45</span>
                        <v-icon class="mr-1"> mdi-clock-outline </v-icon>
                        <span class="subheading">{{ item.ctime }}</span>
                      </v-row> -->
                    </v-list-item>
                  </v-card-actions>
                </v-card>
              </v-carousel-item>
            </v-carousel>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    question: {
      id: 2,
      comments: [
        // {
        //   id: 9,
        //   username: "wt",
        //   content: "这是个谣言！这是个谣言！这是个谣言！这是个谣言！",
        //   flag: true,
        //   ctime: "2018-09-04T07:00:00+08:00",
        //   qid: 2,
        //   uid: 9,
        //   overlay: false,
        // },
      ],
      title: "请问",
      content:
        "驱蚊器恶趣味企鹅请问请问请问请问请问企鹅请问请问请问请问请问请问请问",
      ctime: "2018-09-04T07:00:00+08:00",
      uid: 2,
    },
    romour_list: [
      {
        title: "中国企业造得出疫苗却造不出疫苗瓶？",
        mainSummary:
          "2017 年前，我国还无法实现疫苗瓶的量产，但如今已成功突破这项技术瓶颈。",
      },
      {
        title: "注射了新冠疫苗不用戴口罩？",
        mainSummary: "钟南山表示，答案是否定的。",
      },
      {
        title: "感染新冠病毒可以治癌症？",
        mainSummary: "面对新冠病毒，癌症患者更加需要注意。",
      },
      {
        title: "多喝茶可以清除新冠病毒？",
        mainSummary: "目前尚无证据证明喝茶可以预防新冠病毒。",
      },
      {
        title: "憋气 20 秒可以检测肺部是否健康？",
        mainSummary:
          "人憋气时间的长短只是粗略反映人体对于缺氧和高二氧化碳耐受的程度。",
      },
      {
        title: "病毒会在咽喉滞留 4 天，还能补救？",
        mainSummary: "这种说法目前尚无研究数据支撑。",
      },
      {
        title: "桑拿、汗蒸能预防新冠病毒？",
        mainSummary: "很遗憾，无法杀死病毒。",
      },
      {
        title: "上海 27 日起对入沪车辆逢车必检？",
        mainSummary: "系去年旧闻！",
      },
      {
        title: "江苏一超市柜台商品及人员涉疫？",
        mainSummary: "如东县疾控中心紧急辟谣。",
      },
      {
        title: "进口的冷链食品不能买了？",
        mainSummary: "张文宏说买进口商品被感染概率低于空难。",
      },
    ],
    content: "",
    alert_flag: false,
  }),
  async created() {
    await this.getComments();
  },
  methods: {
    getRumourList() {
      var url =
        "https://lab.isaaclin.cn/nCoV/api/rumors?rumorType=1&page=1&num=10";
      axios.get(url).then((res) => {
        this.romour_list = res.data.results;
      });
    },
    // 判断是否显示删除按钮
    showDeleteBtn(id) {
      // console.log(sessionStorage);
      if (id == sessionStorage.getItem("uid_store")) return true;
      else return false;
    },
    getComments() {
      var qid = parseInt(this.$route.params.CID);
      var url = `http://10.251.254.94:8000/cherry/Question/${qid}/`;
      axios.get(url).then((res) => {
        // console.log(res.data);
        this.question = res.data;
        for (var comment of this.question.comments) {
          comment.overlay = false;
        }
        console.log(this.question);
        let time = this.question.ctime.slice(0, 16).replace("T", " ");
        // console.log(time);
        this.question.ctime = time;
        this.question.comments.forEach((comment) => {
          comment.overlay = false;
          let time = comment.ctime.slice(0, 16).replace("T", " ");
          comment.ctime = time;
        });
        // console.log(this.question.comments);
      });
    },
    createComment() {
      let that = this;
      let login_flag = sessionStorage.getItem("user_log_in_flag");
      if (login_flag == "true") {
        var data = new FormData();
        // data.append("username", sessionStorage.getItem("username_store"));
        data.append("content", this.content);
        var date = new Date();
        data.append("ctime", date.toISOString());
        data.append("qid", this.$route.params.CID);
        data.append("uid", sessionStorage.getItem("uid_store"));

        // console.log(data);
        axios
          .post("http://10.251.254.94:8000/cherry/Comment/", data)
          .then((res) => {
            console.log(res);
            this.content = "";
            that.getComments();
          });
      } else {
        this.alert_flag = true;
      }
    },
    changeOverlay(item) {
      console.log(item.overlay);
      item.overlay = !item.overlay;
      this.$forceUpdate();
    },
    async deleteConfirm(item) {
      item.overlay = false;
      var cid = item.id;
      await axios.delete(`http://10.251.254.94:8000/cherry/Comment/${cid}/`);
      this.getComments();
      this.$forceUpdate();
    },
    gotoQuestionList() {
      this.$router.push("/knowledge");
    }
  },
};
</script>
