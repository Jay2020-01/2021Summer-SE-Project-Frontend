<template>
  <v-card>
    <v-card-title>世界疫情排行</v-card-title>
    <v-card-text id="rankingList">
      <v-combobox
        v-model="selections"
        :items="countries"
        label="选择或搜索国家以显示其疫情数据"
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
      <v-list>
        <v-list-item v-for="(item, i) in selectedCountries" :key="i">
          <v-list-item-avatar>
            <v-img :src="item.flag" alt="flag"></v-img>
          </v-list-item-avatar>
          <v-list-item-content style="padding-top: 3px">
            <v-list-item-title class="text-body-1 font-weight-black">
              {{ item.translation }}
              <v-badge color="red" inline :content="'+' + item.new_confirm">
                <span class="font-weight-bold">
                  <ICountUp
                    class="red--text text--darken-2"
                    :endVal="item.total_confirm"
                  />
                </span>
              </v-badge>
            </v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-black">
              死亡:
              <ICountUp :endVal="item.total_dead" />
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-body-2 font-weight-black">
              治愈:
              <ICountUp :endVal="item.total_cure" />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-virtual-scroll
        :items="locations"
        item-height="80"
        height="800"
        bench="30"
      >
        <template v-slot:default="{ item }">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="item.flag" alt="flag"></v-img>
            </v-list-item-avatar>
            <v-list-item-content style="padding-top: 3px">
              <v-list-item-title class="text-body-1 font-weight-black">
                {{ item.translation }}
                <v-badge color="red" inline :content="'+' + item.new_confirm">
                  <span class="font-weight-bold">
                    <ICountUp
                      class="red--text text--darken-2"
                      :endVal="item.total_confirm"
                    />
                  </span>
                </v-badge>
              </v-list-item-title>
              <v-list-item-subtitle class="text-body-2 font-weight-black">
                死亡:
                <ICountUp :endVal="item.total_dead" />
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-body-2 font-weight-black">
                治愈:
                <ICountUp :endVal="item.total_cure" />
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import ICountUp from "vue-countup-v2";
import WorldCountries from "../../public/static/worldcountries";

export default {
  // props: ["locations"],
  components: {
    ICountUp,
  },
  data: () => ({
    locations: [],
    selections: [],
    countries: [],
    selectedCountries: [],
  }),

  created() {
    this.getRankingList();
  },
  methods: {
    handleChange() {
      var seletedLen = this.selectedCountries.length;
      var seletionsLen = this.selections.length;
      if (seletedLen - 1 == seletionsLen) {
        var removedIndex = this.selectedCountries.findIndex(
          (country) =>
            -1 ==
            this.selections.findIndex(
              (selection) => country.translation == selection
            )
        );
        // console.log(this.worldSeries[removedIndex].translation);
        this.removeCountry(removedIndex);
      } else {
        this.addCountry(this.selections[seletionsLen - 1]);
        // console.log("add");
      }
    },
    async getRankingList() {
      var url = "http://10.251.254.94:8000/cherry/global_order/";
      await axios.get(url).then((res) => {
        this.locations = res.data;
        // console.log(this.locations);
        this.locations.forEach((location) => {
          var country = WorldCountries.WORLD_COUNTRIES.find(
            (country) => country.name == location.country_name
          );
          if (country != undefined) {
            this.countries.push(country.translation);
            location.translation = country.translation;
            location.flag = `https://corona.lmao.ninja/assets/img/flags/${country.abbreviation.toLowerCase()}.png`;
          }
          // console.log(abbr);
        });
      });
      // this.countries.sort(function (a, b) {
      //   console(a < b);
      //   return a < b;
      // });
      // console.log(this.countries);
    },
    addCountry(country_translation) {
      let selectedCountry = this.locations.find(
        (location) => location.translation == country_translation
      );
      this.selectedCountries.push(selectedCountry);
    },
    removeCountry(index) {
      if (index != -1) {
        this.selectedCountries.splice(index, 1);
        // this.$forceUpdate();
      }
    },
  },
};
</script>
