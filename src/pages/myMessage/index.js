

Page({
  data: {
    messages: [3,3,3,3]
  },
  async onLoad() {
    wx.request({
      url: `${getApp().SERVER}/message/mine`,
      data: {
        desc: null,
        orderField: null,
        pageSize: null,
        format: null,
        queryParam: null,
        userId: null,
        recentDate: null
      },
      method: "POST",
      success(res) {
        console.log(res);
      }
    });
  }
});