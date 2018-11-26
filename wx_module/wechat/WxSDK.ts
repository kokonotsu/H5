/**
 * 微信api封装
 */

module wxapi {
    export class WxSDK {
        public static Default: WxSDK = new WxSDK();

        public BannerAds = new Array();
        public writeLocalData(key, value, callback: Function = null) {
            if (callback == null) {
                Laya.Browser.window.wx.setStorageSync(key, value);
            } else {
                Laya.Browser.window.wx.setStorage({ key: key, data: value, success: callback });
            }
        }

        public readLocalData(key): any {
            return Laya.Browser.window.wx.getStorageSync(key);
        }

        public shake(): void {
            Laya.Browser.window.wx.vibrateLong();
        }

        public deviceInfo(): any {
            return Laya.Browser.window.wx.getSystemInfoSync();
        }

        /**
         * 音频播放接口
         * @param url 音频地址
         * @param autoPlay 是否自动播放 
         * @param loop 是否循环播放
         * @param replayOnShow 是否在回到前台后自动播放 
         * @param obeyMuteSwitch 遵循静音设置
         */
        public createAndPlaySound(url: string, autoPlay: boolean = false, loop: boolean = false, replayOnShow: boolean = false, obeyMuteSwitch: boolean = true) {
            var audio = Laya.Browser.window.wx.createInnerAudioContext();
            var wx = Laya.Browser.window.wx;
            audio.src = url;
            audio.play();
            audio.autoPlay = autoPlay;
            audio.loop = loop;
            if (replayOnShow) {
                wx.onShow(function () { audio.play(); });
            }
            audio.obeyMuteSwitch = obeyMuteSwitch;
            return audio;
        }

        //切到后台的事件
        public onHide(callback: Function, caller: Object) {
            Laya.Browser.window.wx.onHide(
                function () {
                    if (callback) {
                        callback.call(caller);
                    }
                }
            )
        }

        //切回前台的事件
        public onshow(callback: Function, caller: Object) {
            Laya.Browser.window.wx.onShow(
                function (res) {
                    if (callback) {
                        console.log("回到前台的信息:" + res.shareTicket);
                        callback.call(caller, res.shareTicket);
                    }
                }
            )
        }


        /**
         * 
         * @param adUnitId 广告后台ID
         * @param left 左上角横坐标
         * @param top 左上角纵坐标
         * @param width 宽度
         * @param errCall 拉取失败回调
         * @param successCall 拉取成功回调
         * @param listener 回调监听者
         */
        public createBannerAd(adUnitId, left, top, width, errCall, successCall, listener) {
            let bannerAd = Laya.Browser.window.wx.createBannerAd({
                adUnitId: adUnitId,
                style: {
                    left: left,
                    top: top,
                    width: width
                }
            });
            bannerAd.onError(err => {
                console.log(err)
                errCall.call(listener);
            });
            bannerAd.onLoad(() => {
                successCall.call(listener);
                console.log('banner 广告加载成功')
            });
            this.BannerAds.push(bannerAd);
            return bannerAd;
        }

        /**
         * 清除所有广告
         */
        public clearAllAd() {
            for (let i = 0; i < this.BannerAds.length; i++) {
                this.BannerAds[i].destory();
                this.BannerAds.pop();
            }
        }

        /**
         * 删除上一条广告
         */
        public destoryLastAd() {
            if (this.BannerAds.length > 0) {
                this.BannerAds[this.BannerAds.length - 1].destory();
                this.BannerAds.pop();
            }
        }

