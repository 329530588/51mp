

import { formatTime } from "util/index";

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
    isImage: '1',
    openId: null,
    project: null,
    spbillIp: null,
    totalDays: null
  },
  async onLoad() {
    
  },
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
    wx.request({
      url: `${getApp().SERVER}/challenge/rule`,
      data: {}
    });
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
    this.setData({
      [key]: event.detail
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
        if (res.errMsg !== "chooseImage:ok") return
        // tempFilePath可以作为img标签的src属性显示图片
        self.setData({
          faceImage: res.tempFilePaths[0]
        });
      }
    });
  },
  submitChallenge() {
    const { data } = this;
    // cardStart < cardEnd
    // amount,days,totalDays: number
    wx.request({
      url: `${getApp().SERVER}/challenge/create`,
      data: {
        amount: data.amount,
        cardEnd: data.cardEnd,
        cardStart: data.cardStart,
        creatorId: data.creatorId,
        dateStart: data.dateStart,
        days: data.days,
        description: data.description,
        faceImage: data.faceImage,
        isImage: data.isImage,
        openId: data.openId,
        project: data.project,
        spbillIp: data.spbillIp,
        totalDays: data.totalDays
      },
      method: "POST",
      success(res) {
        console.log(res);
        // 跳转详情
        wx.redirectTo({
          url: `/pages/challengeDetail/index?challengeId=${1}&userId=${1}`
        });
      }
    });
  }
});