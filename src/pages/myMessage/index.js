import Toast from "lib/vanui/dist/toast/toast";

Page({
  data: {
    messages: []
  },
  async onLoad() {
    const self = this;
    const { session } = await getApp().fetchUserInfo();
    wx.request({
      url: `${getApp().SERVER}/message/mine`,
      method: "POST",
      data: {
        // desc: null,
        // orderField: null,
        // pageSize: null,
        // format: null,
        queryParam: {
          userId: session
        },
        recentDate: +new Date()
      },
      method: "POST",
      success(res) {
        console.log(res);
        if (res.statusCode === 200 && res.data.code === 1) {
          self.setData({
            messages: res.data.data.items || []
          })
        } else {
          Toast(res.data.message);
        }
      },
      fail(err) {
        Toast("服务器异常");
      }
    });
  }
});
