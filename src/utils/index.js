/**
 * @fileOverview 工具方法
 * @version 1.0.0 | 2018-06-25 | sizhao
*/

const formatTime = function (input) {
  const date = new Date(input); //返回当前时间对象
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return [year, month, day].join('-')
}
 
module.exports = {
  formatTime
}