        /**
         * 
         * @param adUnitId 视屏ID
         * @param errCall 拉取广告失败回调
         * @param successCall 拉取广告成功回调
         * @param listener 回调监听者
         */
        public createRewardedVideoAd(adUnitId, errCall = null, successCall = null, listener = null) {
            let video = Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: adUnitId });
            video.onError(err => {
                console.log(err)
                
                //errCall.call(listener);
            });
            video.onLoad(() => {
                //successCall.call(listener);
                console.log('video 广告加载成功')
            });
            return video;
        }

        /**
         * 
         * @param video 想要显示的video
         * @param autoReLoad 是否进行显示失败手动加载
         * @param errCall 显示失败回调
         * @param endCall 看完视屏的回调
         * @param quitCall 退出视屏的回调
         * @param listener 回调的监听者
         */
        public showRewardedVideoAd(video, autoReLoad, errCall = null, endCall = null, quitCall = null, listener = null) {
            if (autoReLoad) {
                video.show()
                    .catch(err => {
                        if (errCall) {
                            errCall.call(listener);
                        }
                        video.load()
                            .then(() => video.show())
                    })
            }
            else {
                video.onError(err => {
                    if (errCall) {
                        errCall.call(listener);
                    }
                    console.log(err)
                })
            }

            video.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    console.log("看完视屏");
                    if (endCall) {
                        endCall.call(listener);
                    }
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log("没看完视屏");
                    if (quitCall) {
                        quitCall.call(listener);
                    }
                }
            })
        }

        public showToast(title:string,icon:string = "none",duration = 1500,mask = false){
            Laya.Browser.window.wx.showToast(
                {
                    title:title,
                    icon:icon,
                    duration:duration,
                    mask:mask
                }
            )
        }


        checkLogin(handle: Laya.Handler): void {
            if (Laya.Browser.onMiniGame) {
                var createLoginBtn = WxSDK.Default.createLoginBtn;
                Laya.Browser.window.wx.getSetting({
                    success: function (res) {
                        var authSetting = res.authSetting
                        if (authSetting['scope.userInfo'] === true) {
                            WxSDK.Default.login(handle);
                        } else if (authSetting['scope.userInfo'] === false) {
                            createLoginBtn(handle);
                        } else {
                            createLoginBtn(handle);
                        }
                    }
                });
            }
        }

        createLoginBtn(handle: Laya.Handler): void {
            if (Laya.Browser.onMiniGame) {
                let sysInfo = Laya.Browser.window.wx.getSystemInfoSync();
                let width = sysInfo.screenWidth;
                let height = sysInfo.screenHeight;

                let sdkVersion = sysInfo.SDKVersion;
                let y = 760 * (height / Laya.stage.height);

                let w = 279 * (width / Laya.stage.width);
                let h = 96 * (height / Laya.stage.height);
                let x = (width - w) / 2;

                let wxloginBtn = Laya.Browser.window.wx.createUserInfoButton({
                    type: 'text',
                    text: '微信登录授权',
                    style: {
                        left: x,
                        top: y,
                        width: w,
                        height: h,
                        lineHeight: h,
                        backgroundColor: '#7f0000',
                        color: '#dddddd',
                        textAlign: 'center',
                        fontSize: 18,
                        borderRadius: 4
                    }
                })

                wxloginBtn.onTap((res) => {
                    wxloginBtn.destroy();//隐藏按钮
                    var res2 = res;

                    WxSDK.Default.login(handle);
                });
            }
        }

        public login(handle: Laya.Handler): void {
            Laya.Browser.window.wx.login({
                fail: function (res) {
                    wxapi.WxSDK.Default.showToast("微信登录失败");
                    //wxapi.WxSDK.Default.checkLogin(handle);
                },
                success: function (res) {
                    wxapi.WxRankList.Default.getRankView();
                    Laya.Browser.window.wx.getUserInfo({
                        success: function (res) {
                            Game.User.nickName = res.userInfo.nickName;
                            Game.User.iconUrl = res.userInfo.avatarUrl;
                            let msg: Object = {
                                pt: "UserLogin", code: res.code,
                                nickName: Game.User.nickName,
                                picUrl: Game.User.iconUrl
                            };
                            //WxSDK.Default.sendMsg(msg, WxSDK.Default.setUerInfo, WxSDK.Default.ConnectFail, WxSDK.Default);
                            let info = wxapi.WxSDK.Default.getLanchInfo();
                            console.log("登录获取到的信息:");
                            console.log(info);
                            wxapi.WxRankList.Default.sendShareTicket(info.shareTicket);
                            handle.run();
                        }
                    });

                }
            });
        }

        public setUerInfo(data) {
            Game.User.uid = data[0].userData.uid;
            Game.User.token = data[0].userData.token;
            Game.User.openID = data[0].userData.openid;
            if (Game.User.needLoad) {
                Game.User.upInfoToSrv();
            }
        }

        public ConnectFail(res) {
        }

        public sendMsg(msg, callback: Function, failcallback: Function, listener: Object) {
            //url+/api/+pt名
            let url_ = miniApp.Config.SERVER_URL + "/api/" + msg.pt;
            msg.uid = Game.User.uid;
            msg.token = Game.User.token;
            Laya.Browser.window.wx.request({
                url: url_,
                method: "POST",
                data: msg,
                fail: function (res) {
                    if (failcallback) {
                        failcallback.call(listener, res);
                    } else {
                        console.log("发送失败");
                    }

                },
                success: function (res) {
                    if (res.statusCode == 200) {
                        if (callback) {
                            callback.call(listener, res.data);
                        }
                        else {
                            console.log("发送成功");
                        }

                    }
                }
            });
        }

        public shareImage(_title: string, _url: string, callback: Function = null): void {
            Laya.Browser.window.wx.updateShareMenu({
                withShareTicket: true,
                success: function (res) {
                    Laya.Browser.window.wx.shareAppMessage({
                        title: _title,
                        imageUrl: _url,
                        query: "key=" + Game.User.nickName,
                        fail: function (r) {
                            if (callback) {
                                callback(false);
                            }
                        },
                        success: function (r) {
                            if (callback) {
                                callback(true);
                            }
                        }
                    });
                }
            })
        }

        public getLanchInfo() {
            return Laya.Browser.window.wx.getLaunchOptionsSync()
        }

        public shareScreen(_title: string = null, _x: number = 0, _y: number = 0, _width: number, _quality: number = 0.7): void {
            let widthScale = Laya.Browser.width * Laya.stage.clientScaleX;
            let heightScale = Laya.Browser.height * Laya.stage.clientScaleY;
            let _originCanvas: Laya.HTMLCanvas = Laya.stage.drawToCanvas(widthScale, heightScale, 0, 0);
            let _shareCanvas = _originCanvas.getCanvas();
            let _height = _width / 5 * 4;
            _shareCanvas.toTempFilePath({
                x: _x,
                y: _y,
                width: _width,
                height: _height,
                fileType: "jpg",
                quality: _quality,
                success: function (data) {
                    Laya.Browser.window.wx.updateShareMenu({
                        withShareTicket: true,
                        success: function (res) {
                            Laya.Browser.window.wx.shareAppMessage({
                                title: _title,
                                imageUrl: data.tempFilePath,
                                fail: function (data) {

                                },
                                success: function (data) {

                                }
                            })
                        }
                    })

                }
            })
        }
    }

    export class WxRankList {
        private static RankViewName = "RankView";
        private static SmallRankViewName = "SmallRankViewName";
        private _subTexture: Laya.Texture;
        private _subCount: number;
        private _rankView: Laya.View;
        private _btnCloseView: Laya.View;

        private constructor() {
            this._subCount = 0;
        }
        private _subContextSprite: Laya.Sprite;
        private subContextSprite: Laya.Sprite[];
        public static Default: WxRankList = new WxRankList();

        public writeScore(score: number, combo: number) {
            var kvDataList = new Array();
            let date = new Date().getTime();
            var myValue = JSON.stringify({
                "wxgame": {
                    "score": score,
                    "update_time": date.toString(),
                }
            });
            var comboNumber = JSON.stringify({
                "wxgame": {
                    "combo": combo,
                    "update_time": date.toString(),
                }
            });


            kvDataList.push({ key: "score", value: myValue });
            kvDataList.push({ key: "combo", value: comboNumber });
            Laya.Browser.window.wx.setUserCloudStorage({
                KVDataList: kvDataList,
                success: r => {
                }
            })
        }

        public writeHigherScore(score: number) {
            Game.User.score = score;
            let msg = {
                tag: "writeHigherScore",
                openID: Game.User.openID,
                nickName: Game.User.nickName,
                iconUrl: Game.User.iconUrl,
                myScore: Game.User.score,
            };
            let strMsg = JSON.stringify(msg);
            this.sendMsgToSub(strMsg);
        }

        public sendMsgToSub(strData: string) {
            if (Laya.Browser.onMiniGame) {
                Laya.Browser.window.wx.getOpenDataContext().postMessage({
                    message: strData,
                })
            }
        }

        public initOpenDataContext() {
            Laya.Browser.window.sharedCanvas.width = miniApp.Config.SCREEN_WIDTH;
            Laya.Browser.window.sharedCanvas.height = miniApp.Config.SCREEN_HEIGHT;
            Laya.timer.once(1000, this, e => {
                WxRankList.Default.sendMsgToSub(JSON.stringify({ tag: "setSize", data: { width: Laya.stage.width, height: Laya.stage.height, matrix: Laya.stage._canvasTransform } }));
            });
        }

        private _readyRankListView(subView: Laya.Node, pnlView: Laya.Node, callback, posx: number = 0, posy: number = 1136): void {
            if (Laya.Browser.onMiniGame) {
                if (this._subCount == 0) {
                    console.log("开始渲染子域" + this._subCount);
                    Laya.timer.once(0, this, function (): void {
                        this._subTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                        this._subTexture.bitmap.alwaysChange = true;
                        this._subContextSprite = new Laya.Sprite();
                        this._subContextSprite.size(miniApp.Config.SCREEN_WIDTH, miniApp.Config.SCREEN_HEIGHT);
                        this._subContextSprite.pos(posx, posy);
                        if (pnlView) {
                            pnlView.addChild(this._subContextSprite);
                        } else {
                            Laya.stage.addChild(this._subContextSprite);
                        }
                        if (subView) {
                            
                            this._subContextSprite.addChild(subView);
                            // btnView.addChild(this._subContextSprite);
                        }
                        this._subContextSprite.graphics.drawTexture(this._subTexture, 0, 0, miniApp.Config.SCREEN_WIDTH, miniApp.Config.SCREEN_HEIGHT);
                        callback();
                    });
                } else {
                    callback();
                }
            }
        }

        private _removeSubContextSprite(): void {
            this._subCount--;
            if (this._subCount < 0) {
                this._subCount = 0;
            }
            if (this._subCount != 0) {
                return;
            }

            if (this._subContextSprite != null) {
                this._subContextSprite.removeSelf();
                this._subContextSprite = null;
            }

            // if (this._subTexture) {
            //     this._subTexture.bitmap.alwaysChange = false;
            // }
        }

        public showRankListView(subView: Laya.Node, pnlView: Laya.Node, posx: number = 100, posy: number = 100): void {
            wxapi.WxRankList.Default.getRankView()
            let msg = {
                tag: "showRankView",
                x: miniApp.Config.RANK_ORIGIN.x, //发给子域,让面板进行移动,需要在子域接收并进行POS操作
                y: miniApp.Config.RANK_ORIGIN.y
            };

            let strMsg = JSON.stringify(msg);
            this._readyRankListView(subView, pnlView, e => {
                this._subCount++;
                this._subContextSprite.mouseEnabled = true;
                this.sendMsgToSub(strMsg);
            }, posx, posy);
        }

        public changeRankView(index) {
            let msg = {
                tag: "changeRankView",
                index: index
            }
            this.sendMsgToSub(JSON.stringify(msg));
        }

        public closeRankListView(): void {
            this._removeSubContextSprite()
            this.sendMsgToSub(JSON.stringify({ tag: "closeRankView" }));
        }

        public hideRankListView(): void {
            this.sendMsgToSub(JSON.stringify({ tag: "hideRankView" }));
        }

        public hideSmallRankView(): void {
            this.sendMsgToSub(JSON.stringify({ tag: "hideSmallRankView" }));
        }

        public sendShareTicket(shareTicket): void {
            let msg = {
                tag: "getShareTicket",
                ticket: shareTicket
            }
            this.sendMsgToSub(JSON.stringify(msg));
        }

        public showThirdListView(SettlementView: Laya.View = new Laya.View(), posx: number = 0, posy: number = 0): void {
            wxapi.WxRankList.Default.getRankView()
            let msg = {
                tag: "showRankThirdView",
                x: miniApp.Config.SCREEN_WIDTH / 2,
                y: 518
            };

            let strMsg = JSON.stringify(msg);
            this._readyRankListView(SettlementView, null, e => {
                this._subCount++;
                this._subContextSprite.mouseEnabled = true;
                this.sendMsgToSub(strMsg);
            }, posx, posy);
        }

        public closeRankThirdView(): void {
            this._removeSubContextSprite()
            this.sendMsgToSub(JSON.stringify({ tag: "closeRankThirdView" }));
        }


        /**
         * 
         * @param subView 覆盖子域的子层级,一般将按钮做上上面
         * @param pnlView 子域的背景层
         * @param posx 子域texure所在的Sprite相对于父级的位置x
         * @param posy 子域texure所在的Sprite相对于父级的位置y
         */
        public showNextFriendView(subView: Laya.Node, pnlView: Laya.Node, score:number = 0, posx: number = 0, posy: number = 0): void {
            wxapi.WxRankList.Default.getRankView()
            let msg = {
                tag: "showNextFriendsView",
                score:score
            };

            let strMsg = JSON.stringify(msg);
            this._readyRankListView(subView, pnlView, e => {
                this._subCount++;
                this._subContextSprite.mouseEnabled = true;
                this.sendMsgToSub(strMsg);
            }, posx, posy);
        }

        public closeNextFriendView()
        {
            this._removeSubContextSprite()
            this.sendMsgToSub(JSON.stringify({ tag: "closeNextFriendsView" }));
        }

        public showSmallList(btnView: Laya.View): void {
            let msg = {
                tag: "showSmallRankView",
                openID: Game.User.openID,
                nickName: Game.User.nickName,
                iconUrl: Game.User.iconUrl,
                myScore: Game.User.score,
                x: miniApp.Config.SMALL_RANK_ORIGIN.x,
                y: miniApp.Config.SMALL_RANK_ORIGIN.y
            };

            let strMsg = JSON.stringify(msg);
            this._readyRankListView(null, null, e => {
                this._subCount++;
                this.sendMsgToSub(strMsg);
            }
            );
        }

        public closeSmallList(): void {
            this._removeSubContextSprite();
            this.sendMsgToSub(JSON.stringify({ tag: "closeSmallRankView" }));
        }

        public getRankView(): void {
            this.sendMsgToSub(JSON.stringify({ tag: "getRankView" }));
        }
    }
}

