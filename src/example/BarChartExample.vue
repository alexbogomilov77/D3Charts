<template>
  <div class="example">
    <div class="charts">
      <div class="chart" v-for="(chart,chartName) in charts" :key="chart">
        <div class="title">{{ activeName }}</div>
        <div class="bar-chart">
          <d3-barchart
            :data="chart.chartData"
            :options="chart.options"
            :key="chartName"
            @namePassed="namePassed($event)">
          </d3-barchart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import copyIcon from "../assets/copy.svg?raw";
import d3Barchart from "../vue-d3-barchart.vue";
// import bars from './data/bars'
// import curve from './data/curve'
// import points from './data/points'
// import curvePoints from './data/curvePoints'
// import curveColors from './data/curveColors'
import bars2 from "./data/bars2";

export default {
  name: "bar-chart-example",
  components: {
    d3Barchart,
  },
  data() {
    return {
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

.example {
  display: flex;
  max-width: 100%;
}

.charts {
  display: flex;
  flex: 1 1 100%;
  max-width: 90%;
  flex-flow: row wrap;
  justify-content: center;
  margin: auto;
}

.title {
  display: flex;
  flex: 1;
  margin: 0.5em 0em;
}

.chart {
  display: flex;
  flex-flow: column wrap;
  margin: 1em;
  align-self: flex-start;

  textarea {
    font-size: 0.5em;
    margin-top: 0.5em;
    resize: vertical;
  }

  button {
    width: auto !important;
    flex: 1;
    display: flex;
    background: none;
    margin: 0;
    padding: 0;
    align-self: flex-end;
  }
}

.bar-chart {
  border: 1px solid $txt-color;
  height: 400px;
  width: 500px;
  padding: 1em;
  box-shadow: 2px 2px 8px alpha($color, 0.2);
}
</style>
