<template>
  <div class="knowledge">
    <!-- <h1 class="subtitle-1 grey--text">Knowledge</h1> -->
    <v-container class="my-5">
      <v-row>
        <!-- 左侧普通问题区 -->
        <v-col offset="1" cols="5" style="min-height: 866px; ">
          <v-row class="mb-5">
            <v-btn large color="primary" @click="openDialog()">
              <v-icon left> mdi-pencil </v-icon>
              发布问题
            </v-btn>
          </v-row >
          <v-row style="height: 760px">
            <v-col>
          <v-row
            v-for="(item, index) in question_list"
            :key="index"
            class="my-2"
            
          >
            <v-card class="mx-auto" width="100%">
              <!-- <v-card-title>
                    <v-icon large left> mdi-twitter </v-icon>
                    <span class="text-h6 font-weight-light">Twitter</span>
                  </v-card-title> -->

              <v-card-text
                class="text-h5 font-weight-bold"
                @click="toComments(item.id)"
              >
                {{ item.title }}
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
                    <v-list-item-title>{{ item.username }}</v-list-item-title>
                  </v-list-item-content>

                  <v-row align="center" justify="end">
                    <!-- <v-icon class="mr-1"> mdi-heart </v-icon>
                        <span class="subheading mr-2">256</span>
                        <span class="mr-1">·</span>
                        <v-icon class="mr-1"> mdi-share-variant </v-icon>
                        <span class="subheading">45</span> -->
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
          </v-row>
          <!-- 底部换页区 -->
                  <v-footer padless>
      <v-card class="flex" flat tile>
        <v-card-title>
         <v-spacer></v-spacer>
          <v-btn
            class=" mr-5 text-h6 blue"
            dark
            v-if="previous != null"
            @click="getPrev()"
            >上一页
          </v-btn>
          <v-btn
            class="text-h6 blue"
            dark
            v-if="next != null"
            @click="getNext()"
            >下一页
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
    </v-footer>
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
    <!-- 弹出发布问题框 -->
    <v-dialog v-model="questionDialog" persistent max-width="600px">
      <v-tabs
        hide-slider
        v-model="tabsFlag"
        fixed-tabs
        background-color="indigo"
        dark
      >
        <v-tab> 新建问题 </v-tab>

        <v-tabs-items v-model="tabsFlag">
          <v-tab-item>
            <v-card>
              <!-- <v-card-title>
                <span class="text-h5">User Profile</span>
              </v-card-title> -->
              <v-form ref="questionForm" v-model="valid">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="questionForm.title"
                          label="问题标题*"
                          required
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="questionForm.content"
                          label="问题内容*"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions style="height: 72px">
                  <v-alert
                    v-model="alert_flag"
                    type="warning"
                    transition="scale-transition"
                    class="button"
                    outlined
                    dismissible
                    dense
                  >
                    请先登录再提问！
                  </v-alert>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" text @click="closeDialog()">
                    关闭
                  </v-btn>
                  <v-btn color="green darken-1" text @click="createQuestion()">
                    发布
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    // 每页几条问题
    questionNum: 5,
    previous: "http://10.251.254.94:8000/cherry/Question/?page=1&page_size=10",
        next: "http://10.251.254.94:8000/cherry/Question/?page=2&page_size=10",

    questionDialog: false,
    question_list: [
      
      {
        
        id: 2,
        comments: null,
        title: "请问",
        username: "wt",
        content:
          "驱蚊器恶趣味企鹅请问请问请问请问请问企鹅请问请问请问请问请问请问请问",
        ctime: "2018-09-04T07:00:00+08:00",
        uid: 2,
        overlay: false,
      },
    ],
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
    // 发布问题表单相关数据
    valid: true,
    tabsFlag: null,
    questionForm: {
      title: "",
      content: "",
    },
    alert_flag: false,
  }),
  async created() {
    await this.getQuestionList();
  },
  methods: {
    getRumourList() {
      var url =
        "https://lab.isaaclin.cn/nCoV/api/rumors?rumorType=1&page=1&num=10";
      axios.get(url).then((res) => {
        this.romour_list = res.data.results;
      });
    },
    toComments(itemId) {
      this.$router.replace("comments/" + itemId);
    },
    openDialog() {
      this.questionDialog = true;
    },
    closeDialog() {
      this.questionDialog = false;
    },
    getQuestionList() {
      var url =
        "http://10.251.254.94:8000/cherry/Question/?page=1&page_size=" + this.questionNum;
      axios.get(url).then((res) => {
        this.question_list = res.data.results;
        this.previous = res.data.previous;
        this.next = res.data.next;
        this.question_list.forEach((question) => {
          let time = question.ctime.slice(0, 16).replace("T", " ");
          question.ctime = time;
          question.overlay = false;
        });
      });
    },
    getPrev() {
            var url =
        this.previous;
      axios.get(url).then((res) => {
        this.question_list = res.data.results;
        this.previous = res.data.previous;
        this.next = res.data.next;
        this.question_list.forEach((question) => {
          let time = question.ctime.slice(0, 16).replace("T", " ");
          question.ctime = time;
          question.overlay = false;
        });
      });
    },
    getNext() {
            var url =
        this.next;
      axios.get(url).then((res) => {
        this.question_list = res.data.results;
        this.previous = res.data.previous;
        this.next = res.data.next;
        this.question_list.forEach((question) => {
          let time = question.ctime.slice(0, 16).replace("T", " ");
          question.ctime = time;
          question.overlay = false;
        });
      });
    },
    createQuestion() {
      let that = this;
      let login_flag = sessionStorage.getItem("user_log_in_flag");
      if (login_flag == "true") {
        let data = new FormData();
        var date = new Date();
        // console.log(sessionStorage);
        // data.append("username", sessionStorage.getItem("username_store"));
        data.append("title", this.questionForm.title);
        data.append("content", this.questionForm.content);
        data.append("ctime", date.toISOString());
        data.append("uid", sessionStorage.getItem("uid_store"));
        let url = "http://10.251.254.94:8000/cherry/Question/";
        axios.post(url, data).then(function (response) {
          // console.log("发送问题成功！");
          that.$refs.questionForm.reset();
          that.closeDialog();
          that.getQuestionList();
        });
      } else {
        this.alert_flag = true;
      }
    },
    // 判断是否显示删除按钮
    showDeleteBtn(id) {
      // console.log(sessionStorage);
      if (id == sessionStorage.getItem("uid_store")) return true;
      else return false;
    },
    changeOverlay(item) {
      console.log(item.overlay);
      item.overlay = !item.overlay;
      this.$forceUpdate();
    },
    async deleteConfirm(item) {
      item.overlay = false;
      var qid = item.id;
      await axios.delete(`http://10.251.254.94:8000/cherry/Question/${qid}/`);
      this.getQuestionList();
      this.$forceUpdate();
    },
  },
};
</script>
<style scoped>
</style>