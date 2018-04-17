import { Token } from 'utils/token.js';
import { Products } from 'utils/products.js';
var products=new Products();
var token = new Token();
App({

  data: {
    product:null,
    allProduct:null
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this._verifyLocation();

  },
  //获取userInfo授权
  verifyAuthorize: function (callBack) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo
                  callBack && callBack(userInfo)
                  wx.setStorageSync('userInfo', userInfo)
                  token.verify()
                },
                fail:function(res){
                  callBack && callBack({
                    avatarUrl: '../../images/icon/user@default.png',
                    nickName: '匿名'
                  })

                }
          

              })
            }
          })
        } else {
          wx.getUserInfo({
            success: function (res) {
              var userInfo = res.userInfo
              callBack && callBack(userInfo)
              var userInfo = res.userInfo
              wx.setStorageSync('userInfo', userInfo)
              token.verify()
            },
            fail: function (res) {
              callBack && callBack({
                avatarUrl: '../../images/icon/user@default.png',
                nickName: '匿名'
              })

            }
          })
        }

      }
    })
  },

  _verifyLocation: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  wx.setStorageSync('userLocation', res)
                }
              })
            }
          })
        } else {
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              wx.setStorageSync('userLocation', res)

            }
          })
        }

      }
    })
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    token.verify()
    products.getProducts()
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
