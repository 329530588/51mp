import Toast from "lib/vanui/dist/toast/toast";

Page({
  data: {
    searchTxt: "lalala",
    list: [],
    status: 0 // 0-未开始，1-进行中，2-已结束
  },
  onLoad() {
    this.getList();
  },
  async getList() {
    const self = this;
    const { status } = this.data;
    const { session } = await getApp().fetchUserInfo();
    wx.request({
      url: `${getApp().SERVER}/challenge/mine`,
      method: "POST",
      data: {
        queryParam: {
          status,
          userId: session,
        },
        recentDate: +new Date()
      },
      success(res) {
        console.log(res);
        if (res.statusCode === 200 && res.data.code === 1) {
          self.setData({
            list: res.data.data.items
          })
        } else {
          Toast(res.data.message);
        }
      },
      fail(err) {
        Toast("服务器异常");
      }
    });
  },
  onChangeTab(e) {
    this.setData({
      status: e.detail.index
    }, function() {
      this.getList()
    });
  }
});
