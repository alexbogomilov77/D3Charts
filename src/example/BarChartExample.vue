<template>
  <div class="example">
    <div class="header">
      <span class="name">
        {{ activeName || 'Name' }}
      </span>
      <span class="label">
        Engagement Overall
      </span>
    </div>
    <div class="bar-chart">
      <d3chart
        v-if="savedData"
        :calldata="savedData"
        @namePassed="namePassed($event)">
      </d3chart>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import copyIcon from "../assets/copy.svg?raw";
// import d3Barchart from "../vue-d3-barchart.vue";
import d3chart from "@/d3chart.vue";
import bars2 from "./data/bars2";
import calldata from "@/calldata.json";
// const d3 = Object.assign({}, csv);

export default {
  name: "bar-chart-example",
  components: {
    d3chart,
  },
  data() {
    return {
      savedData: [
        {
          "name": "Shelley",
          "duration": 76
        },
        {
          "name": "Hardy",
          "duration": 36
        },
        {
          "name": "Ahmet",
          "duration": 51
        },
        {
          "name": "Alex",
          "duration": 99
        },
        {
          "name": "Jeckie",
          "duration": 30
        }
      ],
      copyIcon,
      charts: { bars2 },
      activeName: "",
    };
  },
  methods: {
    namePassed(name) {
      this.activeName = name;
    }
  },
};
</script>
<style lang="stylus">
@import '../vars.styl';

.header {
  padding: 1vw 0 1vw 20px;
  min-height: 40px;
  .name {
    font-size: 24px;
    display: block;
    font-weight: bold;
  }
  .label {
    font-size: 14px;
  }
}

.bar-chart {
    padding: 30px 0;
    background: #f0f0f0;
  }

.example {
  border-radius: 10px;
  // padding: 1em;
  box-shadow: 2px 2px 8px alpha($color, 0.2);
}
</style>
