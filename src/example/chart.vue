<template>
  <svg ref="chart" class="d3-bar-chart" :width="w" :height="h" v-if="ready">
    <!-- options -->
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(177, 205, 195);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(135, 170, 157);stop-opacity:1" />
      </linearGradient>
    </defs>
    <clipPath id="clipCircle">
      <circle r="25" cx="25" cy="25"/>
    </clipPath>
    <!-- options -->
    <!-- label -->
    <text :x="xScale(avgMins) - 45" :y="-20" fill="#e0c998">Team Average</text>
    <!-- charts -->
    <g class="bars">
      <g
        v-for="(d,i) in calldata"
        :key="i"
        class="bar-group"
      >
        <text
          :class="['name', {active: d.name === activeBarName}]"
          :style="`transform: translate(${- mdSpace / 2}px, ${d.yOffset + rectHeight / 2}px)`">
          {{ d.name }}
        </text>
        <circle
          r="27"
          cx="27"
          cy="27"
          fill="rgb(135, 170, 157)"
          :style="`transform: translate(${- mdSpace - 2}px, ${d.yOffset - xsSpace - 2}px)`"
        />
        <image
          width="50"
          height="50"
          :xlink:href="`${d.photo}`"
          clip-path="url(#clipCircle)"
          :style="`transform: translate(${- mdSpace}px, ${d.yOffset - xsSpace}px)`"
        />
        <rect
          :width="xScale(d.duration)"
          :height="rectHeight"
          :y="yScale(d.name)"
          fill="url(#grad1)"
          @click="handleBarClick(d)"
          :class="['bar', {active: d.name === activeBarName}]"
        />
      </g>
      <!-- tooltip -->
      <g v-if="activeBarName">
        <rect
          :width="160"
          :height="55"
          ry="3"
          rx="3"
          :y="yScale(activeBarName) - 60"
          :x="xScale(activeBarDur) - 160"
          class="tooltip"
        >
        </rect>
        <text
          :y="yScale(activeBarName) - 35"
          :x="xScale(activeBarDur) - 105"
          class="tooltip-minutes">
          {{activeBarDur + 'min'}}
        </text>
        <text
          :y="yScale(activeBarName) - 15"
          :x="xScale(activeBarDur) - 150"
          class="tooltip-average-minutes-label">
          Team Average:
        </text>
        <text
          :y="yScale(activeBarName) - 15"
          :x="xScale(activeBarDur) - 60"
          class="tooltip-average-minutes">
          {{avgMins + 'min'}}
        </text>
      </g>
      <!-- time -->
      <text
        v-for="d in calldata"
        :key="d.name"
        :class="['label', {hide: d.name === activeBarName}]"
        :y="yScale(d.name) + rectHeight / 2 + xsSpace"
        :x="xScale(d.duration) - 50"
      >
        {{d.duration + 'min'}}
      </text>
      <!-- team average -->
      <line :x1="xScale(avgMins)" :y1="h" :x2="xScale(avgMins)" :y2="0" stroke="#deaf47" stroke-width="2" stroke-dasharray="10 5" />
      <line :x1="xScale(avgMins)" :y1="yScale(activeBarName)" :x2="0" :y2="yScale(activeBarName)" stroke="#deaf47" stroke-width="3" />
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
const d3 = Object.assign({}, d3Select, d3array, d3scale, d3Shape, d3Axis);
export default {
  name: "chart",
  props: {
    calldata: {
      type: Array,
    },
  },
  data() {
    return {
      ticks: [],
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
      xsSpace: 5,
      mdSpace: 150
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const bandWithY = d3
        .scaleBand()
        .domain(this.calldata.map((d) => d.name))
        .range([0, this.h])
        .padding(0.5)

      const yAxis = d3
        .scaleLinear()
        .domain([0, d3.max(this.calldata.map((d) => d.duration))])
        .range([0, this.h]);

      this.ticks = yAxis.ticks(5).map(value => ({ yOffset: yAxis(value) }))

      for (let i = 0; i < this.calldata.length; i++) {
        this.calldata[i] = {...this.calldata[i], ...this.ticks[i]}
      }
            
      this.yScale = d3
        .scaleBand()
        .domain(this.calldata.map((d) => d.name))
        .range([0, this.h])
      // height of rectangle bars
      this.rectHeight = bandWithY.bandwidth()

      this.xScale = d3
        .scaleLinear()
        .domain([0, d3.max(this.calldata, (d) => d.duration)])
        .range([0, this.w])
      this.avgMins = this.calcAverage()

      this.ready = true
      this.setXYAxis()
      this.handleBarClick(this.calldata[2])
    },
    setXYAxis() {
      let self = this;

      this.$nextTick(() => {
        const svg = self.$refs.chart
        const svgElement = d3.select(svg)
        const xAxisGenerator = d3.axisBottom(self.xScale).tickSize(self.h)

        svgElement.append("g").call(xAxisGenerator).attr('class', 'axis-bottom').selectAll('.domain').remove()
      })
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
    handleBarClick(bar) {
      this.activeBarDur = bar.duration
      this.activeBarName = bar.name
      this.$emit("namePassed", bar);
    }
  }
};
</script>
<style lang="stylus">
.d3-bar-chart {
  max-height: 100%;
  max-width: 100%;
  overflow: visible;
  background: #f0f0f0;
  margin: 0 20px 0 200px;
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
  opacity: 0.2;
  stroke: none;
  transition: 0.1s;
  transition-duration: 0.1s;

  &:hover {
    opacity: 1;
    transition: ease 0.2s;
    cursor: pointer;
  }
}

.label {
  font-size: 12px;
  fill: white;
  font-weight: bold;
}

.name {
  fill: #225057;
  opacity: 0.2;
}

.active {
  opacity: 1;
}

.hide {
  display: none;
}

.tooltip {
  fill: white;
}

.tooltip-minutes {
  font-size: 20px
  font-weight: bold
  fill: #656565
}

.tooltip-average-minutes {
  font-size: 12px
  font-weight: bold
  fill: #deaf47
}

.tooltip-average-minutes-label {
  font-size: 12px
  font-weight: bold
  fill: #c5c5c5
}

.line {
  stroke: alpha(black, 0.5);
  stroke-width: 2px;
}
</style>
