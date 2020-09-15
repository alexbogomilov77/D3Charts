<template lang="pug">
  #app
    .row
      bar-chart
</template>

<script>
import ghIcon from '../assets/github.svg?raw'
import BarChart from './BarChart.vue'

export default {
  name: 'Main',
  components: {
    BarChart
  },
  data () {
    return {
      icons: {
        gitHub: ghIcon
      },
      app: process.env.APP
    }
  }
}
</script>
<style lang="stylus">
  @import '../vars.styl'
  @import './html.styl'
  @import './app.styl'

</style>
