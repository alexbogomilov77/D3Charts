/* eslint-disable */
import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Bars'
// const chartData = [2, 7, 10, 11, 12, 14, 15, 21, 30, 31, 39, 50].map(x => {
//   const y = randomValue(1, 50)
//   return { x, y }
// })
const chartData = [
  { x: 2, y: 16, name: 'James' },
  { x: 10, y: 30, name: 'Tom' },
  { x: 25, y: 80, name: 'Ahmet' },
  { x: 78, y: 44, name: 'Alex' }
  ]
const options = {
  marks: false,
  axis: {
    valuesY: true,
    linesY: false,
    linesX: true,
    valuesX: true
  },
  margin: 0,
  domain: {
    min: 0
  },
  getX: (d) => d.x,
  getY: (d) => d.y,
  colors: [
    colors.red, colors.blue
  ]
}
export default createExampleData({ title, options, chartData })
