<template>
  <div class="mainbar">
    <!-- <van-nav-bar title="视频编辑" left-text="" right-text="下一步" left-arrow @click-left="onClickLeft" @click-right="onClickRight" /> -->
    <van-nav-bar title="视频编辑" left-text="" left-arrow>
      <template #right>
        <div @click="next" class="btn">
          <span class="btnf">下一步</span>
        </div>
      </template>
    </van-nav-bar>

    <div class="top">
      <van-row type="flex" justify="center">
        <van-col>
          <video
ref="videoPlayer"
class="vid"
type="video/mp4"
preload=""
x-webkit-airplay="true"
airplay="allow"
webkit-playsinline="true"
                 playsinline="true"
x5-video-orientation="portraint"
:src="blobURL"
poster="@/assets/logo.png"></video>
        </van-col>
      </van-row>
    </div>
    <div class="bottom">
      <div class="timebarfoo">{{ currentTime | timeTranslate }}/{{ videoEdit.duration | timeTranslate }}</div>
      <div class="thumbs-wrap">
      <div class="timechange" ref="timechange"></div>

          <div class="line"></div>
        <div class="thumbs" ref="thumbs">
          <div class="dotline" v-if="dotline" :style="{left:dotlines+'px'}"></div>
          <div class="dotline" v-if="dotline2" :style="{left:dotlines2+'px'}"></div>

          <div class="inner" v-if="thumbCount" ref="thumbs-inner">
            <div class="zone" v-for="(item) in redzonerArr" :key="item.id">
              <div class="zoneitem r" :style="{left:item.l,width:item.w}"></div>
            </div>
            <div class="zone" v-for="(item) in gzonerArr" :key="item.id">
              <div class="zoneitem g" :style="{left:item.l,width:item.w}"></div>
            </div>
            <div style="width: 50vw"></div>
            <div class="inner-item" :style="{width:videoUnitWidth+'px'}" v-for="(item, index) in thumbArr" :key="index">
              <div class="mtime">{{ item.mtime }}</div>
            </div>
            <div class="dot"></div>
            <div style="width: 50vw"></div>
          </div>
        </div>
        <div class="operation">
          <div class="icon" @click="muted">
            <img v-if="!videoEdit.muted" src="@/assets/image/createcenter/sound.png" alt="">
            <img v-if="videoEdit.muted" src="@/assets/image/createcenter/soundoff.png" alt="">
            <!-- <van-icon size="18" class-prefix="video-icon" :name="!videoEdit.muted ? 'sound' : 'soundoff'" /> -->
          </div>
          <div class="icon" @click="play">
            <van-icon size="18" class-prefix="video-icon" :name="videoEdit.play ? 'pause' : 'play'" />
          </div>
        </div>
      </div>
      <div v-show="!iscreate" class="bottombar">
        <div @click="create" class="creating">
          <div class="ctext">
            开始制作
          </div>
        </div>
      </div>
      <div v-show="iscreate" class="bottombar">
        <div class="pickdotfoo">
          <div class="batdot" @click="hit">
            <div class="icon-dotbar">
              <img src="@/assets/image/createcenter/hitdot.png" alt="">
            </div>
            <div class="txt">
              打点
            </div>
          </div>
          <div class="batdot2" @click="cancel">
            <div class="icon-dotbar">
              <img src="@/assets/image/createcenter/cancel.png" alt="">
            </div>
            <div class="txt">
              取消
            </div>
          </div>
        </div>
        <div class="timefoo">
          <div class="starttime txt2">
            开始时间<span>{{startTime}}</span>
          </div>
          <div class="endtime txt2">
            结束时间<span>{{endTime}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  name: 'AppLayout',
  data() {
    return {
      show: false,
      blobURL: 'static/media/e9944bff807cf0a4fd57674e46d657ba.6ab932c6.mp4',
      videoState: {
        play: false, // 播放状态
        currentPosition: 0 // 当前播放点距离左边的百分比
      },
      videoEdit: {
        start: 0,
        end: 0,
        duration: 0,
        play: false, // 播放状态
        currentPosition: 0, // 当前播放点距离左边的百分比
        muted: true
      },
      videoDom: null, // video
      thumbsInnerDom: null,
      duration: 0, // 视频总时长
      currentTime: 0, // 视频当前播放时长 = this.videoDom.currentTime
      objectURL: '',
      videoUnit: 0,
      videoUnitWidth: 0, // 每个单元格的快宽度
      videoUnitSecond: 1,
      videoRatio: 0,
      isPortraitVideo: false,
      scrollWidth: 0,
      thumbCount: 0,
      thumbArr: [], // 缩略图数组
      redzoneArr: [{
        endTime: 188.035,
        startTime: 170.035,
        id: '1'
      },
      {
        startTime: 20.666,
        endTime: 30.187,
        id: '2'
      }
      ], // 红色的区域
      redzonerArr: [],
      gzoneArr: [
        {
          endTime: 50.0,
          startTime: 45.035,
          p: 12,
          id: '5'
        },
        {
          endTime: 40.0,
          startTime: 30.035,
          p: 10,
          id: '3'
        },
        {
          startTime: 10.666,
          endTime: 20.187,
          p: 1,
          id: '4'
        }
      ], // 灰色的区域
      gzonerArr: [],
      leftMovePercentage: 0,
      leftMoveInit: 0,
      rightMovePercentage: 0,
      rightMoveInit: 0,
      videoShow: true,
      bfn: null,
      thr: null,
      vw: 0, // 屏幕宽度
      startTime: '00:00',
      endTime: '00:00',
      timearr: [],
      dot: 1,
      dotline: false,
      dotline2: false,
      dotlines: '0',
      dotlines2: '0',
      iscreate: false
    }
  },
  filters: {
    timeTranslate: function(t) {
      // 时间转化
      let m = Math.floor(t / 60)
      m < 10 && (m = '0' + m)
      return m + ':' + ((t % 60) / 100).toFixed(2).slice(-2)
    }
  },
  mounted() {
    const self = this
    this.vw = document.documentElement.clientWidth
    console.log(document.documentElement.clientWidth)
    this.videoDom = this.$refs['videoPlayer']
    this.timechangeDom = this.$refs['timechange']
    this.thumbsInnerDom = this.$refs['thumbs']
    this.thumbsWidth = 50
    this.initMedaData()
    this.$nextTick(() => {
      // this.bfn = this.debounce(this.vs, 200)
      // 节流
      this.thr = this.throttle(this.scrollControl, 50)
      this.thumbsInnerDom.addEventListener('scroll', () => {
        this.thr()
      })
    })
    this.thumbsInnerDom.addEventListener('touchmove', ev => {
      if (!this.handleMoveStatus) return
    })
    this.thumbsInnerDom.addEventListener('touchstart', ev => {
      this.handleMoveStatus = true
      // 暂停播放
      this.videoDom.pause()
      this.videoEdit.play = false
    })
    // 增加手势
    // var pinchImg = document.getElementById('pinchImg')
    var pinchImg = this.timechangeDom
    new this.$finger(pinchImg, {
      pinch: function(evt) {
        // 最大20秒最小1秒
        var num = self.videoUnitSecond
        // 放大
        if (evt.scale > 1) { num = self.videoUnitSecond - 0.4 }
        // 缩小
        if (evt.scale < 1) { num = self.videoUnitSecond + 0.4 }
        if (num < 1) { num = 1 }
        if (num > 20) { num = 20 }
        self.videoUnitSecond = num
      },
      tap: function(e) {
      },
      swipe: function(e) {
      }
    })
  },
  components: {
    // videoPlayer
  },
  watch: {
    videoUnitSecond(val) {
      const self = this
      this.calcthumb()
      // 渲染更新后的指针与色块区域
      this.$nextTick(() => {
        this.redzonerArr = []
        this.gzonerArr = []
        this.calczone(this.redzoneArr, this.redzonerArr)
        this.calczone(this.gzoneArr, this.gzonerArr)
        self.handleMoveStatus = false
        self.thumbsInnerDom.scrollLeft =
            (self.videoDom.currentTime / self.videoEdit.duration) * (self.thumbsInnerDom.scrollWidth - self.vw)
        if (this.dotlines) {
          this.dotlines = ((self.thumbsInnerDom.scrollWidth - self.vw) * (this.videoEdit.start / self.videoEdit.duration) + self.vw / 2)
        }
        if (this.dotlines2) {
          this.dotlines2 = ((self.thumbsInnerDom.scrollWidth - self.vw) * (this.videoEdit.end / self.videoEdit.duration) + self.vw / 2)
        }
      })
    }
  },
  methods: {
    vs() {
    },
    changetime() {
      this.videoUnitSecond = this.videoUnitSecond + 1
    },
    calcthumb() {
      const self = this
      self.thumbCount = self.videoEdit.duration / self.videoUnitSecond // 缩略图个数
      self.videoUnit = self.videoEdit.duration / self.thumbCoun
      // 缩略图
      if (self.thumbArr.length !== self.thumbCount) {
        self.thumbArr = []
        for (let i = 0; i < self.thumbCount; i++) {
          self.thumbArr.push({
            mtime: self.timeTranslate(i * self.videoUnitSecond)
          })
        }
      }
    },
    pinchHandler(evt) {
      console.log(evt.scale)
      console.log('onPinch')
      alert('onPinch')
      this.changetime()
    },
    swipeHandler() {
      alert('onPinch')
    },
    initMedaData() {
      const self = this
      // 初始化video相关事件
      this.videoDom.addEventListener('loadedmetadata', () => {
        // 获取视频总时长
        this.videoEdit.duration = this.videoDom.duration // 视频总时长
        this.videoEdit.end = this.videoEdit.duration
      })
      this.videoDom.addEventListener('canplay', function() {
        // 监听视频可播放时的状态
        self.videoRatio = this.videoHeight / this.videoWidth
        self.isPortraitVideo = self.videoRatio > 1.5 // 是否是竖向视频
        // self.videoUnitWidth = self.isPortraitVideo ? 28 : 88 // 单个缩略图宽度
        self.videoUnitWidth = 50 // 单个缩略图宽度
        self.calcthumb()
        // 渲染红色区域
        if (self.redzonerArr.length === 0) {
          self.calczone(self.redzoneArr, self.redzonerArr)
        }
        // 渲染灰色
        if (self.gzonerArr.length === 0) {
          self.calczone(self.gzoneArr, self.gzonerArr)
        }
      })
      this.videoDom.addEventListener('timeupdate', () => {
        // 监听视频播放过程中的时间
        this.videoEdit.currentPosition = (this.videoDom.currentTime / this.videoEdit.duration) * 100
        this.currentTime = this.videoDom.currentTime
        // 拖动的时候禁止控制滚动条
        if (!this.handleMoveStatus) {
          self.thumbsInnerDom.scrollLeft =
            (this.videoDom.currentTime / this.videoEdit.duration) * (self.thumbsInnerDom.scrollWidth - self.vw)
        }
        if (this.videoEdit.end - this.currentTime < 0.01 && this.videoEdit.play) {
          this.playEnd()
        }
      })
    },
    scrollControl() {
      // 不在播放状态
      console.log(this.thumbsInnerDom.scrollLeft)
      const self = this
      if (this.handleMoveStatus) {
        this.videoDom.currentTime =
          (this.thumbsInnerDom.scrollLeft / (self.thumbsInnerDom.scrollWidth - self.vw)) * this.videoEdit.duration
      }
    },
    next() {
      this.show = true
    },
    handleChange(v) {
      console.log('tab value:', v)
    },
    onClickLeft() { },
    // 方法调用
    tabLanguages(lang) {
      this.$i18n.locale = lang // 切换vue国际化
      this.$Local(lang) // 切换vant
    },
    timeTranslate(t) {
      // 时间转化
      let m = Math.floor(t / 60)
      m < 10 && (m = '0' + m)
      return m + ':' + ((t % 60) / 100).toFixed(2).slice(-2)
    },
    play() {
      this.videoEdit.play ? this.toggleVideoPause() : this.toggleVideoPlay()
    },
    muted() {
      this.videoEdit.muted ? this.toggleVideomutedoff() : this.toggleVideomuted()
    },
    hit() {
      // 第一个点
      this.toggleVideoPause()
      // 判断一下是否在可选区域
      // 已经被人选的区域
      if (this.redzoneArr.some(obj => {
        return obj.startTime < this.currentTime && this.currentTime < obj.endTime
      })) {
        this.$dialog.alert({
          message: '您选择的片段包含已被拍卖使用的片段，请重新选择剪切区域'
          // position: 'top',
          // duration: 2000
        })
        return
      }

      // 第一次打点
      if (this.dot === 1) {
        // 判断是否提交重合
        let p = 0
        this.gzoneArr.forEach(obj => {
          if (obj.startTime < this.currentTime && this.currentTime < obj.endTime) {
            p = obj.p + p
          }
        })
        if (p > 0) {
          this.$dialog.alert({
            message: '您选择的片段已有' + p + '人提交审核，竞争激烈，存在较高审核不通过的风险，请谨慎选择'
            // position: 'top',
            // duration: 2000
          })
        }
        this.dotline = true
        this.dotlines = this.thumbsInnerDom.scrollLeft + this.vw / 2
        this.startTime = this.timeTranslate(this.currentTime)
        this.timearr[0] = this.currentTime
        this.dot = 2
        this.leftMovePercentage = this.dotlines / this.thumbsInnerDom.scrollWidth
        this.videoEdit.start = this.currentTime
      } else {
        // 包含了被人选的区域
        if (this.redzoneArr.some(obj => {
          return this.videoEdit.start < obj.startTime && obj.endTime < this.currentTime
        })) {
          this.$dialog.alert({
            message: '您选择的片段包含已被拍卖使用的片段，请重新选择剪切区域'
            // position: 'top',
            // duration: 2000
          })
          return
        }
        // 必须要大过第一点
        if (this.currentTime < this.videoEdit.start) {
          this.$dialog.alert({
            message: '结束时间需要大过开始时间'
            // position: 'top',
            // duration: 2000
          })
          return
        }
        // 是否包含被人提交的片段
        var p2 = 0
        this.gzoneArr.forEach((obj) => {
          // 选色区域包含灰色区域
          if (this.videoEdit.start < obj.startTime && obj.endTime < this.currentTime) {
            p2 = obj.p + p2
          }
          // 灰色区域包含选择区域
          if (obj.startTime < this.videoEdit.start && this.videoEdit.start < obj.endTime) {
            p2 = obj.p + p2
          }
        })
        console.log(p2)
        if (p2 > 0) {
          this.$dialog.alert({
            message: '您选择的片段已有' + p2 + '人提交审核，竞争激烈，存在较高审核不通过的风险，请谨慎选择'
            // position: 'top',
            // duration: 2000
          })
        }
        // 第二次打点
        this.dotline2 = true
        this.dotlines2 = this.thumbsInnerDom.scrollLeft + this.vw / 2
        this.endTime = this.timeTranslate(this.currentTime)
        this.timearr[1] = this.currentTime
        this.videoEdit.end = this.currentTime
      }
      console.log(this.timearr)
    },
    // 取消打点
    cancel() {
      this.dot = 1
      this.startTime = '00:00'
      this.endTime = '00:00'
      this.timearr = []
      this.dotline = false
      this.dotline2 = false
      this.dotlines = 0
      this.dotlines2 = 0
      this.videoEdit.start = 0
      this.videoEdit.end = this.videoEdit.duration
    },
    // 业务 计算偏移量与宽度
    calczone(Arr, arr2) {
      const self = this
      self.$nextTick(() => {
        for (let i = 0; i < Arr.length; i++) {
          arr2.push({
            l: ((self.thumbsInnerDom.scrollWidth - self.vw) * (Arr[i].startTime / self.videoEdit.duration) + self.vw / 2) + 'px',
            w: ((Arr[i].endTime - Arr[i].startTime) / self.videoUnitSecond) * self.videoUnitWidth + 'px'
          })
        }
        console.log(arr2)
      })
    },
    toggleVideomutedoff() {
      console.log(this.videoDom.muted)
      this.videoDom.muted = false
      console.log(this.videoDom.muted)
      this.videoEdit.muted = false
    },
    toggleVideomuted() {
      console.log(this.videoDom.muted)
      this.videoDom.muted = true
      console.log(this.videoDom.muted)
      this.videoEdit.muted = true
    },
    playEnd() {
      this.videoDom.currentTime = this.videoEdit.start
      this.videoDom.pause()
      this.videoEdit.play = false
    },
    create() {
      this.toggleVideoPlay()
      // this.iscreate = true
    },
    toggleVideoPlay() {
      // 禁止滚动轴控制视频
      this.handleMoveStatus = false
      // 处理当前位置在末尾的时候先初始化开始播放时间
      if (this.videoEdit.end - this.currentTime < 0.01) {
        this.videoDom.currentTime = this.videoEdit.start
      }
      // 为了取消当前点平滑移动到开始点的过渡
      setTimeout(() => {
        this.videoDom.play()
        // 统一静音状态
        this.videoEdit.muted = this.videoDom.muted
        this.videoEdit.play = true
        if (this.iscreate === false) {
          this.toggleVideoPause()
          this.iscreate = true
        }
      }, 50)
    },
    toggleVideoPause() {
      this.videoDom.pause()
      this.videoEdit.play = false
    },
    // 节流
    throttle(fn, threshold, scope) {
      let timer
      return function() {
        const context = scope || this
        const args = arguments
        if (!timer) {
          timer = setTimeout(function() {
            fn.apply(context, args)
            timer = null
          }, threshold)
        }
      }
    },
    debounce(fn, delay) {
      let timer = null // 借助闭包
      return function() {
        if (timer) {
          clearTimeout(timer) // 进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
          timer = setTimeout(fn, delay)
        } else {
          timer = setTimeout(fn, delay) // 进入该分支说明当前并没有在计时，那么就开始一个计时
        }
      }
    },
    getOffset(node, offset) {
      // 获取当前屏幕下进度条的左偏移量和又偏移量
      if (!offset) {
        offset = {}
        offset.left = 0
        offset.top = 0
      }
      if (node === document.body || node === null) {
        return offset
      }
      offset.top += node.offsetTop
      offset.left += node.offsetLeft
      return this.getOffset(node.offsetParent, offset)
    }
  }
}
</script>
<style>
.timechange {
  width: 100%;
  height: 30px;
  /* background: #fff; */
  position: absolute;
  /* top:50px; */
  z-index: 21;
}
body {
  background: #000;
  height: 100%;
  overflow: auto;
  margin: 0;
}
.btn {
  width: 66px;
  height: 30px;
  background: linear-gradient(141deg, #35aaff 0%, #4664ff 100%);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btnf {
  /* width: 42px; */
  height: 18px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 18px;
}
.vid {
  width: 343px;
  border-radius: 8px;
}
.container {
  display: flex;
  justify-content: center;
}
.line {
  position: absolute;
  -webkit-transform: translateZ(0);
  /* width: 3px; */
  /* height: 100px; */
  background: #fff;
  box-shadow: 2px 2px 5px #000;
  z-index: 10;
  top: 30px;
  left: 50%;
  border-radius: 6px;
  width: 1px;
  height: 68px;
  background: #ffffff;
  border-radius: 4px;
}
.thumbs {
  position: relative;
  display: flex;
  align-items: center;
  overflow: auto;
  width: 375px;
  /* width: 375px; */
  height: 108px;
  background: #1a1a1a;
}
.thumbs::-webkit-scrollbar {
  width: 0 !important;
  display: none;
}
::-webkit-scrollbar {
  display: none;
}
.inner {
  position: relative;
  display: flex;
  height: 100%;
}
.inner-item {
  position: relative;
  height: 100%;
  width: 50px;
}
.mtime {
  position: absolute;
  top: 10px;
  /* width: 27px; */
  transform: translateX(-50%);
  height: 12px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 12px;
  z-index: 15;
  /* background: #1a1a1a; */
}
.inner-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.icon {
  /* position: fixed; */
  display: flex;
  width: 50px;
  height: 50px;
  z-index: 10;
  justify-content: center;
  align-items: center;
}
.icon img {
  width: 18px;
  height: 14px;
}
.thumbs-wrap {
  position: relative;
}
.operation {
  display: flex;
  align-items: center;
  width: 68px;
  height: 108px;
  background: #131313;
  z-index: 20;
  position: absolute;
  top: 0;
  box-shadow: 2px 0px 0px #000;
}
.dot {
  height: 3px;
  width: 3px;
  border-radius: 50%;
  background: #fff;
  /* position: absolute; */
  margin-top: 13px;
  /* transform: translateX(50%); */
  margin-right: -1.5px;
}
.bottombar {
  position: relative;
  height: 110px;
  overflow: hidden;
}
.icon-dotbar img {
  width: 24px;
  height: 24px;
}
.txt {
  margin-top: 5px;
  height: 16px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 16px;
}
.pickdotfoo {
  position: absolute;
  top: 25px;
  left: 76px;
  display: flex;
}
.batdot2 {
  margin-left: 55px;
}
.txt2 {
  height: 16px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 16px;
}
.txt2 span {
  margin-left: 10px;
}
.timefoo {
  position: absolute;
  top: 28px;
  left: 253px;
}
.endtime {
  margin-top: 7px;
}
.bottom {
  /* background: #000;
  position: fixed;
  bottom:0 */
}
.mainbar {
  display: flex;
  flex-direction: column;
  /* height: calc( 100vh - 46px ); */
}
.top {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
body,
html,
#app,
.mainbar {
  height: 100%;
}
.dotline {
  position: absolute;
  top: 36px;
  width: 1px;
  height: 44px;
  background: #d86300;
  border-radius: 4px;
}
.timebarfoo {
  height: 16px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 16px;
  margin-bottom: 7px;
  margin-left: 16px;
  position: initial;
}
.zone {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
}
.zoneitem {
  position: absolute;
  top: 0;
  bottom: 0;
  opacity: 0.5;
  width: 100px;
  z-index: 5;
}
.r {
  background: red;
}
.g {
  background: gray;
}
.creating {
  margin: 20px auto;
  width: 240px;
  height: 40px;
  background: linear-gradient(135deg, #37a4ff 0%, #4178ff 100%);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ctext {
  height: 20px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
}
</style>
