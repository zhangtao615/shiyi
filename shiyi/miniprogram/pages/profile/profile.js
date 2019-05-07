// pages/profile/profile.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList:[],
    bookList2: [],
    fileIdList:[],
    images:[],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatordots: true,
    autoplay: true,
    interval: 1000,
    duration: 1000,
    circular: true,
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },
  circular: true,


  onClickItem({ detail = {} }) {
    this.setData({
      activeId: detail.id
    });
  },
  // 分类选择方法
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },

  onClickItem({ detail = {} }) {
    this.setData({
      activeId: detail.id
    });
  },
  onSearch:function(){

  },
  getBookList:function(){
    wx.showLoading({
      title: '加载中',
    })
    db.collection('sell').get({
         success:res => {
           //console.log(res.data),
           this.setData({
             bookList:res.data,
           })
           for (let i = 0; i < res.data.length; i++) {
             if (this.data.fileIdList.length < res.data.length){
               this.setData({
                 fileIdList: this.data.fileIdList.concat(res.data[i].fileID),
               })
             }else{
               break;
             }
           }
           wx.cloud.getTempFileURL({
             fileList: this.data.fileIdList,
             success: res => {
               // get temp file URL 
               for (let i = 0; i < res.fileList.length;i++){
                 this.setData({
                   images: this.data.images.concat(res.fileList[i].tempFileURL)
                 })
               }

               for (let i = 0; i < this.data.bookList.length;i++){
                   this.data.bookList[i].image = this.data.images[i]
               }
              this.setData({
                bookList2:this.data.bookList
              })
               console.log(this.data.bookList2)
             },
             fail: err => {
               // handle error
               console.log(err)
             }
           })
           wx.hideLoading();
         },
           // res.data 是包含以上定义的两条记录的数组
         fail:err=>{
           console.log(err)
           wx.hideLoading();
         }
       })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBookList();  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    this.getBookList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBookList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})