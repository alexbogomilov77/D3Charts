<template>
  <svg class="d3-bar-chart" v-if="bars.length" :width="w" :height="h">
    <!-- <g class="axis" v-if="opts.axis">
        <line class="x-axis" :x1="oXa" :x2="w" :y1="hh" :y2="hh" />
        <line class="y-axis" :x1="oXa" :x2="oXa " y1="0" :y2="hh" />
        <g class="axis-labels" v-for="(a,i) in axisY" :key="i">
          <text class="axis-label" v-if="opts.axis.valuesY" x="0" :y="a.y">{{a.value}}</text>
        </g>
    </g>-->
    <g class="lines">
      <!-- <line class="line-y" v-for="(a,i) in axisY" :key="i" :x2="w" :y1="a.y" :y2="a.y" /> -->
      <line class="line-y" v-for="a in axisY" :key="a.y" :y1="hh" :x1="a.y" :x2="a.y" />
      <!-- <g class="axis">
          <line class="x-axis" :x1='oXa' :x2="w" :y1="hh" :y2="hh" />
          <line class="y-axis" y1="0" :y2="hh" />
      </g>-->
      <!-- <g class="axis-labels">
          <text class="axis-label" v-for="(a,i) in axisY" :key="i" x="0" :y="a.y">{{a.value}}</text>
      </g>-->
      <g class="axis-labels">
        <text class="axis-label" v-for="a in axisY" :key="a.y" :x="a.y" :y="a.x">{{a.value}}</text>
      </g>
    </g>
    <g class="bars">
      <rect
        v-for="(d,i) in bars"
        :key="i"
        :class="['bar', {active: barN(d) === activeBar}]"
        :width="barM(d)"
        :height="25"
        :x="0"
        :y="barY(d) - 21"
        :style="barStyle(d)"
        @mouseover.prevent="startMove($event,d)"
        @click="barClick($event,d)"
      />
      <!-- time -->
      <text
        v-for="(d,i) in bars"
        :key="i.percentX"
        class="label"
        :y="barY(d)"
        :x="barX(d) - 70"
      >{{barM(d) + 'min'}}</text>
      <!-- names -->
      <text v-for="(d,i) in bars" :key="i.percentX" class="names" :y="barY(d)" :x="-70">{{barN(d)}}</text>
    </g>
    <!-- <g class="dummies">
          <rect
            v-for="(d,i) in dummyBars"
            :key="i"
            class="dummy-bar"
            :width="d.w"
            :height="h"
            :x="barX(d)"
            y="0"
            :class="(opts.bars) ? &quot;has-bars&quot;:&quot;&quot;"
            @mouseover.prevent="startMove($event,d)"
            @mouseleave="stopMove($event,d)"
            @click="barClick($event,d)"
            @touchstart="barClick($event,d)"
          />
    </g>-->
    <!-- <g class="chart-tip" v-if="opts.tip &amp;&amp; over">
        <rect
          class="chart-tip-back"
          v-if="opts.tipBack"
          :x="lineX + fontSize/2"
          :y="0"
          :width="labelW + &quot;ex&quot;"
          :height="label.length + .25 + &quot;em&quot;"
          :rx="labelW / 5"
          :ry="label.lenght"
          @touchstart="barClick(over)"
        />
        <text class="label" :x="lineX + fontSize" y="0" :font-size="fontSize" />
        <tspan
          class="label-line"
          v-for="(line) in label"
          :key="line.txt"
          :x="lineX + fontSize"
          dy="1.2em"
          :class="line.css"
          :style="line.style"
        >{{line.txt}}</tspan>
      </g>
    <span>{{label}}</span>-->
  </svg>
