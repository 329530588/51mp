/**
 * @fileOverview app 启动脚本
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-06-29 | sizhao    // 初始版本
*/

App({
  onLaunch: function() {
    const self = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `${getApp().SERVER}/user/session`,
            data: {
              code: res.code
            },
            success(res) {
              console.log(res)
            }
          });
          self.user = res;
        } else {
          alter("登录失败！" + res.errMsg);
        }
      }
    });
  },
  user: null,
  SERVER: "http://116.62.241.153:6161"
});