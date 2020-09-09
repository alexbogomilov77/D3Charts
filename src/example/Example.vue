<template lang="pug">
  #app
    .row
      bar-chart-example
</template>

<script>
import ghIcon from '../assets/github.svg?raw'
import BarChartExample from './BarChartExample.vue'

export default {
  name: 'example',
  components: {
    BarChartExample
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
