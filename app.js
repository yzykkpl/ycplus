import { Token } from 'utils/token.js';
import { Products } from 'utils/products.js'; 
var products=new Products();
var token = new Token();
App({

  data: {
    product:null,
    allProduct:null,
    allow:true
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
    var that=this;
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
              var dis=that._getDisance(res.latitude, res.longitude, 25.816400, 98.856000)
              if(dis>5000){
                that.data.allow=false;
                wx.showModal({
                  title: '太远啦',
                  content: '您的位置超出服务范围',
                  showCancel:false,
                  success: function (res) {
                  }
                })
              }else {that.data.allow=true}
            }
          })
        }

      }
    })
  },

    _getRad:function (d) { return d * Math.PI / 180; },
    _getDisance:function (lat1, lng1, lat2, lng2) {
      var EARTH_RADIUS = 6378137.0; 
      var radLat1 = this._getRad(lat1);
      var radLat2 = this._getRad(lat2);

      var a = radLat1 - radLat2;
      var b = this._getRad(lng1) - this. _getRad(lng2);

      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000.0;
      return s;
    },
  
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    var that=this;
    token.verify()
    products.getProducts()
    var options = {
      url: 'pay/isOnPay',
      method: 'GET',
      sCallBack: function (res) {
        that.data.onPay=res.data.isOnPay;
        console.log(that.data.onPay)
      }
    }
    products.request(options)
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
