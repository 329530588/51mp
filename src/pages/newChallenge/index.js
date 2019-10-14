import { formatTime } from "util/index";
import Toast from "lib/vanui/dist/toast/toast";

Page({
  data: {
    showDatePicker: false,
    showStartTimePicker: false,
    showEndTimePicker: false,
    minDate: new Date().getTime(),

    displayDate: null,

    amount: null,
    cardEnd: null,
    cardStart: null,
    creatorId: null,
    dateStart: null,
    days: null,
    description: null,
    faceImage: null,
    isImage: "1",
    openId: null,
    project: null,
    spbillIp: null,
    totalDays: null
  },
  async onLoad() {},
  setAmount(value) {
    this.setData({
      amount: value
    });
  },
  setDays(value) {
    this.setData({
      days: value
    });
  },
  setDescription(value) {
    this.setData({
      description: value
    });
  },
  setFaceImage(value) {
    this.setData({
      faceImage: value
    });
  },
  setProject(value) {
    this.setData({
      project: value
    });
  },
  setIsImage(value) {
    this.setData({
      isImage: value
    });
  },
  setTotalDays(value) {
    this.setData({
      totalDays: value
    });
  },

  toggleDateDrawer() {
    this.setData({
      showDatePicker: !this.data.showDatePicker
    });
  },
  toggleStartTimeDrawer() {
    this.setData({
      showStartTimePicker: !this.data.showStartTimePicker
    });
  },
  toggleEndTimeDrawer() {
    this.setData({
      showEndTimePicker: !this.data.showEndTimePicker
    });
  },
  setChallengeData(event) {
    const key = event.target.id;
    const value = key === "description" ? event.detail.value : event.detail;

    this.setData({
      [key]: value
    });
  },
  setDate(event) {
    this.setData({
      showDatePicker: false,
      dateStart: new Date(event.detail).getTime(),
      displayDate: formatTime(new Date(event.detail).getTime())
    });
  },
  setStartTime(event) {
    this.setData({
      showStartTimePicker: false,
      cardStart: event.detail
    });
  },
  setEndTime(event) {
    this.setData({
      showEndTimePicker: false,
      cardEnd: event.detail
    });
  },
  uploadImg(event) {
    const self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        if (res.errMsg !== "chooseImage:ok") return;
        // tempFilePath可以作为img标签的src属性显示图片
        self.setData({
          faceImage: res.tempFilePaths[0]
        });
      }
    });
  },
  async submitChallenge() {
    const { data } = this;
    const { session } = await getApp().fetchUserInfo();
    const {
      amount,
      cardEnd,
      cardStart,
      dateStart,
      days,
      description,
      project,
      faceImage,
      totalDays
    } = data;
    // amount,days,totalDays: number
    if (cardStart >= cardEnd) {
      Toast("开始时间要早于结束时间");
      return;
    }
    if (!(amount > -1 && days > 0 && totalDays > 0)) {
      Toast("金额天数必须大于0");
      return;
    }
    if (
      !(
        amount &&
        cardEnd &&
        cardStart &&
        dateStart &&
        days &&
        description &&
        project &&
        faceImage &&
        totalDays
      )
    ) {
      Toast("请检查信息合理与完整性！");
      return;
    }
    wx.request({
      url: `${getApp().SERVER}/challenge/create`,
      data: {
        amount: +data.amount,
        cardEnd: data.cardEnd,
        cardStart: data.cardStart,
        creatorId: session,
        dateStart: new Date(data.dateStart).format("yyyy-MM-dd hh:mm:ss"),
        days: +data.days,
        description: data.description,
        faceImage: data.faceImage,
        isImage: +data.isImage,
        // openId: data.openId,
        project: data.project,
        // spbillIp: data.spbillIp,
        totalDays: +data.totalDays
      },
      method: "POST",
      success(res) {
        if (res.statusCode === 200 && res.data.code === 1) {
          // 跳转详情
          const {
            challengeId,
            nonceStr,
            timeStamp,
            signType,
            paySign
          } = res.data.data;
          wx.requestPayment({
            timeStamp,
            nonceStr,
            package: res.data.data.package,
            signType,
            paySign,
            success(res) {
              console.log("payment succ:", res);
              wx.redirectTo({
                url: `/pages/challengeDetail/index?challengeId=${challengeId}`
              });
            },
            fail(res) {
              Toast('支付失败');
            }
          });
        } else {
          Toast(res.data.message);
        }
      }
    });
  }
});
