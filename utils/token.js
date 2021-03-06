// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头

const config = require('../config');

class Token {
    constructor() {
      this.verifyUrl = config.baseUrl + 'wechat/login?token=';//登录
      this.tokenUrl = config.baseUrl + 'wechat/auth';//拿token
    }

    verify(callBack) {
        var token = wx.getStorageSync('token');
        if (!token) {
          this.getTokenFromServer(callBack);
        }
        else {
          this._veirfyFromServer(token, callBack);
        }
    }

    _veirfyFromServer(token,callBack) {
     
        var that = this;
        wx.request({
          url: that.verifyUrl + token,
            method: 'GET',
            success: function (res) {
                var code = res.data.code;
                if(code==-1){
                  that.getTokenFromServer(callBack);
                }else{
                  callBack && callBack()
                }
            }
        })
    }

    getTokenFromServer(callBack) {
      var nickName = wx.getStorageSync('userInfo').nickName
      var that  = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method:'POST',
                    data:{
                      code: res.code,
                      nickName: nickName
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success:function(res){
                      if (res.data.code == 0) {
                        wx.setStorageSync("token", res.data.data.token)
                        callBack && callBack()
                      }
                      else {
                        wx.showToast({
                          title: '服务器错误',
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    }
                })
            }
        })
    }
}

export {Token};