//start.js

import { Token } from '../../utils/token.js';
var app = getApp()
var token = new Token()
Page({
  data: {
    authBtn:false
  },
  onLoad: function () {
  },
  onShow: function () {
    if(app.data.authBtn) this.setData({
      authBtn:true
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  getUserInfo: function (res) {
    console.log(res)
    wx.showLoading({
      title: '加载中^_^',
      mask: true
    })
    if (res.detail.rawData) {
      var userInfo = JSON.parse(res.detail.rawData)
      wx.setStorageSync('userInfo', userInfo)
      token.verify(this.goIndex)
    }else{
      wx.hideLoading()
    }
  },
  map: function () {
    wx.openLocation({
      latitude: 25.816400,
      longitude: 98.856000,
      address: '云南省怒江州泸水市怒江大道山水蓝岸二期商铺2-S-3号',
      name: '塬仓',
      scale: 28
    })
  },
  openSetting:function(res){
    console.log(res)
  }

});