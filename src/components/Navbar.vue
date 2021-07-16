<template>
  <div>
    <nav>
      <!-- <v-app-bar flat app>
        <v-app-bar-nav-icon
          class="grey--text"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title class="text-uppercase grey--text">
          <span class="font-weight-light">Cherry</span>
          <span>Data</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text color="grey" @click="changeTheme()">
          <v-icon v-if="lightTheme">mdi-white-balance-sunny</v-icon>
          <v-icon v-else>mdi-moon-waxing-crescent</v-icon>
        </v-btn>
        <div v-if="isLogin">
          <v-btn text color="grey" @click="signOut">
            <span>Sign Out</span>
            <v-icon right>mdi-logout</v-icon>
          </v-btn>
        </div>
        <div v-else>
          <v-btn text color="grey" @click="signIn">
            <span>Sign In</span>
            <v-icon right>mdi-login</v-icon>
          </v-btn>
        </div>
      </v-app-bar> -->

      <v-app-bar
        app
        flat
        elevate-on-scroll
        scroll-target="#scrolling-techniques-7"
        src="https://picsum.photos/1920/1080?random"
      >
        <template v-slot:img="{ props }">
          <v-img style="filter: brightness(55%)" v-bind="props"></v-img>
        </template>
        <!-- <v-app-bar-nav-icon
          @click="drawer = !drawer"
          class="white--text"
        ></v-app-bar-nav-icon> -->
          <v-icon dark class="mx-3"> mdi-fruit-cherries </v-icon>

        <v-toolbar-title class="white--text mr-10"
          ><span class="font-weight-light">Cherry</span>
          <span>Data</span></v-toolbar-title
        >
        <!-- 切换页面按钮 -->
        <v-btn
          class="mx-1 white--text text-subtitle-1"
          text
          value="left"
          @click="gotoPage(link.route)"
          v-for="(link, i) in links"
          :key="i"
        >
          <v-icon left>{{ link.icon }}</v-icon>
          <span class="">{{ link.text }}</span>
        </v-btn>

        <v-spacer></v-spacer>

        <!-- <div class="text-center ma-2">
          <v-btn dark @click="outSnackbar = true"> Open Snackbar </v-btn>
        </div> -->

        <!-- <v-btn text color="white" @click="changeTheme()">
          <v-icon v-if="lightTheme">mdi-white-balance-sunny</v-icon>
          <v-icon v-else>mdi-moon-waxing-crescent</v-icon>
        </v-btn> -->
        <div v-if="isLogin">
          <v-menu rounded offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-account-circle-outline</v-icon>
              </v-btn>
            </template>

            <v-list rounded dense>
              <v-list-item @click="toProfile()">
                <v-list-item-icon>
                  <v-icon right>mdi-card-account-details-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content> 个人信息 </v-list-item-content>
              </v-list-item>

              <v-list-item @click="signOut()">
                <v-list-item-icon>
                  <v-icon right>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content> 登出 </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <v-btn text color="white" @click="signOut">
            <span>Sign Out</span>
            <v-icon right>mdi-logout</v-icon>
          </v-btn> -->
        </div>
        <div v-else>
          <v-btn text color="white" @click="signIn">
            <span>登录</span>
            <v-icon right>mdi-login</v-icon>
          </v-btn>
        </div>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        app
        class="black"
        :dark="false"
        src="../assets/sidebar_img1.jpg"
        temporary
      >
        <v-list>
          <v-list-item class="my-3">
            <v-list-item-icon>
              <v-icon class="pink--text text--lighten-1 text-h5"
                >mdi-fruit-cherries</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content class="pink--text text--lighten-1 text-h5">
              <v-list-item-title class="text-h6">樱桃疫情</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider class="grey" />

        <v-list nav>
          <v-list-item
            v-for="(link, i) in links"
            :key="i"
            router
            :to="link.route"
            class="my-3"
          >
            <v-list-item-icon>
              <v-icon class="white--text">{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="white--text">
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </nav>

    <SignInDialog
      @dialogFlag="getDialogFlag"
      @outSnackFlag="getOutSnackFlag"
      @inSnackFlag="getInSnackFlag"
      @inSnackFlagError="getInSnackFlagError"
      @upSnackFlag="getUpSnackFlag"
      @upSnackFlagError="getUpSnackFlagError"
      v-bind:signInDialog="signInDialog"
    ></SignInDialog>

    <v-snackbar
      outlined
      rounded
      right
      color="success"
      timeout="800"
      v-model="inSnackbarSuccess"
    >
      登录成功
      <template v-slot:action="{ attrs }">
        <v-btn
          color="grey"
          text
          v-bind="attrs"
          @click="inSnackbarSuccess = false"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      outlined
      rounded
      right
      color="warning"
      timeout="800"
      v-model="inSnackbarError"
    >
      登录失败：{{ inErrorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="grey"
          text
          v-bind="attrs"
          @click="inSnackbarError = false"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      outlined
      rounded
      right
      color="success"
      timeout="800"
      v-model="upSnackbarSuccess"
    >
      注册成功
      <template v-slot:action="{ attrs }">
        <v-btn
          color="grey"
          text
          v-bind="attrs"
          @click="upSnackbarSuccess = false"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      outlined
      rounded
      right
      color="warning"
      timeout="800"
      v-model="upSnackbarError"
    >
      注册失败：{{ upErrorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="grey"
          text
          v-bind="attrs"
          @click="upSnackbarError = false"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      outlined
      rounded
      right
      color="success"
      timeout="800"
      v-model="outSnackbar"
    >
      登出成功
      <template v-slot:action="{ attrs }">
        <v-btn color="grey" text v-bind="attrs" @click="outSnackbar = false">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import SignInDialog from "./SignIn.vue";

export default {
  components: { SignInDialog },

  data() {
    return {
      inErrorMessage: "",
      upErrorMessage: "",
      inSnackbarError: false,
      inSnackbarSuccess: false,
      upSnackbarError: false,
      upSnackbarSuccess: false,
      outSnackbar: false,
      drawer: false,
      mini: true,
      lightTheme: true,
      isLogin:
        sessionStorage.getItem("user_log_in_flag") == "true" ? true : false, //false,
      signInDialog: false,
      links: [
        { icon: "mdi-chart-box-outline", text: "中国疫情", route: "/china" },
        { icon: "mdi-earth", text: "世界疫情", route: "/world" },
        { icon: "mdi-history", text: "历史数据", route: "/history" },
        // { icon: "mdi-airplane-takeoff", text: "出行预警", route: "/traffic" },
        {
          icon: "mdi-newspaper-variant-multiple-outline",
          text: "疫情新闻",
          route: "/news",
        },
        {
          icon: "mdi-book-open-page-variant-outline",
          text: "防控知识",
          route: "/knowledge",
        },
      ],
    };
  },
  methods: {
    getOutSnackFlag(flag) {
      this.outSnackbar = flag;
    },
    getInSnackFlag(flag) {
      this.inSnackbarSuccess = flag;
    },
    getInSnackFlagError(flag, msg) {
      this.inSnackbarError = flag;
      this.inErrorMessage = msg;
    },
    getUpSnackFlag(flag) {
      this.upSnackbarSuccess = flag;
    },
    getUpSnackFlagError(flag, msg) {
      this.upSnackbarError = flag;
      this.upErrorMessage = msg;
    },
    getDialogFlag(flag) {
      this.signInDialog = flag;
      console.log(
        "getDialogFlag isLogin begin:" +
          this.isLogin +
          "  " +
          typeof this.isLogin
      );
      // this.isLogin = sessionStorage.getItem("user_log_in_flag");
      let tmp = sessionStorage.getItem("user_log_in_flag");
      this.isLogin = tmp === "false" ? false : true;

      console.log(
        'In getDialogFlag sessionStorage.getItem("user_log_in_flag"):' +
          sessionStorage.getItem("user_log_in_flag") +
          "  " +
          typeof sessionStorage.getItem("user_log_in_flag")
      );
      // console.log('getDialogFlag signInDialog:'+this.signInDialog);
      console.log(
        "getDialogFlag isLogin end:" + this.isLogin + "  " + typeof this.isLogin
      );
    },
    signIn() {
      //this.isLogin = true;
      this.signInDialog = true;
    },
    signOut() {
      this.isLogin = false;
      this.signInDialog = false;
      this.outSnackbar = true;
      sessionStorage.setItem("user_log_in_flag", false);
      this.$router.replace("china");
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.lightTheme = !this.lightTheme;
    },
    gotoPage(link) {
      this.$router.replace(link);
    },
    toProfile() {
      this.$router.push("/profile");
    },
  },
};
</script>