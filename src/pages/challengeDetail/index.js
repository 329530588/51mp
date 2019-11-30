import Dialog from "lib/vanui/dist/dialog/dialog";
import Toast from "lib/vanui/dist/toast/toast";
import moment from "moment";

Page({
  data: {
    showShareSheet: 0,
    showBook: 0,
    qrCode: null,
    detail: null // 挑战详情
  },
  async onLoad({ challengeId }) {
    const { session } = await getApp().fetchUserInfo();
    const self = this;

    moment.updateLocale("zh-cn", {
      relativeTime: {
        future: "%s后",
        past: "%s前",
        s: "几秒",
        m: "1 分钟",
        mm: "%d 分钟",
        h: "1 小时",
        hh: "%d 小时",
        d: "1 天",
        dd: "%d 天",
        M: "1 个月",
        MM: "%d 个月",
        y: "1 年",
        yy: "%d 年"
      }
    });
    wx.request({
      url: `${getApp().SERVER}/challenge/details`,
      data: {
        challengeId,
        userId: session
      },
      method: "POST",
      success(res) {
        if (res.statusCode === 200 && res.data.code === 1) {
          // 跳转详情
          const detail = res.data.data;
          detail.challenge.timeLeft = moment(
            detail.challenge.dateStart
          ).fromNow();
          self.setData({
            detail
          });
        } else {
          Toast(res.data.message);
          wx.redirectTo({
            url: "pages/home/index"
          });
        }
      },
      fail(err) {
        Toast("服务器异常");
        wx.redirectTo({
          url: "pages/home/index"
        });
      }
    });
  },
  async deleteChallenge() {
    const { session } = await getApp().fetchUserInfo();
    const self = this;

    wx.showModal({
      title: "提示",
      content: "确定删除挑战吗？",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `${getApp().SERVER}/challenge/delete`,
            data: {
              challengeId: self.data.detail.challenge.uuid,
              userId: session,
              targetId: null
            },
            method: "POST",
            success(res) {
              console.log(res);
              if (res.statusCode === 200 && res.data.code === 1) {
                // 跳转详情
                console.log(res);
              } else {
                Toast(res.data.message);
              }
            },
            fail(err) {
              Toast("服务器异常");
            }
          });
        }
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
  async participateIn() {
    const { session } = await getApp().fetchUserInfo();
    const self = this;

    wx.request({
      url: `${getApp().SERVER}/challenge/add`,
      data: {
        challengeId: self.data.detail.challenge.uuid,
        userId: session
      },
      method: "POST",
      success(res) {
        if (res.statusCode === 200 && res.data.code === 1) {
        } else {
          Toast(res.data.message);
        }
        console.log(res);
      },
      fail(err) {
        Toast("服务器异常");
      }
    });
  },
  async addCardRecord() {
    const { session } = await getApp().fetchUserInfo();
    const self = this;
    let image;

    const addCard = () => {
      wx.request({
        url: `${getApp().SERVER}/user/cardRecord`,
        data: {
          image,
          challengeId: self.data.detail.challenge.uuid,
          userId: session
        },
        method: "POST",
        success(res) {
          console.log(res);
          if (res.statusCode === 200 && res.data.code === 1) {
          } else {
            Toast(res.data.message);
          }
        },
        fail(err) {
          Toast("服务器异常");
        }
      });
    };

    if (self.data.detail.challenge.isImage) {
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          if (res.errMsg !== "chooseImage:ok") return;
          // tempFilePath可以作为img标签的src属性显示图片
          image = res.tempFilePaths[0];
          addCard();
        },
        fail(err) {
          Toast("服务器异常");
        }
      });
    } else {
      addCard();
    }
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
    const self = this;

    wx.request({
      url: `${getApp().SERVER}/challenge/createrQRCode`,
      data: {
        page: null,
        id: self.data.detail.challenge.uuid
      },
      method: "POST",
      success(res) {
        console.log(res);
        if (res.statusCode === 200 && res.data.code === 1) {
        } else {
          Toast(res.data.message);
        }
      },
      fail(err) {
        Toast("服务器异常");
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
