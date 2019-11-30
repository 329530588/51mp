/**
 * @fileOverview app 启动脚本
 * @author sizhao | 870301137@qq.com
 * @version 1.0.0 | 2018-06-29 | sizhao    // 初始版本
 */

App({
  onLaunch: function() {
    Date.prototype.format = function(fmt) {
      //author: meizz
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    };
  },
  fetchUserInfo: function() {
    const self = this;

    return new Promise(function(resolve, reject) {
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
                if (res.statusCode === 200 && res.data.code === 1) {
                  const session = res.data.data.session;
                  wx.request({
                    url: `${getApp().SERVER}/user/info`,
                    method: "POST",
                    data: {
                      session
                    },
                    success(res) {
                      if (res.statusCode === 200 && res.data.code === 1) {
                        if (res)
                          resolve({
                            ...res.data.data.userVO,
                            session
                          });
                        console.log("userInfo:", {
                          ...res.data.data.userVO,
                          session
                        });
                      }
                    },
                    fail(err) {
                      Toast("服务器异常");
                    }
                  });

                  // wx.request({
                  //   url: `${getApp().SERVER}/user/login`,
                  //   method: "POST",
                  //   data: {
                  //     session: res.data.data.session,
                  //     avatar: "",
                  //     city: "",
                  //     country: "",
                  //     nickname: "",
                  //     province: "",
                  //     sex: ""
                  //   },
                  //   success(res) {
                  //     if (res.statusCode === 200 && res.data.code === 1) {
                  //       // if (res) self.user = res.data.data.userVO;
                  //     }
                  //   },
                  //   fail(err) {
                  //     Toast("服务器异常");
                  //   }
                  // });
                }
              },
              fail(err) {
                Toast("服务器异常");
              }
            });
            self.user = res;
          } else {
            alter("登录失败！" + res.errMsg);
          }
        },
        fail(err) {
          Toast("服务器异常");
        }
      });
    });
  },
  user: null,
  SERVER: "http://116.62.241.153:6161"
});
