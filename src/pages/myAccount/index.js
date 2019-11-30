import Toast from "lib/vanui/dist/toast/toast";

Page({
  data: {
    money: 0
  },
  async onLoad() {

    const { session } = await getApp().fetchUserInfo();
    const self = this;
    // TODO:
    //  wx.request({
    //    url: `${getApp().SERVER}/user/cardRecord`,
    //    data: {
    //      image,
    //      challengeId: self.data.detail.challenge.uuid,
    //      userId: session
    //    },
    //    method: "POST",
    //    success(res) {
    //      console.log(res);
    //      if (res.statusCode === 200 && res.data.code === 1) {
    //      } else {
    //        Toast(res.data.message);
    //      }
    //    },
    //    fail(err) {
    //      Toast("服务器异常");
    //    }
    //  });
  }
});