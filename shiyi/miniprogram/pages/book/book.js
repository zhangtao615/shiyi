// pages/book/book.js
const db = wx.cloud.database()
const promiseArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
      book: '',
      contact: '',
      price: '',
      remark: '',
      image:[],
      images: [],
      fileIds: [] 
  },
  nameChange(e){
    this.setData({
      name: e.detail
    })
  },
  priceChange(e) {
    this.setData({
      price: e.detail
    })
  },
  contactChange(e) {
    this.setData({
      contact: e.detail
    })
  },
  remarkChange(e) {
    this.setData({
      remark: e.detail
    })
  },
  submit: function () {

       // 上传多张图片到云存储
      for (let i = 0; i < this.data.images.length; i++) {
        promiseArr.push(new Promise((resolve, reject) => {
          let item = this.data.images[i];
          // 上传图片
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() +'.png', // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              this.setData({
                fileIds:res.fileID
              });
              wx.hideLoading();
              resolve();
            },
            fail: err => {
              wx.hideLoading();
              reject();
            }
          })
        }));
      }
    // 插入到云数据库
    if (this.data.name == null || this.data.contact == null || this.data.images.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请将必要信息填写完整',
      })
    }else{
      Promise.all(promiseArr).then(res => {
        wx.showLoading({
          title: '提交中',
        })
        db.collection('sell').add({
          data: {
            name: this.data.name,
            contact: this.data.contact,
            price: this.data.price,
            remark: this.data.remark,
            fileID: this.data.fileIds,
            image:''
          }
        }).then(res => {
          wx.showToast({
            title: '提交成功',
          })
          wx.switchTab({
            url: '../profile/profile'
          })
        }).catch(err => {
          wx.showToast({
            title: '提交失败',
          })
        })
      });
    }
    

  },
  chooseImageTap: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => { // 箭头函数，作用是改变this指向
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths
        this.setData({
          images: tempFilePath
        });
      }
    })
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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