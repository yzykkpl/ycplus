import { Home } from 'index-model.js';
import {Products} from '../../utils/products.js'
var products = new Products()
var home = new Home();
var app=getApp();

Page({

  data: {
   product: [],
   bannerProduct: [],
   newProduct:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this._loadData()
  },

  _loadData(){
    home.getProduct(this.productCB)
  },

  //回调筛选商品
  productCB: function (res) {
    var newProduct=new Array()
    var all=res.data[0].foods
    var that=this
    res.data.shift()//删掉“所有商品"，只留按类目划分的
    // that.setData({
    //   product:res.data
    // })
    var bannerCount=0;
    for(var i =0;i<res.data.length;i++){

      if (res.data[i].type == 3) {
        that.setData({
          bannerProduct: res.data[i].foods
        })
        bannerCount = res.data[i].foods.length
      }
    }
    var count = Math.min(6, all.length - bannerCount);
    for (var i = 0; i < all.length;i++){
      if(all[i].type!=3){
        newProduct.push(all[i])
      }
      if(newProduct.length>=count) break;
    }
    that.setData({
      newProduct: newProduct
    })
       wx.hideLoading()
  },

  onProductsItemTap:function(event){
    var id = home.getDataSet(event,'id')
    wx.navigateTo({
      url:'../product/product?id='+id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title:"主页"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this._loadData()
    //console.log(wx.getStorageSync('allProduct'))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
 
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})