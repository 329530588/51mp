

import Dialog from "lib/vanui/dist/dialog/dialog";

Page({
  data: {
    showShareSheet: 0,
    showBook: 0,
    qrCode: null,
    challenge: null // 挑战详情
  },
  async onLoad(query) {
    wx.request({
      url: `${getApp().SERVER}/challenge/details`,
      data: {
        challengeId: query.challengeId,
        userId: query.userId
      },
      method: "POST",
      success(res) {
        console.log(res);
      }
    });
  },
  deleteChallenge() {
    const { challengeId } = this.options;
    console.log(this.options, "query");
    wx.request({
      url: `${getApp().SERVER}/challenge/delete`,
      data: {
        challengeId: null,
        userId: null,
        targetId: null
      },
      method: "POST",
      success(res) {
        console.log(res);
      }
    });
  },
  toggleRules() {
    Dialog.alert({
      title: "契约挑战规则",
      messageAlign: "left",
      message: [
        "1. 参与挑战成员挑战失败将损失全部的契约金，完成挑战者不仅能拿回自己的契约金还能平分其他人的契约金。",
        "2. 所有人都未完成挑战，则全部成员扣取契约金的20%作为惩罚。",
        "3. 只有挑战开始前可以取消挑战。",
        "4. 当挑战开始后将无法加入新的挑战成员，也无法退出挑战。",
        "5. 提现账户余额，微信将收取1%的手续费，契约挑战不收取任何费用。"
      ].join("\n")
    });
  },
  onCloseShareSheet() {
    this.setData({
      showShareSheet: 0
    });
  },
  onShowShareSheet() {
    this.setData({
      showShareSheet: 1
    });
  },
  participateIn() {
    wx.request({
      url: `${getApp().SERVER}/challenge/add`,
      data: {
        challengeId: null,
        targetId: null,
        userId: null
      },
      method: "POST",
      success(res) {
        console.log(res);
      }
    });
  },
  addCardRecord() {
    wx.request({
      url: `${getApp().SERVER}/user/cardRecord`,
      data: {
        challengeId: null,
        image: null,
        userId: null
      },
      method: "POST",
      success(res) {
        console.log(res);
      }
    });
  },
  shareToFriends() {
    wx.showShareMenu({
      withShareTicket: true
    });
    // this.setData({
    //   showShareSheet: 0
    // });
  },
  onShareAppMessage(data) {
    // 当页面被分享时会进入这个回调
    // 返回一个对象，作为小程序处理分享的参数，对象内容和小程序页面 onShareAppMessage 回调可返回对象内容基本一致，具体可参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object
    return {
      title: "赢了我，就能赢钱",
      path: this.route // 这里的 path 是页面 url，而不是小程序路由
    };
  },
  generateBook() {
    wx.request({
      url: `${getApp().SERVER}/challenge/createrQRCode`,
      data: {
        page: null,
        id: null
      },
      method: "POST",
      success(res) {
        console.log(res);
      }
    });

    this.setData({
      showBook: 1,
      showShareSheet: 0
    });
  },
  hideBook() {
    this.setData({
      showBook: 0
    });
  }
});