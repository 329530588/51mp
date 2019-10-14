import Toast from "lib/vanui/dist/toast/toast";

Page({
  data: {
    searchTxt: "lalala",
    list: [],
    status: 0 // 0-未开始，1-进行中，2-已结束
  },
  async onLoad() {
    const { status } = this.data;
    const { session } = await getApp().fetchUserInfo();
    wx.request({
      url: `${getApp().SERVER}/challenge/mine`,
      data: {
        status,
        userId: session
      },
      success(res) {
        console.log(res);
        if (res.statusCode === 200 && res.data.code === 1) {
        } else {
          Toast(res.data.message);
        }
      }
    });
  },
  onChangeTab(e) {
    this.setData({
      status: e.detail.index
    });
  }
});
