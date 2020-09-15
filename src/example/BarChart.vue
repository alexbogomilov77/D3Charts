<template>
  <div class="wrapper">
    <div class="header">
      <div class="profile">
        <img class="activePhoto" :src="`${this.activePhoto}`">
        <div class="profile-details">
          <span class="active-name">
            {{ activeName || 'Name' }}
          </span>
          <span class="label">
            Engagement Overall
          </span>
        </div>
      </div>
      <button class="export-btn">EXPORT</button>
    </div>
    <div class="bar-chart">
      <chart
        v-if="data"
        :calldata="data"
        @namePassed="namePassed($event)">
      </chart>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import chart from "./chart.vue";
import calldata from "@/calldata.json";

export default {
  name: "bar-chart-example",
  components: {
    chart,
  },
  data() {
    return {
      data: [
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
          "duration": 70
        }
      ],
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
#app, .row
  display flex
  justify-content center
  align-items center

#app
  user-select none
  flex-flow column wrap
  min-height 100vh

.wrapper {
  border-radius: 10px;
  box-shadow: 10px 20px 35px #dadadae6, -20px -20px 60px #fff;
}

.header {
  display: flex
  padding: 1vw 1.2vw 1vw 1.2vw
  justify-content: space-between
  border-radius: 25px 25px 0px 0;
  background: linear-gradient(90deg, #f0f0f0, #fefefe);
  min-height: 40px
  .active-name {
    font-size: 24px;
    display: block;
    font-weight: bold;
  }
  .label {
    font-size: 14px;
  }
}

.profile {
  display: flex
}

.export-btn {
  color: white
  font-size: 12px
  font-weight: bold
  height: 35px
  opacity: 0.5
  padding: 0px 20px
  margin-top: 7px
  border-radius: 10px
  background: linear-gradient(90deg, rgb(177, 205, 195), rgb(135, 170, 157))
  &:hover {
    cursor pointer
    opacity: 1
    transition: 0.2s
  }
}

.bar-chart {
  padding: 60px 0 30px 0;
  background: #f0f0f0;
  border-radius: 0 0 10px 10px;
}

.activePhoto {
  width: 50px;
  height 50px;
  border-radius: 50px;
  margin-right: 15px;
}
</style>