</template>
<script>
/* eslint-disable */
import * as d3Select from "d3-selection";
import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
import * as d3Shape from "d3-shape";
import defaultOptions from "./defaultOptions";
const d3 = Object.assign({}, d3Select, d3array, d3scale, d3Shape);
export default {
  name: "D3-bar-chart",
  props: {
    data: {
      type: Array,
    },
    options: {
      type: Object,
      default: () => {
        return Object.assign({}, defaultOptions);
      },
    },
  },
  data() {
    return {
      activeBar: '',
      w: 800,
      h: 500,
      colorInterpol: null,
      mouseX: 30,
      mouseOffset: {
        x: 0,
        y: 0,
      },
      over: false,
      getY: Math.abs,
      gradientId: "svgGradient",
      colorScale: d3.scaleLinear,
      curveBack: null,
      curveBackStyle: {},
      curveStyle: {},
      // default label formatter, -> array, one value per line
      formatLabel(bar, formatX, formatY) {
        return ["y: " + "formatY(bar.yv)", "x: " + formatX(bar.xv)];
      },
      // default x  formatter
      formatX(x) {
        return x;
      },
      // default y formatter
      formatY(y) {
        return y;
      },
      opts: Object.assign({}, defaultOptions),
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.onResize();
  },
  watch: {
    options(newValue) {
      this.init();
      this.onResize();
    },
  },
  computed: {
    xMax() {
      return this.getX ? d3.max(this.xValues) + 1 : this.dataCount;
    },
    xMin() {
      return this.getX ? d3.min(this.xValues) : 0;
    },
    isLinear() {
      const { bars, marks } = this.opts;
      return !bars && !marks;
    },
    scaleLinearX() {
      const { xMax, w, xMin } = this;
      return d3.scaleLinear().domain([xMin, xMax]).range([0, w]);
    },
    scaleBarsX() {
      const { xMax, ww, xMin } = this;
      const { padding } = this.opts;
      return d3
        .scaleBand()
        .domain(d3.range(xMin, xMax))
        .paddingInner(padding)
        .rangeRound([0, ww]);
    },
    scaleX() {
      const { scaleLinearX, scaleBarsX, isLinear } = this;
      return isLinear ? scaleLinearX : scaleBarsX;
    },
    scaleY() {
      return d3
        .scaleBand()
        .domain(this.mappedData.map((d) => d.y))
        .rangeRound([0, this.hh]);
    },
    percentX() {
      return d3
        .scaleLinear()
        .domain([0, this.dataCount - 1])
        .range([0, 100]);
    },
    percentY() {
      return d3.scaleLinear().domain([this.min, this.max]).range([0, 100]);
    },
    renderGradient() {
      const curve = this.opts.curve;
      const bars = this.opts.bars;
      const curveBack = this.opts.curveBack;
      return (
        (bars && bars.gradient) ||
        (curve && curve.gradient) ||
        (curveBack && curveBack.gradient)
      );
    },
    colors() {
      const colorCb = this.opts.colorCb;
      if (colorCb && typeof colorCb === "function") return colorCb;
      let colors = (d) => {
        return "red";
      };
      // color with interpolator
      if (this.colorInterpol) {
        colors = d3
          .scaleSequential()
          .domain([this.max, this.min])
          .interpolator(this.colorInterpol);
        // color with max, min
      } else if (this.opts.colors) {
        const uColors = this.opts.colors;

        let range;
        let domain = [this.max, this.min];
        if (Array.isArray(uColors)) {
          range = uColors;
        } else if (typeof uColors === "object") {
          range = Object.values(uColors);
          domain = Object.keys(uColors);
        }
        colors = this.colorScale().domain(domain).range(range);
      }
      return colors;
    },

    axisY() {
      let ticks = this.opts.axisTicks;
      ticks = ticks <= this.max ? ticks : this.max;
      const axis = [];

      const scaleV = d3
        .scaleLinear()
        .domain([0, ticks])
        .rangeRound([this.min, this.max]);

      const scaleY = d3
        .scaleLinear()
        .domain([ticks, 0])
        .rangeRound([this.w, 0]);

      for (let i = 0; i <= ticks; i++) {
        const v = scaleV(i);
        axis.push({
          v: v,
          value: this.formatY(v),
          y: scaleY(i),
        });
      }
      return axis;
    },
    // axisX() {
    //   let ticks = this.opts.axisXTicks;
    //   ticks = ticks <= this.max ? ticks : this.max;
    //   const axis = [];

    //   const scaleV = d3
    //     .scaleLinear()
    //     .domain([0, ticks])
    //     .rangeRound([this.min, this.max]);

    //   const scaleY = d3
    //     .scaleLinear()
    //     .domain([0, ticks])
    //     .rangeRound([this.hh, 0]);

    //   for (let i = 0; i <= ticks; i++) {
    //     const v = scaleV(i);
    //     axis.push({
    //       v: v,
    //       value: this.formatY(v),
    //       y: scaleY(i),
    //     });
    //   }
    //   return axis;
    // },
    bars() {
      const { scaleX, scaleY, percentX, percentY, colors, barW } = this;
      return this.mappedData.map((m, i) => {
        const { x, y, d } = m;
        return {
          d,
          xv: x,
          yv: y,
          x: scaleX(x),
          y: scaleY(y),
          color: colors(y, d),
          percentX: parseInt(percentX(x)),
          percentY: parseInt(percentY(y)),
          w: barW,
        };
      });
    },
    dummyBars() {
      let { isLinear, bars, ww } = this;
      bars = [...bars];
      const w = ww / bars.length;
      if (!isLinear) return bars;
      return bars.map((b, i) => {
        b = Object.assign({}, b);
        b.w = w;
        b.x = b.x - w / 2;
        return b;
      });
    },
    oXa() {
      return this.margin;
    },
    oX() {
      const { barW } = this;
      return this.oXa + barW / 2;
    },
    oY() {
      return this.margin / 2;
    },
    hh() {
      return this.h - this.oY;
    },
    ww() {
      return this.w - this.oY;
    },
    barW() {
      const { bandwidth } = this.scaleX;
      return typeof bandwidth === "function" ? bandwidth() : 0;
    },
    barPad() {
      return this.scaleX.padding();
    },
    markSize() {
      if (this.opts.marks && this.opts.marks.size) return this.opts.marks.size;
      if (this.barW) return this.barW / 10;
      return 5;
    },
    min() {
      const { min } = this.opts.domain;
      const { yValues } = this;
      return min === null || min === undefined ? d3.min(yValues) : min;
    },
    max() {
      const { max } = this.opts.domain;
      const { yValues } = this;
      return max === null || max === undefined ? d3.max(yValues) : max;
    },
    mappedData() {
      return this.data.map((d, i) => {
        const y = this.getY(d);
        const x = this.getX ? this.getX(d) : i;
        return { x, y, d };
      });
    },
    yValues() {
      return this.mappedData.map((d) => d.y);
    },
    xValues() {
      return this.mappedData.map((d) => d.x);
    },
    dataCount() {
      return this.mappedData.length;
    },
    fontSize() {
      return this.opts.fontSize;
    },
    fontSizeComp() {
      const maxChars = d3.max(
        this.data.map((d) => {
          return String(d).length;
        })
      );
      return this.w / (maxChars * this.data.length * 2);
    },
    margin() {
      return this.opts.margin || this.h / 10;
      // return this.fontSize * 2
    },
    lineX() {
      const over = this.over;
      if (over) return over.x + this.margin + over.w / 2;
      return 0;
    },
    label() {
      return this.createLabel(this.over);
    },
    // calculates label with by max line chars (ex)
    labelW() {
      const maxLen = d3.max(
        this.label.map((l) => {
          return l.toString().length;
        })
      );
      return maxLen ? maxLen + 1 : 0;
    },
  },
  methods: {
    curve(opts) {
      const data = this.bars;
      const barw = this.barW;
      const b = barw / 2;
      const curve = d3
        .line()
        .x((d) => {
          return this.barX(d) + b;
        })
        .y((d) => {
          return this.barY(d);
        });
      // curve type
      if (opts.type) {
        curve.curve(this.curveType(opts.type));
      }
      let d = curve(data);
      if (opts.close) d += this.closeCurve();
      return d;
    },
    closeCurve() {
      const fp = this.bars[0];
      const lp = this.bars[this.bars.length - 1];
      const fpx = this.barX(fp) + fp.w / 2;
      const lpx = this.barX(lp) + lp.w / 2;
      const d = [" L" + lpx, this.hh, "L" + fpx, this.hh, "Z"];
      return d.join(" ");
    },
    createLabel(bar) {
      const label = this.formatLabel(bar, this.formatX, this.formatY);
      return label.map((v, i) => {
        const style = v.style || {};
        const css = v.css || [];
        css.push(`l-${i}`);
        const txt = v.txt || v;
        return { style, css, txt, i };
      });
    },
    init() {
      const opts = this.opts;
      const options = this.options;

      for (const op in options) {
        opts[op] = options[op];
      }
      const props = ["formatLabel", "formatX", "formatY"];
      for (const prop of props) {
        if (options[prop]) this[prop] = options[prop];
      }
      if (!options.marks) opts.marks = null;

      // conditional color interpolator
      this.setFucntion("colorInterpol");
      // Color Scale function
      this.setFucntion("colorScale");

      // Y get / format
      const getY = options.getY;
      if (getY && typeof getY === "function") {
        this.getY = getY;
      }
      // X get / format
      const getX = options.getX;
      if (getX && typeof getX === "function") {
        this.getX = getX;
      }
      this.gradientId = this.randomName("svgGrad-");

      // copy curve settings to curveBack
      const curve = this.opts.curve;
      const curveBack = this.opts.curveBack;
      if (curveBack) {
        curveBack.type = curve.type || null;
      }
      // sets styles
      this.curveStyle = this.gradientStyle("curve");
      this.curveBackStyle = this.gradientStyle("curveBack");
    },
    setFucntion(name, value) {
      const f = this.opts[name];
      if (f) {
        if (typeof f === "function") {
          this[name] = f;
        } else {
          if (typeof d3[f] === "function") {
            this[name] = d3[f];
          }
        }
      }
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
    },
    gradientStyle(name) {
      let style = {};
      const e = this.opts[name];
      if (e) {
        style = e.style || {};
        const strokeUrl = "url(#" + this.gradientId + ")";
        if (e.gradient) {
          if (e.gradient.stroke) {
            style.stroke = strokeUrl;
          }
          if (e.gradient.fill) {
            style.fill = strokeUrl;
          }
        }
      }
      return style;
    },
    barX(d) {
      let { x } = d;
      // x += this.margin;
      return x;
      // return (x > -1) ? x : 0
    },
    barY(d) {
      const y = this.h - d.y - this.margin / 2;
      return y;
      // return (y > -1) ? y : 0
    },
    barN(d) {
      for (const [key, value] of Object.entries(d.d)) {
        if (key === "name") {
          return value;
        }
      }
    },
    barM(d) {
      for (const [key, value] of Object.entries(d.d)) {
        if (key === "y") {
          return value;
        }
      }
    },
    txtX(d) {
      return (
        d.x + d.w / 2 - (String(d.x).length * this.fontSize) / 2 + this.margin
      );
    },
    barStyle(d) {
      const style = this.gradientStyle("bars");
      if (!style.fill) style.fill = this.opts.colors ? d.color : "";
      return style;
    },
    markStyle(d) {
      return this.opts.marks.style || this.barStyle(d);
    },
    curveType(type) {
      if (type) {
        if (typeof type === "function") return type;
        // ex Linear
        let func = d3["curve" + type];
        if (typeof func === "function") return func;
        // ex curveLinear
        func = d3[type];
        if (typeof func === "function") return func;
      }
      return d3.curveMonotoneX;
    },
    startMove(event, bar) {
      let x = 0;
      let y = 0;
      if (event && bar) {
        x = event.pageX - this.barX(bar);
        y = event.pageY - this.barY(bar);
      }
      this.mouseOffset = { x, y };
      this.over = bar;
    },
    moveLine(event) {
      this.mouseX = event.pageX - this.mouseOffset.x;
    },
    stopMove(event, d) {
      this.over = false;
    },
    randomName(prefix) {
      let rnd = prefix || "";
      rnd += Math.random().toString(36).substring(7);
      return rnd;
    },
    barClick(event, bar) {
      this.activeBar = bar.d.name
      this.$emit("namePassed", bar.d.name);
      this.over = this.over === bar ? false : bar;
      this.$emit("barClick", { bar, event });
    },
  },
};
</script>
<style lang="stylus">
.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}

