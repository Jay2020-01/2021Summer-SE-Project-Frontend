<template>
  <div class="knowledge">
    <v-container class="my-5">
      <!-- code begin -->
      <v-card class="mx-auto" max-width="344">
        <v-card-subtitle>个人信息</v-card-subtitle>
        <v-card-text>
          <!-- <p class="text-h4 text--primary">个人信息</p> -->
          <div>
            <v-list flat>
              <!-- <v-subheader>个人信息</v-subheader> -->
              <v-list-item-group  color="primary">
                <v-list-item v-for="(item, i) in items" :key="i" @click='show_password(i)'>
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>

          <!-- <p>adjective</p>
          <div class="text--primary">
            relating to or dependent on charity; charitable.<br />
            "an eleemosynary educational institution."
          </div> -->
        </v-card-text>
        <v-card-actions>
          <v-btn text color="teal accent-4" @click="reveal = true">
            修改信息
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <v-card
            v-if="reveal"
            class="transition-fast-in-fast-out v-card--reveal"
            style="height: 100%"
          >
            <!-- <v-card-subtitle>修改信息</v-card-subtitle> -->
            <v-card-text class="pb-0">
              <!-- <p class="text-h4 text--primary">Origin</p>
              <p>
                late 16th century (as a noun denoting a place where alms were
                distributed): from medieval Latin eleemosynarius, from late
                Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’
              </p> -->
              <!-- code begin -->
              <v-form v-model="valid">
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model.lazy="username"
                      :rules="usernameRules"
                      :counter="18"
                      label="用户名"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model.lazy="password"
                      :rules="passwordRules"
                      :counter="18"
                      label="密码"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model.lazy="phoneNumber"
                      :rules="phoneNumberRules"
                      :counter="11"
                      label="手机号码"
                    ></v-text-field>

                    <v-text-field
                      v-model.lazy="email"
                      :rules="emailRules"
                      label="E-mail"
                      required
                    ></v-text-field>
                  </v-row>
                </v-container>
              </v-form>
              <!-- code end -->
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn text color="teal accent-4" @click="reveal = false">
                取消
              </v-btn>
              <v-btn
                text
                color="teal accent-4"
                @click="changeUserInfo"
                ref="changeInfoButton"
              >
                确认
              </v-btn>
              <!-- <v-btn text color="teal accent-4" @click="debug">
                debug
              </v-btn> -->

              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-card>
      <!-- code end -->
      <div style="height: 100px"></div>
      <v-card class="mx-auto" max-width="344">
        <v-card-subtitle>问题列表</v-card-subtitle>
        <!-- code 2 begin -->
        <v-card-text>
          <div>
            <v-list flat>
              <v-list-item-group  color="primary">
                <v-list-item
                  v-for="(item, i) in user_question_receive"
                  :key="i"
                >
                  <!-- <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon> -->
                  <v-list-item-content >
                    <v-list-item-title v-text="item.title" @click="goto_ques(item)"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.ctime.substr(0, 10)"
                      
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-btn text color="teal accent-4" @click='delete_question(item.id,i)'>
                    删除
                  </v-btn>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card-text>
        <!-- code 2 end -->
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    reveal: false,
    valid: false,
    pass_flag: false,
    user_question_receive: ["iii"],
    username: "" + sessionStorage.getItem("username_store"),
    password: "" + sessionStorage.getItem("password_store"),
    usernameRules: [
      (v) => !!v || "请填写用户名",
      (v) => v.length <= 20 || "用户名不能超过20个字母",
      (v) => v.length >= 4 || "用户名不能少于4个字母",
      (v) =>
        /^[a-zA-Z0-9_]{4,20}$/.test(v) ||
        "用户名只能包含英文字母、数字、下划线",
    ],
    email: "" + sessionStorage.getItem("email_store"),
    emailRules: [
      (v) => !!v || "请填写邮箱",
      (v) =>
        /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v) ||
        "请输入合法邮件地址",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "请填写密码",
      (v) => v.length <= 18 || "密码不能超过18个字母",
      (v) => v.length >= 6 || "密码不能少于6个字母",
      (v) => /^\w{6,18}$/.test(v) || "密码只能包含字母、数字和下划线",
    ],
    phoneNumber: "" + sessionStorage.getItem("phoneNumber_store"),
    phoneNumberRules: [
      (v) => !!v || "请填写手机号码",
      (v) => /^[0-9]{11}$/.test(v) || "请输入合法手机号",
    ],
    items: [
      {
        text: "用户名:" + sessionStorage.getItem("username_store"),
        icon: "mdi-account",
      },
      {
        text: "密码:" + ' ******',//sessionStorage.getItem("password_store")
        icon: "mdi-lock",
      },
      {
        text: "邮箱:" + sessionStorage.getItem("email_store"),
        icon: "mdi-email",
      },
      {
        text: "手机号码:" + sessionStorage.getItem("phoneNumber_store"),
        icon: "mdi-dialpad",
      },
    ],
  }),
  methods: {
    show_password(i){
      if(i==1){
        this.pass_flag = !this.pass_flag;
        if(this.pass_flag==1){
          this.items[1].text="密码:" + sessionStorage.getItem("password_store");
          console.log('明文');
        }else {
          this.items[1].text="密码:" + ' ******';
          console.log('密文');
        }
        
      }
    },
    goto_ques(item){
this.$router.replace("comments/" + item.id);
    },
    delete_question(qid,i){
      let that= this;
      console.log('delete begin');
      let url = "http://10.251.254.94:8000/cherry/Question/"+qid+"/";
      axios.delete(url).then(function (response){
        that.get_user_question();
        console.log('delete end');
      })
    },
    changeUserInfo() {
      let that = this;
      //发送更改信息请求
      let data = new FormData();
      data.append("username", this.username);
      data.append("old_password", sessionStorage.getItem("password_store")); //sessionStorage.getItem('password')
      data.append("new_password", this.password);
      data.append("new_email", this.email);
      data.append("new_phone_number", this.phoneNumber);
      console.log(data);
      let url = "http://10.251.254.94:8000/cherry/set_message/";
      axios.post(url, data).then(function (response) {
        if (response.data.flag == true) {
          console.log("axios:change user info success!");
          //若信息修改成功，更新本地存储信息
          sessionStorage.setItem("username_store", that.username);
          sessionStorage.setItem("password_store", that.password);
          sessionStorage.setItem("email_store", that.email);
          sessionStorage.setItem("phoneNumber_store", that.phoneNumber);

          that.items[0].text =
            "用户名:" + sessionStorage.getItem("username_store");
          that.items[1].text =
            "密码:" + sessionStorage.getItem("password_store");
          that.items[2].text = "邮箱:" + sessionStorage.getItem("email_store");
          that.items[3].text =
            "手机号码:" + sessionStorage.getItem("phoneNumber_store");
          //for debug begin
          console.log("after change user info");
          console.log(
            "username_store:" + sessionStorage.getItem("username_store")
          );
          console.log(
            "password_store:" + sessionStorage.getItem("password_store")
          );
          console.log("email_store:" + sessionStorage.getItem("email_store"));
          console.log(
            "phoneNumber_store:" + sessionStorage.getItem("phoneNumber_store")
          );
          //for debug end
          that.reveal = false;
        } else {
          console.log("error:axios change user info fail!");
          that.$refs.changeInfoButton.innerHTML = "重试";
        }
      });
    },
    // debug(){
    //   this.items[0].text='lalalalal';
    //   this.reveal= false;

    // },
    get_user_question() {
      let uname = sessionStorage.getItem("username_store");
      let that = this;
      let url = "http://10.251.254.94:8000/cherry/show_message/" + uname + "/";
      axios.get(url).then(function (response) {
        if (response.data.flag == true) {
          console.log("get_user_question success!");
          // console.log('user_question_receive:'+that.user_question_receive);
          // console.log('response.data.user.questions:'+response.data.user.questions);
          // console.log('response.data.user.questions:'+response.data.user.questions[0].title);
          // console.log('response.data.user.questions:'+response.data.user.questions[0].ctime);

          that.user_question_receive = response.data.user.questions;

          // console.log('user_question_receive:'+that.user_question_receive);
          // console.log('that.user_question_receive:'+that.user_question_receive[1].title);
          // console.log('that.user_question_receive:'+that.user_question_receive[1].ctime);
        } else {
          console.log("fail! get_user_question fail!");
        }
      });
    },
  },
  created() {
    this.get_user_question();
  },
};
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>