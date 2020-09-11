<template>
  <svg ref="chart" class="d3-bar-chart" :width="w" :height="h" v-if="ready">
    <!-- <defs>
      <filter id="f1" x="0" y="0" width="200%" height="200%">
        <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </defs> -->
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(177, 205, 195);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(135, 170, 157);stop-opacity:1" />
      </linearGradient>
    </defs>
    <g class="bars">
      <rect
        v-for="(d,i) in calldata"
        :key="i"
        :width="xScale(d.duration)"
        :height="rectHeight"
        :y="yScale(d.name)"
        fill="url(#grad1)"
        @click="handleBarClick($event,d)"
        :class="['bar', {active: d.name === activeBarName}]"
      />
      <g>
        <rect
          v-if="activeBarName"
          :width="160"
          :height="35"
          :y="yScale(activeBarName) - 40"
          :x="xScale(activeBarDur) - 160"
          class="tooltip"
        >
        </rect>
        <text
          v-if="activeBarName"
          :y="yScale(activeBarName) - 25"
          :x="xScale(activeBarDur) - 145"
          class="tip-label">
          {{activeBarDur + 'min'}}
        </text>
        <text
          v-if="activeBarName"
          :y="yScale(activeBarName) - 5"
          :x="xScale(activeBarDur) - 145"
          class="tip-label">
          {{'Team Average: ' + avgMins + 'min'}}
        </text>
      </g>
      <!-- time -->
      <text
        v-for="d in calldata"
        :key="d.name"
        :class="['label', {hide: d.name === activeBarName}]"
        :y="yScale(d.name) + rectHeight / 2 + 5"
        :x="xScale(d.duration) - 50"
      >
      {{d.duration + 'min'}}
      </text>
      <!-- team average y line -->
      <line :x1="xScale(avgMins)" :y1="h" :x2="xScale(avgMins)" :y2="0" stroke="#deaf47" stroke-width="2" stroke-dasharray="10 5" />
      <!-- team average x line -->
      <line :x1="xScale(avgMins)" :y1="yScale(activeBarName)" :x2="0" :y2="yScale(activeBarName)" stroke="#deaf47" stroke-width="3" />
      <!-- team average y line point -->
      <circle :cx="xScale(avgMins)" :cy="0" r="8" stroke="white" stroke-width="3" fill="#deaf47" />
    </g>
  </svg>
</template>
<script>
/* eslint-disable */
import * as d3Select from "d3-selection";
import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Axis from "d3-axis";
// import defaultOptions from "./defaultOptions";
const d3 = Object.assign({}, d3Select, d3array, d3scale, d3Shape, d3Axis);
export default {
  name: "d3chart",
  props: {
    calldata: {
      type: Array,
    },
  },
  data() {
    return {
      ready: false,
      activeBarDur: "",
      activeBarName: "",
      avgMins: null,
      w: 600,
      h: 500,
      yScale: null,
      xScale: null,
      yAxis: null,
      rectHeight: null,
    };
  },
  mounted() {
    // this.onResize();
    this.init();
  },
  // watch: {
  //   options(newValue) {
  //     this.onResize();
  //   }
  // },
  computed: {
    margin() {
      return this.opts.margin || this.h / 10;
      // return this.fontSize * 2
    }
  },
  methods: {
    init() {
      this.yScale = d3
        .scaleBand()
        .domain(this.calldata.map((d) => d.name))
        .range([0, this.h])
        .padding(0.5)
      this.rectHeight = this.yScale.bandwidth()

      this.xScale = d3
        .scaleLinear()
        .domain([0, d3.max(this.calldata, (d) => d.duration)])
        .range([0, this.w]);
      this.avgMins = this.calcAverage()

      this.ready = true;
      this.setXYAxis();
    },
    setXYAxis() {
      let self = this;

      this.$nextTick(() => {
        const svg = self.$refs.chart
        const svgElement = d3.select(svg)
        const xAxisGenerator = d3.axisBottom(self.xScale).tickSize(self.h)
        const yAxisGenerator = d3.axisLeft(self.yScale)

        svgElement.append("g").call(xAxisGenerator).attr('class', 'axis-bottom').selectAll('.domain').remove()
        svgElement.append("g").call(yAxisGenerator).attr('class', 'axis-left').selectAll('.domain, .tick line').remove()
        self.putImages()
      })
    },
    putImages () {
      const url = "https://mk0trickyphotos51tq5.kinstacdn.com/wp-content/uploads/2017/08/final-1.png"
      const svgElement = d3.select(this.$refs.chart)
      const axis = svgElement.select('.axis-left')
      axis.selectAll(".tick")
        .append("svg:image")
        .attr("xlink:href", url)
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", -120)
        .attr("y", -20);
    },
    calcAverage () {
      let nums = this.calldata
      let totalSum = 0;
      for (let i in nums) {
          totalSum += nums[i].duration;
      }
      let numsCnt = nums.length;
      let average = totalSum / numsCnt;
      return average
    },
    handleBarClick(event, bar) {
      this.activeBarDur = bar.duration
      this.activeBarName = bar.name
      this.$emit("namePassed", bar.name);
    },
    onResize() {
      let w, h;
      if (!this.options.size) {
        w = this.$el.clientWidth;
        h = this.$el.clientHeight;
      } else {
        w = this.options.size.w;
        h = this.options.size.h;
      }
      // review autosize
      this.w = w > 0 ? w : this.opts.autoSize.w;
      this.h = h > 0 ? h : this.opts.autoSize.h;
    }
  }
};
</script>
<style lang="stylus">
.label {
  font-size: 12px;
  fill: white;
  font-weight: bold;
}

.names {
  fill: darkgreen;
}

.d3-bar-chart {
  max-height: 100%;
  max-width: 100%;
  overflow: visible;
  background: #f0f0f0;
  margin: 0 20px 0 140px;
}

.axis-left {
  .tick {
    font-size: 18px;
  }
}

.axis-bottom {
  line {
    stroke: #b7b7b7;
  }
}

.bar {
  // fill: #92b9a5;
  opacity: 0.2;
  stroke: none;
  transition: 0.1s;
  transition-duration: 0.1s;
  transition-delay: 0.1s;

  &:hover {
    opacity: 1;
    transition: ease 0.2s;
    cursor: pointer;
  }

  &.active {
    opacity: 1;
  }
}

.hide {
  display: none;
}

.tooltip {
  fill: white;
}

.tip-label {
  font-size: 12px;
  fill: black
}

.line {
  stroke: alpha(black, 0.5);
  stroke-width: 2px;
}
</style>