.grid line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

.grid path {
  stroke-width: 0;
}

.label {
  font-size: 12px;
  fill: white;
}

.names {
  fill: darkgreen;
}

.d3-bar-chart {
  max-height: 100%;
  max-width: 100%;
  overflow: visible;
}

.bar {
  fill: cyan;
  opacity: 0.2;
  stroke: none;

  &:hover {
    opacity: 1;
    transition: ease 0.2s;
    cursor: pointer;
  }
  &.active {
    opacity: 1;
  }
}

.dummy-bar {
  fill: none;
  stroke: none;
  pointer-events: all;
}

.dummy-bar.has-bars {
  &:hover {
    fill: alpha(black, 0.1);
  }
}

.bar-text {
  fill: gray;
}

.rulers {
  stroke-width: 1px;
  stroke: black;
}

.lines {
  stroke: gray;
  stroke-width: 1px;
  stroke-opacity: 0.3;
}

.axis {
  stroke-width: 1px;
  stroke: gray;
}

.axis-labels {
  transform: translateY(390px);
}

.axis-label {
  fill: gray;
  stroke: none;
  font-size: 8px;
}

.line {
  stroke: alpha(black, 0.5);
  stroke-width: 2px;
}

.curve, .curve-back {
  stroke: black;
  stroke-width: 3px;
  fill: none;
}

.curve-point {
  fill: gray;
  stroke: black;
}

.chart-tip {
  stroke: none;
  fill: gray;
}

.chart-tip-back {
  fill: black;
  stroke-width: 1px;
  stroke: gray;
  opacity: 0.5;
}

.chart-line {
  pointer-events: none;
}
</style>
