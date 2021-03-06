/* eslint-disable */
import { createExampleData } from './lib'
import colors from '../../colors.json'
const title = 'Bars'
// const chartData = [2, 7, 10, 11, 12, 14, 15, 21, 30, 31, 39, 50].map(x => {
//   const y = randomValue(1, 50)
//   return { x, y }
// })
const chartData = [
  { x: 2, y: 16, name: 'Shelley' },
  { x: 10, y: 30, name: 'Hardy' },
  { x: 25, y: 80, name: 'Ahmet' },
  { x: 78, y: 34, name: 'Alex' },
  { x: 7, y: 66, name: 'Jeckie' },
  { x: 16, y: 20, name: 'Tom' },
  { x: 55, y: 44, name: 'Wetz' },
  { x: 21, y: 36, name: 'Butler' },
  { x: 18, y: 60, name: 'Scott' },
  { x: 29, y: 90, name: 'Katranci' },
  { x: 68, y: 24, name: 'Marinov' },
  { x: 97, y: 6, name: 'James' },
  ]
const options = {
  marks: false,
  axis: {
    valuesY: true,
    linesY: true,
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
