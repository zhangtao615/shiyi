// pages/sold/sold.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myBookList:[],
    myBookList2: [],
    fileIdList: [],
    images: [],
  },
  getMyBookList:function(){
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        wx.showLoading({
          title: '加载中',
        })
        db.collection('sell').where({
          _openid: res.result.openid
        })
          .get({
            success: res => {
              // res.data 是包含以上定义的两条记录的数组
              wx.hideLoading();
              this.setData({
                myBookList:res.data,
              })
              for (let i = 0; i < res.data.length; i++) {
                if (this.data.fileIdList.length < res.data.length) {
                  this.setData({
                    fileIdList: this.data.fileIdList.concat(res.data[i].fileID),
                  })
                } else {
                  break;
                }
              }
              wx.cloud.getTempFileURL({
                fileList: this.data.fileIdList,
                success: res => {
                  // get temp file URL 
                  for (let i = 0; i < res.fileList.length; i++) {
                    this.setData({
                      images: this.data.images.concat(res.fileList[i].tempFileURL)
                    })
                  }

                  for (let i = 0; i < this.data.myBookList.length; i++) {
                    this.data.myBookList[i].image = this.data.images[i]
                  }
                  this.setData({
                    myBookList2: this.data.myBookList
                  })
                },
                fail: err => {
                  // handle error
                }
              })
              wx.hideLoading();
            },
            fail: err => {

              wx.hideLoading();
            }
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    });

    
  },
 delete:function(e){
    db.collection('sell').doc(e.currentTarget.dataset.id).remove({
      success(res) {
        wx.showModal({
          title: 'success',
          content: '删除成功，刷新更新信息',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyBookList();
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
    this.getMyBookList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMyBookList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})