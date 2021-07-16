<template>
  <v-row justify="center">
    <v-alert :value="alert" color="red" type="error"></v-alert>
    <v-dialog v-model="signInDialog" persistent max-width="600px">
      <v-tabs v-model="tabsFlag" fixed-tabs background-color="indigo" dark>
        <v-tab> 登录 </v-tab>
        <v-tab> 注册 </v-tab>

        <v-tabs-items v-model="tabsFlag">
          <v-tab-item>
            <v-card>
              <v-form ref="signInForm" v-model="valid">
                <!-- <v-card-title>
                <span class="text-h5">User Profile</span>
              </v-card-title> -->
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="signInForm.username"
                          label="用户名*"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="signInForm.password"
                          label="密码*"
                          type="password"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <span ref="showErrMes"></span>
                  <br />
                  <small>*为必填项</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" text @click="close()">
                    关闭
                  </v-btn>
                  <v-btn color="green darken-1" text @click="signIn()">
                    登录
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card>
              <!-- <v-card-title>
                <span class="text-h5">User Profile</span>
              </v-card-title> -->
              <v-form ref="signUpForm" v-model="valid">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="signUpForm.username"
                          :rules="nameRules"
                          label="用户名*"
                          required
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="signUpForm.password"
                          :rules="passwordRules"
                          label="密码*"
                          type="password"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="signUpForm.confirmedPassword"
                          :rules="confirmedPasswordRules"
                          label="确认密码*"
                          type="password"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <span ref="showErrMes2"></span>
                  <br />
                  <small>*为必填项</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-1" text @click="close()">
                    关闭
                  </v-btn>
                  <v-btn color="green darken-1" text @click="signUp()">
                    注册
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  props: ["signInDialog"],
  data: () => ({
    // snackbar: false,
    alert: false,
    valid: true,
    tabsFlag: null,
    signInForm: {
      username: "",
      password: "",
    },
    signUpForm: {
      username: "",
      password: "",
      confirmedPassword: "",
    },
    nameRules: [(v) => !!v || "用户名为必填项"],
    passwordRules: [(v) => !!v || "密码为必填项"],
    confirmedPasswordRules: [(v) => !!v || "确认密码为必填项"],
  }),
  methods: {
    signIn() {
      let that = this;
      // console.log("sign in begin!");
      let errorMessageOfSignIn = ["", ""];
      let usernameOK = this.usernamePatternVerification(
        this.signInForm.username,
        errorMessageOfSignIn
      );
      let passwordOk = this.passwordPatternVerification(
        this.signInForm.password,
        this.signInForm.password,
        errorMessageOfSignIn
      );
      if (usernameOK && passwordOk) {
        //登录数据格式正确行为（还没写）
        //---code waiting（发给后端账号密码）---//
        let data = new FormData();
        data.append("username", this.signInForm.username);
        data.append("password", this.signInForm.password);
        let url = "http://10.251.254.94:8000/cherry/login/";
        axios.post(url, data).then(function (response) {
          if (response.data.flag == true) {
            that.$emit("inSnackFlag", true);

            // console.log("sign in success!");
            //用户信息存储在storage中
            // console.log(data.get("username"));

            sessionStorage.setItem("username_store", data.get("username"));
            sessionStorage.setItem("password_store", data.get("password"));
            sessionStorage.setItem("user_log_in_flag", true);

            // console.log(
            //   'In signIn sessionStorage.getItem("username_store"):' +
            //     sessionStorage.getItem("username_store")
            // );

            that.updateUserInfo(data.get("username"));
            that.$refs.signInForm.reset();

            //for debug
            // console.log(
            //   "after sign in-username_store:" +
            //     sessionStorage.getItem("username_store")
            // );
            // console.log(
            //   "after sign in-password_store:" +
            //     sessionStorage.getItem("password_store")
            // );
            // console.log(
            //   "after sign in-email_store:" +
            //     sessionStorage.getItem("email_store")
            // );
            // console.log(
            //   "after sign in-phoneNumber_store:" +
            //     sessionStorage.getItem("phoneNumber_store")
            // );
            // console.log(
            //   "after sign in-uid_store:" + sessionStorage.getItem("uid_store")
            // );
            //关闭窗口
            that.close();
          } else {
            //如果登录失败，status中是错误信息

            that.$emit("inSnackFlagError", true, "用户密码错误");
            // console.log("axios error!");
            // console.log(response);
          }
        });

        //---code waiting（发给后端账号密码）---//
      } else {
        //登录数据格式错误行为
        //for debug//
        // console.log(
        //   "sign in fail:username-" +
        //     errorMessageOfSignIn[0] +
        //     "password-" +
        //     errorMessageOfSignIn[1]
        // );
        that.$emit("inSnackFlagError", true, "格式错误");
        // console.log(errorMessageOfSignIn);
        //error message display
        if (errorMessageOfSignIn[0] != "") {
          this.$refs.showErrMes.innerHTML =
            "<b style='color:red'>" + errorMessageOfSignIn[0] + "</b>";
        } else {
          this.$refs.showErrMes.innerHTML = errorMessageOfSignIn[1];
        }
      }
    },
    signUp() {
      let that = this;
      // console.log("sign up begin!");
      let errorMessage = ["", ""];
      let usernameOK = this.usernamePatternVerification(
        this.signUpForm.username,
        errorMessage
      );
      let passwordOk = this.passwordPatternVerification(
        this.signUpForm.password,
        this.signUpForm.confirmedPassword,
        errorMessage
      );
      if (usernameOK && passwordOk) {
        //注册数据格式正确行为（还没写）
        //---code waiting(向后端发送注册信息)---//
        let data = new FormData();
        data.append("username", this.signUpForm.username);
        data.append("password", this.signUpForm.password);
        let url = "http://10.251.254.94:8000/cherry/sign_up/";
        axios.post(url, data).then(async function (response) {
          //还要判断重名与否的返回值
          if (response.data.flag == true) {
            that.$emit("upSnackFlag", true);

            that.signInForm.username = that.signUpForm.username;
            that.signInForm.password = that.signUpForm.password;

            await that.signIn();

            that.$refs.signInForm.reset();
            that.$refs.signUpForm.reset();

            console.log("sign up success!");
            that.close();
          } else {
            that.$emit("upSnackFlagError", true, response.data.state.slice(5));
            // console.log("axios error!");
            console.log(response);
            errorMessage[0] = "注册失败:" + response.data.state;
          }
        });

        //---code waiting(向后端发送注册信息)---//
      } else {
        //注册数据格式错误行为（还没写）
        //for debug
        let snackMsg = "";
        snackMsg = errorMessage[0];
        // console.log(errorMessage);
        if (snackMsg == "") {
          snackMsg = errorMessage[1];
        }
        that.$emit("upSnackFlagError", true, snackMsg);
        // console.log(
        //   "sign up fail:username-" +
        //     errorMessage[0] +
        //     "password-" +
        //     errorMessage[1]
        // );
        //error message display
        if (errorMessage[0] != "") {
          this.$refs.showErrMes2.innerHTML =
            "<b style='color:red'>" + errorMessage[0] + "</b>";
        } else {
          this.$refs.showErrMes2.innerHTML = errorMessage[1];
        }
      }
    },
    close() {
      this.signInDialog = false;
      this.$emit("dialogFlag", false);
    },
    usernamePatternVerification(name, errorMessage) {
      //4-20个字母、数字或下划线组成
      let usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;

      if (name.length == 0) {
        //for debug
        console.log("sign in error: name length = 0");
        errorMessage[0] = "请输入昵称";
        return false;
      }

      if (usernamePattern.test(name) == false) {
        if (name.length > 20) {
          errorMessage[0] = "用户名长度应当短于21个字符";
        } else if (name.length < 4) {
          errorMessage[0] = "用户名应当多于3个字符";
        } else {
          errorMessage[0] = "用户名仅可由字母、数字和下划线组成";
        }
        console.log("username_pattern error:" + errorMessage[0]);
        return false;
      }
      console.log("username_pattern  pass!");
      return true;
    },
    passwordPatternVerification(password1, password2, errorMessage) {
      //密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
      let password_pattern = /^\w{6,18}$/;
      //验证两次输入的密码是否一致
      if (password1 != password2) {
        console.log("two password are not same");
        errorMessage[1] = "两次输入的密码不一致";
        return false;
      } else if (password_pattern.test(password1) == false) {
        //查看模式不匹配原因
        if (password1.length < 6 || password1.length == 0) {
          errorMessage[1] = "密码长度不能短于6";
        } else if (password1.length > 18) {
          errorMessage[1] = "密码长度不能超过18";
        } else {
          errorMessage[1] = "只能含有字母、数字、下划线";
        }
        console.log("password_pattern error");
        return false;
      } else {
        console.log("password_pattern pass!");
        return true;
      }
    },
    updateUserInfo(username) {
      //---code waiting（发给后端用户名）---//
      let url =
        "http://10.251.254.94:8000/cherry/show_message/" + username + "/";
      axios.get(url).then(function (response) {
        //如果登录失败，status中是错误信息
        if (response.data.flag == true) {
          console.log("updateUserInfo success!");
          console.log(
            "updateUserInfo response.data.user.email:" +
              response.data.user.email
          );
          console.log(
            "updateUserInfo response.data.user.phone_number:" +
              response.data.user.phone_number
          );
          console.log(
            "updateUserInfo response.data.user.id:" + response.data.user.id
          );
          sessionStorage.setItem("email_store", response.data.user.email);
          sessionStorage.setItem(
            "phoneNumber_store",
            response.data.user.phone_number
          );
          sessionStorage.setItem("uid_store", response.data.user.id);
        } else {
          console.log("updateUserInfo fail!");
        }
      });

      //---code waiting（发给后端用户名）---//
    },
    signOut() {
      console.log("emit");
      this.$emit("outSnackFlag", true);
      sessionStorage.setItem("username_store", null);
      sessionStorage.setItem("password_store", null);
      sessionStorage.setItem("email_store", null);
      sessionStorage.setItem("phoneNumber_store", null);
      console.log("after sign out");
      console.log(
        "sessionStorage username_store:" +
          sessionStorage.getItem("username_store")
      );
      console.log(
        "sessionStorage password_store:" +
          sessionStorage.getItem("password_store")
      );
      console.log(
        "sessionStorage email_store:" + sessionStorage.getItem("email_store")
      );
      console.log(
        "sessionStorage phoneNumber_store:" +
          sessionStorage.getItem("phoneNumber_store")
      );
    },
  },
};
</script>
