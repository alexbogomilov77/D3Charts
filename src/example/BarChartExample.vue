<template>
  <div class="example">
    <div class="header">
      <img class="activePhoto" :src="`${this.activePhoto}`">
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
          "photo": "https://media-exp1.licdn.com/dms/image/C5603AQFMfGsGyuPTvg/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=8kdl-wiSwf6q_HSosG6EJJPsf07q4EZUMP6GdrFzL7M",
          "duration": 76
        },
        {
          "name": "James",
          "photo": "https://media-exp1.licdn.com/dms/image/C4D03AQGFhNFGLupPzA/profile-displayphoto-shrink_800_800/0?e=1605744000&v=beta&t=KNNofiGG3BPVibih9UFHE5HMc-SdAnslJn0W1ZB_O7w",
          "duration": 36
        },
        {
          "name": "Ahmet",
          "photo": "https://media-exp1.licdn.com/dms/image/C5603AQHKwKRkmaqzdQ/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=Zz11GZEuvX09Vt_EEXkIb5ZLOqUO7z8ASYhLC3jQc7s",
          "duration": 51
        },
        {
          "name": "Alex",
          "photo": "https://media-exp1.licdn.com/dms/image/C5603AQG1AkhOsWAZIQ/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=U2Ii9fbLS23BvH3y1DK-X9d9vY04GoJW8_KBmgz_yYg",
          "duration": 99
        },
        {
          "name": "Plamen",
          "photo": "https://media-exp1.licdn.com/dms/image/C4D03AQEhrpz1peV4Vw/profile-displayphoto-shrink_100_100/0?e=1605744000&v=beta&t=6Fyhb9prv-MpGvMvolloN-hyJr7SemdyPb0vQwTGoS0",
          "duration": 30
        }
      ],
      copyIcon,
      charts: { bars2 },
      activeName: "",
      activePhoto: ""
    };
  },
  methods: {
    namePassed(activeBar) {
      this.activeName = activeBar.name;
      this.activePhoto = activeBar.photo;
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

.activePhoto {
  width: 50px;
  height 50px;  
}

.example {
  border-radius: 10px;
  // padding: 1em;
  box-shadow: 2px 2px 8px alpha($color, 0.2);
}
</style>
