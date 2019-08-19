

import { sayHello } from 'util/index'

Page({
  data: {
    searchTxt: 'lalala',
    active: 2, // 0-未开始，1-进行中，2-已结束
  },
  async onLoad() {
    const str = await Promise.resolve(sayHello());
    wx.showToast({
      title: str
    });
  },
  onChangeTab(e) {
    this.setData({
      active: e.detail.index
    })
  }
});