//start.js

import { Token } from '../../utils/token.js';
var app = getApp()
var token = new Token()
Page({
  data: {
  },
  onLoad: function () {
  },
  onShow: function () {
  },
  goIndex:function(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  getUserInfo: function (res) {
    wx.showLoading({
      title: '加载中^_^',
      mask: true
    })
    var userInfo = JSON.parse(res.detail.rawData)
    wx.setStorageSync('userInfo', userInfo)
    token.verify(this.goIndex)
  },
  map: function () {
    wx.openLocation({
      latitude: 25.816400,
      longitude: 98.856000,
      address: '云南省怒江州泸水市怒江大道山水蓝岸二期商铺2-S-3号',
      name: '塬仓',
      scale: 28
    })
  }

});