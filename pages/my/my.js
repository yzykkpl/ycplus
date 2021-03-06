import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';
import { Token } from '../../utils/token.js';

var address = new Address();
var order = new Order();
var my = new My();
var token = new Token();
var app = getApp()

Page({
  data: {
    pageIndex: 1,
    isLoadedAll: false,
    loadingHidden: false,
    orderArr: [],
    addressInfo: null
  },
  onLoad: function () {
    this._loadData();
    this._getAddressInfo();
  },

  onShow: function () {
    //更新订单,相当自动下拉刷新,只有非第一次打开 “我的”页面，且有新的订单时 才调用。
    var newOrderFlag = order.hasNewOrder();
    if (this.data.loadingHidden && newOrderFlag) {
      this.onPullDownRefresh();
    }
  },

  _loadData: function () {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo")
    that.setData({
      userInfo: userInfo
    });
    //拿到用户信息
    // app.verifyAuthorize((data) => {
    //   that.setData({
    //     userInfo: data
    //   });

    // });

    this._getOrders();
    order.execSetStorageSync(false);  //更新标志位
  },

  /**地址信息**/
  _getAddressInfo: function () {
    var that = this;
    var addressInfo = wx.getStorageSync('address')
    that._bindAddressInfo(addressInfo);
  },

  /*修改或者添加地址信息*/
  editAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          phone: res.telNumber,
          address: address.setAddressInfo(res)
        };
        if (res.telNumber) {
          that._bindAddressInfo(addressInfo);
          //保存地址
          wx.setStorageSync('address', addressInfo)
        }
        //模拟器上使用
        else {
          that.showTips('操作提示', '地址信息更新失败,手机号码信息为空！');
        }
      },
      fail:function(){
        wx.getSetting({
          success:function(res){
            if (!res.authSetting['scope.address']){
              wx.showModal({
                title: '您已拒绝地址授权',
                content: '请点击右上角"..."->"关于"->右上角"..."->"设置"进行授权',
              })
            }
          }
        })
      }
    })
  },

  /*绑定地址信息*/
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  /*订单信息*/
  _getOrders: function (callback) {
    var that = this;
    var token = wx.getStorageSync('token')
    if (token==""||token==null) {
      this.showTips('错误', '登录信息过期,请重试')
      token.verify()
      return;
    }
    order.getOrders(this.data.pageIndex - 1, token, (res) => {
      var data = res.data;
      that.setData({
        loadingHidden: true
      });
      if (data.length > 0) {
        that.data.orderArr.push.apply(that.data.orderArr, data);  //数组合并
        that.setData({
          orderArr: that.data.orderArr
        });
      } else {
        that.data.isLoadedAll = true;  //已经全部加载完毕
        that.data.pageIndex = 1;
      }
      callback && callback();
    });
  },

  /*显示订单的具体信息*/
  showOrderDetailInfo: function (event) {
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&orderId=' + id
    });
  },

  /*未支付订单再次支付*/
  rePay: function (event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');

    //online 上线实例，屏蔽支付功能
    if (order.onPay) {
      this._execPay(id, index);
    } else {
      this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽');
    }
  },

  /*支付*/
  _execPay: function (id, index) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态
        if (flag) {
          that.data.orderArr[index].payStatus = 1;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到 成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?orderId=' + id + '&flag=' + flag + '&from=my'
        });
      } else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }
    });
  },

  /*下拉刷新页面*/
  onPullDownRefresh: function () {
    var that = this;
    this.data.orderArr = [];  //订单初始化
    this._getOrders(() => {
      that.data.isLoadedAll = false;  //是否加载完全
      that.data.pageIndex = 1;
      wx.stopPullDownRefresh();
      order.execSetStorageSync(false);  //更新标志位
    });
  },


  onReachBottom: function () {
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  //取消订单
  _cancel: function (event) {
    var that = this;
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');
    order.cancel(id, (data) => {
      if (data.code == 0) {
        that.data.orderArr[index].payStatus = -1;
        that.data.orderArr[index].orderStatus = 2;
        that.setData({
          orderArr: that.data.orderArr
        });
        that.onPullDownRefresh()
      } else {
        that.showTips('错误', '取消失败');
      }
    });
  },
  //拨打客服电话
  makePhoneCall:function(){
    var that=this
    wx.makePhoneCall({
      phoneNumber: '13988675253',
      fail:function(){
        that.showTips("客服电话","13988675253")
      }
    })
  }
})