/*
 * @Author: kylin.fuyonglin  
 * @Last Modified by:   kylin.fuyonglin 
*//**
 * 微信api封装
 */

module wxapi {
    export class WxSDK {
        public static Default: WxSDK = new WxSDK();
        public shareTicket: any = null;
        public BannerAds = new Array();
        public loginTimes = 0;
        public num = 1;
        public isLogined: boolean = false;
        public isAllow: boolean = true;
        public opensettingBtn;


        public writeLocalData(key, value, callback: Function = null) {
            if (callback == null) {
                Laya.Browser.window.wx.setStorageSync(key, value);
            } else {
                Laya.Browser.window.wx.setStorage({ key: key, data: value, success: callback });
            }
        }

        public getNetworkType() {
            return Laya.Browser.window.wx.getNetworkType({
                success: function (res) {
                    return res.networkType;
                }
            })
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

        public getMenuButtonBoundingClientRect(): any {
            return Laya.Browser.window.wx.getMenuButtonBoundingClientRect();
        }

        //内存警告
        public MemoryWarn(callback: Function) {
            Laya.Browser.window.wx.onMemoryWarning(callback);
        }

        //息屏
        public setKeepScreenOn(): void {
            Laya.Browser.window.wx.setKeepScreenOn({
                keepScreenOn: true
            })
        }


        //微信强制版本重启
        public ForceUpdate() {
            const updateManager = Laya.Browser.window.wx.getUpdateManager()

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log("是否有新版本", res.hasUpdate)
            })

            updateManager.onUpdateReady(function () {
                Laya.Browser.window.wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success(res) {
                        if (res.confirm) {
                            //Laya.MiniAdpter.removeAll();
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })

            updateManager.onUpdateFailed(function () {
                // 新版本下载失败
            })
        }


        //加载字体
        public loadwxFont(fontName: string, fun: Function, caller: Object) {
            let fntPath = wxapi.WxSDK.Default.readLocalData("Font");
            let Name = null;
            if (!fntPath) {
                let fs = Laya.Browser.window.wx.getFileSystemManager();
                Laya.Browser.window.wx.downloadFile({
                    url: Laya.URL.basePath + fontName,
                    success: function (res) {
                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                        if (res.statusCode === 200) {
                            Logger.log("下载后的路径", res.tempFilePath);
                            fs.saveFile({
                                tempFilePath: res.tempFilePath,
                                filePath: laya.wx.mini.MiniFileMgr.fileNativeDir + "/" + fontName,
                                success: function (res1) {
                                    Logger.log("本地存储路径:", res1.savedFilePath);
                                    Name = Laya.Browser.window.wx.loadFont(res1.savedFilePath);
                                    wxapi.WxSDK.Default.writeLocalData("Font", res1.savedFilePath);
                                    fun.apply(caller, [Name]);
                                },
                                fail: function (res2) {
                                    Logger.log("字体加载失败", res2.errMsg);
                                    Name = "Microsoft YaHei";
                                    fun.apply(caller, [Name]);
                                }
                            })
                        }
                    },
                    fail: function (res) {
                        Name = "Microsoft YaHei";
                        fun.apply(caller, [Name]);
                    },
                })
            } else {
                Name = Laya.Browser.window.wx.loadFont(fntPath);
                if (!Name) {
                    Name = "Microsoft YaHei";
                }
                fun.apply(caller, [Name]);

            }
        }

        public sendFontToSub() {
            let msg = {
                tag: "font",
                font: fontName
            };
            let strMsg = JSON.stringify(msg);
            wxapi.WxRankList.Default.sendMsgToSub(strMsg);
        }
        /**
         * 数据上报接口,权利游戏专用,其他渠道覆盖此方法
         * @param hotTag  形式:
         */
        public subDataToServer(hotTag: string) {
            if (useWXSDK) {
                TGMiniApp.tcssReport({
                    domainName: 'quanyou.qq.com',
                    appId: 'wx7f0631a583185758',
                    hotTag: hotTag,
                    success: (res, tcss) => {
                        console.log('上报成功', res, tcss);
                    },
                    fail: (res, tcss) => {
                        console.log('上报失败', res, tcss);
                    },
                    complete: (res, tcss) => {
                        console.log('上报结束', res, tcss);
                    }
                });
            }

        }

        /**
         * 音频播放接口
         * @param url 音频地址
         * @param autoPlay 是否自动播放 
         * @param loop 是否循环播放
         * @param replayOnShow 是否在回到前台后自动播放 
         */
        public createAndPlaySound(url: string, autoPlay: boolean = false, loop: boolean = false, replayOnShow: boolean = false) {
            var audio = Laya.Browser.window.wx.createInnerAudioContext();
            var wx = Laya.Browser.window.wx;
            audio.autoPlay = autoPlay;
            audio.loop = loop;
            audio.src = url;
            if (replayOnShow) {
                wx.onShow(function () { audio.play(); });
            }

            return audio;
        }

        //音频设置
        public setInnerAudioOption(mixWithOther: boolean, obeyMuteSwitch: boolean, success: Function = null, fail: Function = null, complete: Function = null, callObj: Object = null) {
            Laya.Browser.window.wx.setInnerAudioOption(
                {
                    mixWithOther: mixWithOther,
                    obeyMuteSwitch: obeyMuteSwitch,
                    success: function () {
                        if (callObj) {
                            success.call(callObj);
                        }
                    },
                    fail: function () {
                        if (callObj) {
                            fail.call(callObj);
                        }
                    },
                    complete: function () {
                        if (callObj) {
                            complete.call(callObj);
                        }
                    }
                }
            );
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
                        if (res.shareTicket) {
                            this.shareTicket = res.shareTicket;
                        }
                        callback.call(caller, res.shareTicket);
                    }
                }
            )
        }

        //游戏预约接口
        public gameBook(noticeid: number, cmd: string, device: number, openId: string, sesskey: string, callback: Function, caller: Object) {
            let msg = {
                noticeid: noticeid,
                cmd: cmd,
                device: device,
                openid: openId,
                session_key: sesskey,
            }

            Logger.log("预约接口上传数据", msg);
            Laya.Browser.window.wx.request({
                url: "https://game.weixin.qq.com/cgi-bin/actnew/appletappointment",
                method: "GET",
                data: msg,
                fail: function (res) {
                },
                success: function (res) {
                    if (callback) {
                        callback.call(caller, res.data);
                    }
                    Logger.log("预约成功回来的数据：" + JSON.stringify(res.data));
                }
            });
        }


        /**
         * 现在使用居中低页设计,left,top经过计算得出,如果要修改,根据适配模式进行修改计算方式
         * @param adUnitId 广告后台ID
         * @param left 左上角横坐标
         * @param top 左上角纵坐标
         * @param width 宽度
         * @param errCall 拉取失败回调
         * @param successCall 拉取成功回调
         * @param listener 回调监听者
         */
        public createBannerAd(adUnitId, left, top, width, height, errCall, successCall, listener) {
            let winSize = Laya.Browser.window.wx.getSystemInfoSync();
            let bannerAd = Laya.Browser.window.wx.createBannerAd({
                adUnitId: adUnitId,
                // style: {
                //     left: left,
                //     top: top,
                //     width: width
                // },
                //广告条居中
                style: {
                    left: (winSize.screenWidth - width) / 2,
                    top: winSize.screenHeight - height,
                    width: width,
                }
            });
            bannerAd.onError(err => {
                console.log(err)
                if (listener && errCall) {
                    errCall.call(listener);
                }

            });
            bannerAd.onLoad(() => {
                if (listener && successCall) {
                    successCall.call(listener);
                }
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
                if (listener && errCall) {
                    errCall.call(listener);
                }
            });
            video.onLoad(() => {
                if (listener && successCall) {
                    successCall.call(listener);
                }
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

        /**网络状态变化监听 */
        public onNetWorkStatusChange(fuc: Function, caller: Object) {
            Laya.Browser.window.wx.onNetworkStatusChange(function (res) {
                fuc.call(caller, res.isConnected, res.networkType);
            })
        }

        /**获取网络状态 */
        public getNetWorkType() {
            Laya.Browser.window.wx.getNetworkType({
                success(res) {
                    return res.networkType;
                }
            })
        }

        /**微信提示 */
        public showToast(title: string, icon: string = "none", duration = 1500, mask = false) {
            Laya.Browser.window.wx.showToast(
                {
                    title: title,
                    icon: icon,
                    duration: duration,
                    mask: mask
                }
            )
        }

        public exitProgram() {
            Laya.Browser.window.wx.exitMiniProgram();
        }

        /**检查登陆 */
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

        /**创建登陆按钮 */
        createLoginBtn(handle: Laya.Handler): void {
            if (Laya.Browser.onMiniGame) {
                let deviceInfo = wxapi.WxSDK.Default.deviceInfo();
                let y = miniApp.Config.SCREEN_HEIGHT - 200;
                let x = 200;
                let wxloginBtn = Laya.Browser.window.wx.createUserInfoButton({
                    type: 'image',
                    image: Laya.URL.basePath + "shouquan1.png",
                    style: {
                        left: x / miniApp.Config.SCREEN_WIDTH * deviceInfo.screenWidth,
                        top: y / (miniApp.Config.SCREEN_WIDTH * deviceInfo.screenHeight / deviceInfo.screenWidth) * deviceInfo.screenHeight,
                        width: 242 / miniApp.Config.SCREEN_WIDTH * deviceInfo.screenWidth,
                        height: 70 / (miniApp.Config.SCREEN_WIDTH * deviceInfo.screenHeight / deviceInfo.screenWidth) * deviceInfo.screenHeight,
                    }
                })
                /**监听用户信息按钮的点击事件 */
                wxloginBtn.onTap(() => {
                    Laya.Browser.window.wx.getSetting({
                        success: function (res) {
                            var authSetting = res.authSetting
                            if (authSetting['scope.userInfo'] === true) {
                                wxloginBtn.destroy();//隐藏按钮
                                WxSDK.Default.login(handle);
                            }
                        }
                    });
                });
            }
        }

        /**微信登陆 */
        public login(handle: Laya.Handler): void {
            Laya.Browser.window.wx.login({
                fail: function (res) {
                    if (this.loginTimes < 3) {
                        wxapi.WxSDK.Default.checkLogin(handle);
                        this.loginTimes++;
                    } else {
                        wxapi.WxSDK.Default.showToast("微信登录失败,请重启游戏再试");
                    }
                },
                success: function (loginRes) {
                    wxapi.WxRankList.Default.getRankView();
                    Laya.Browser.window.wx.getUserInfo({
                        success: function (res) {
                            //第一套登录方案
                            //======================================================================================
                            // //登录自己的服务器
                            // let message = new CS_UserLogin();
                            // message.code = loginRes.code;
                            // message.nickName = res.userInfo.nickName;
                            // message.avatarUrl = res.userInfo.avatarUrl;
                            // let info = wxapi.WxSDK.Default.getLanchInfo();
                            // if (!info || !info.query || !info.query.key) {
                            //     message.inviteId = null;
                            // } else {
                            //     message.inviteId = info.query.key;
                            // }
                            // UserProto.instance().requestUserLogin(message);
                            // wxapi.WxRankList.Default.sendShareTicket(info.shareTicket);
                            // this.shareTicket = info.shareTicket;
                            // if (handle) {
                            //     handle.run();
                            // }
                            //第二套登录方案
                            //======================================================================================
                            // //没有玩家数据时可使用微信模块
                            let message = new CS_UserLogin_Version2();
                            message.code = loginRes.code;
                            WXGame.User.nickName = res.userInfo.nickName;
                            WXGame.User.iconUrl = res.userInfo.avatarUrl;

                            let info = wxapi.WxSDK.Default.getLanchInfo();

                            if (!info || !info.query || !info.query.key) {
                                WXGame.User.inviteId = null;
                            } else {
                                WXGame.User.inviteId = info.query.key;
                            }
                            UserProto.instance().requestUserLogin_2(message);
                            wxapi.WxRankList.Default.sendShareTicket(info.shareTicket);
                            this.shareTicket = info.shareTicket;
                            if (handle) {
                                handle.run();
                            }

                        }
                    });

                }
            });
        }

        //发送自己的数据到子域
        public sendMyUser(user: UserInfo, player: PlayerInfo) {
            let msg = {
                tag: "login",
                nickName: player.nickName,
                iconUrl: player.avatarUrl,
                openID: user.openID

                //暂时用三个假数据
                //nickName: "美猴王",
                //iconUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIpkMtkE…F1ngOwZuKZXJ31ibfSjsjYoXXYX8pHHXYsSKgPXhv0tYA/132",
                //iconUrl: "rank/icon_no1.png",
                //openID: "oFTlK5LW4ui_A1S6eR1xoteWmgwo"
            }
            wxapi.WxRankList.Default.sendMsgToSub(JSON.stringify(msg));
        }


        public sendMsg(msg, callback: Function, failcallback: Function, listener: Object) {
            //url+/api/+pt名
            let url_ = GameConfig.gameUrl + "/api/" + msg.pt;
            msg.uid = WXGame.User.uid;
            msg.token = WXGame.User.token;
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
                        query: "key=" + UserManager.instance().getUserOpenId(),
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

        //开启页面转发按钮
        public showShareMenu() {
            Laya.Browser.window.wx.showShareMenu({
                withShareTicket: true
            })
        }

        //转发按钮监听
        public onShareAppMessage(_title: string, _url: string) {
            Logger.log("右上角转发", _url);
            Laya.Browser.window.wx.onShareAppMessage(() => ({
                title: _title,
                imageUrl: _url,
                query: "key=" + UserManager.instance().getUserOpenId(),
            }))
        }


        /**保存图片到本地 */
        public saveImageToPhotos(url, handle: Laya.Handler) {
            //获取相册授权
            var DownloadFile = WxSDK.Default.DownloadFile;
            var createOpenSettingButton = WxSDK.Default.createOpenSettingButton;
            Laya.Browser.window.wx.getSetting({
                success(res) {
                    Logger.log(res.authSetting['scope.writePhotosAlbum'])
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        Laya.Browser.window.wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                Logger.log('授权成功')
                                DownloadFile(url);
                            },
                            fail() {
                                Logger.log("授权失败")
                                // if (wxapi.WxSDK.Default.isAllow == false) {
                                //     // wxapi.WxSDK.Default.showToast("您已拒绝授权，如需授权请跳转转设置界面")
                                //     //wxapi.WxSDK.Default.createOpenSettingButton(url);
                                //     handle.run();//执行传进来的handle
                                //     return;
                                // }
                                // wxapi.WxSDK.Default.isAllow = false;
                                handle.run();//执行传进来的handle
                            }
                        })
                    } else {
                        Logger.log('已授权过，直接下载')
                        DownloadFile(url);
                    }
                }
            })
        }

        /**创建打开设置按钮 */
        createOpenSettingButton(url: string): void {

            var DownloadFile = WxSDK.Default.DownloadFile;
            if (Laya.Browser.onMiniGame) {
                // let sysInfo = Laya.Browser.window.wx.getSystemInfoSync();
                // let width = sysInfo.screenWidth;
                // let height = sysInfo.screenHeight;

                // let sdkVersion = sysInfo.SDKVersion;
                // let y = 760 * (height / Laya.stage.height);

                // let w = 279 * (width / Laya.stage.width);
                // let h = 96 * (height / Laya.stage.height);
                // let x = (width - w) / 2;

                Logger.log("创建设置按钮")

                let x = 339
                let y = 578 + GameConfig.Hoffset;

                let deviceInfo = wxapi.WxSDK.Default.deviceInfo();

                wxapi.WxSDK.Default.opensettingBtn = Laya.Browser.window.wx.createOpenSettingButton({
                    type: 'image',
                    //text: '打开设置页面',
                    image: Laya.URL.basePath + "SoldierStore/transparent.png",
                    style: {
                        // left: x,
                        // top: y,
                        // width: w,
                        // height: h,
                        // lineHeight: h,
                        // backgroundColor: '#ff0000',
                        // color: '#dddddd',
                        // textAlign: 'center',
                        // fontSize: 18,
                        // borderRadius: 4
                        left: x / miniApp.Config.SCREEN_WIDTH * deviceInfo.screenWidth,
                        top: y / (miniApp.Config.SCREEN_WIDTH * deviceInfo.screenHeight / deviceInfo.screenWidth) * deviceInfo.screenHeight,
                        width: 207 / miniApp.Config.SCREEN_WIDTH * deviceInfo.screenWidth,
                        height: 60 / (miniApp.Config.SCREEN_WIDTH * deviceInfo.screenHeight / deviceInfo.screenWidth) * deviceInfo.screenHeight
                    }
                })
                /**监听用户信息按钮的点击事件 */
                wxapi.WxSDK.Default.opensettingBtn.onTap((res) => {
                    //this.opensettingBtn.destroy();//隐藏按钮
                    var res2 = res;
                    DownloadFile(url)
                });
            }

        }

        // HideSettingButton():void{
        //      wxapi.WxSDK.Default.opensettingBtn.destory();
        // }

        /**下载图片 */
        DownloadFile(url): void {

            var imgSrc = url;
            Laya.Browser.window.wx.downloadFile({
                url: imgSrc,
                success: function (res) {
                    //图片保存到本地
                    Laya.Browser.window.wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (data) {
                            Logger.log("保存成功");

                            let index = mobilesystem.indexOf("IOS");
                            Logger.log("666666666666666666666", index)
                            if (index == -1) {
                                wxapi.WxSDK.Default.showToast("保存成功");
                            }
                        },
                        fail: function (err) {
                            Logger.log(err);
                            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                                Logger.log("用户再次拒绝授权")
                            }
                        }
                    })
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
                                query: "key=" + UserManager.instance().getUserOpenId(),
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
        public quitGame() {
            Laya.Browser.window.wx.exitMiniProgram({
                success: function () {

                },
                fail: function () {
                    console.log("退出游戏失败");
                },
                complete: function () {

                }
            });
        }
    }

    export class WxRankList {
        private static RankViewName = "RankView";
        private static SmallRankViewName = "SmallRankViewName";
        private _subTexture: Laya.Texture;
        private _subCount: number = 0;
        private _rankView: Laya.View;
        private _btnCloseView: Laya.View;

        public constructor() {
            this._subCount = 0;
        }
        private _subContextSprite: Laya.Sprite;
        private subContextSprite: Laya.Sprite[];
        public static Default: WxRankList = new WxRankList();

        public writeRecord(level: number, score: number) {
            var kvDataList = new Array();
            let date = new Date().getTime();
            var myValue = JSON.stringify({
                "wxgame": {
                    "level": level,
                    "update_time": date.toString(),
                }
            });
            kvDataList.push({ key: "level", value: myValue });

            myValue = JSON.stringify({
                "wxgame": {
                    "score": score,
                    "update_time": date.toString(),
                }
            });
            kvDataList.push({ key: "score", value: myValue });


            Laya.Browser.window.wx.setUserCloudStorage({
                KVDataList: kvDataList,
                success: r => {
                }
            })
        }

        public sendMsgToSub(strData: string) {
            if (isLowPhone) {
                return;
            }
            if (Laya.Browser.onMiniGame) {
                Laya.Browser.window.wx.getOpenDataContext().postMessage({
                    message: strData,
                })
            }
        }

        public initOpenDataContext() {
            //wxapi.WxRankList.Default.getRankView()
            Laya.Browser.window.sharedCanvas.width = miniApp.Config.SCREEN_WIDTH;
            Laya.Browser.window.sharedCanvas.height = miniApp.Config.SCREEN_HEIGHT;
            Laya.timer.once(1000, this, e => {
                WxRankList.Default.sendMsgToSub(JSON.stringify({ tag: "setSize", data: { width: Laya.stage.width, height: Laya.stage.height, matrix: Laya.stage._canvasTransform } }));
            }, null, false);
        }

        /**发送Hratio到子域 */
        public sendHratioToSud(hratio: number) {

            let msg = {
                tag: "sendHratioToSud",
                Hratio: hratio
            };
            let strMsg = JSON.stringify(msg);
            this.sendMsgToSub(strMsg);

        }

        private _readyRankListView(subView: Laya.Node, pnlView: Laya.Node, callback: Function, posx: number = 0, posy: number = 0, isAways: boolean = false): void {
            if (isLowPhone) {
                return;
            }
            if (Laya.Browser.onMiniGame) {
                if (this._subCount == 0) {
                    console.log("开始渲染子域" + this._subCount);
                    Laya.timer.once(0, this, () => {
                        this._subTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                        //this._subTexture.bitmap.alwaysChange = true;
                        this._subContextSprite = new Laya.Sprite();
                        this._subContextSprite.size(miniApp.Config.SCREEN_WIDTH, miniApp.Config.SCREEN_HEIGHT);
                        this._subContextSprite.pos(posx, posy);
                        Logger.log("子域图片位置：", this._subContextSprite.x, this._subContextSprite.y)
                        this._subContextSprite.graphics.drawTexture(this._subTexture, 0, 0, miniApp.Config.SCREEN_WIDTH, miniApp.Config.SCREEN_HEIGHT);
                        this.reloadCanvas();
                        Laya.timer.frameLoop(5, this, this.reloadCanvas);
                        if (isAways) {
                            Laya.timer.loop(5000, this, this.stopDraw);
                        }

                        if (pnlView) {
                            pnlView.addChild(this._subContextSprite);
                        } else {
                            Laya.stage.addChild(this._subContextSprite);
                        }
                        if (subView) {
                            this._subContextSprite.addChild(subView);
                            // btnView.addChild(this._subContextSprite);
                        }

                        callback.call(wxapi.WxRankList.Default);
                    });
                } else {
                    callback.call(wxapi.WxRankList.Default);
                }
            }
        }


        /**
         * 重新渲染cavans界面
         */
        private reloadCanvas(): void {
            var bitmap = this._subTexture.bitmap;
            var func = bitmap._source && bitmap.reloadCanvasData;
            func && func.call(bitmap);
        }

        private stopDraw(): void {
            Laya.timer.clear(this, this.reloadCanvas);
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
                Laya.timer.clear(this, this.stopDraw);
                Laya.timer.clear(this, this.reloadCanvas);
                this._subContextSprite.removeSelf();
                this._subContextSprite.destroy(true);
                this._subContextSprite = null;
            }

            // if (this._subTexture) {
            //     this._subTexture.bitmap.alwaysChange = false;
            // }
        }

        public showMyRank(subView: Laya.Node, pnlView: Laya.Node, posx: number = 100, posy: number = 100): void {
            //wxapi.WxRankList.Default.getRankView()
            let msg = {
                tag: "showMyRank",
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

        public closeMyRank() {
            this._removeSubContextSprite()
            this.sendMsgToSub(JSON.stringify({ tag: "closeMyRankView" }));
        }

        /**展示好友排行榜 */
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

        /**展示通关成功的提示 */
        public showSuccLevTips(subView: Laya.Node, pnlView: Laya.Node, posx: number = 100, posy: number = 100): void {

            Logger.log("展示通关成功的提示")
            let msg = {
                tag: "showSuccLevTips",
                //curLevel: level,
                x: 250,
                y: 400
            };
            let strMsg = JSON.stringify(msg);
            this._readyRankListView(null, pnlView, e => {
                this._subCount++;
                this._subContextSprite.mouseEnabled = false;
                this.sendMsgToSub(strMsg);
            }, posx, posy);
        }




        /**
         * 渲染子域(特意写的方法,展示右上角头像)
         * @param subView 
         * @param pnlView 
         * @param posx 
         * @param posy 
         */
        public shareSubTexture(subView: Laya.Node, pnlView: Laya.Node, posx: number = 100, posy: number = 100, level: number): void {

            if (isLowPhone) {
                return;
            }
            if (UseSub) {
                Logger.log("渲染右上角头像")
                let msg = {
                    tag: "shareSubTexture",
                    curLevel: level,
                    x: 250,
                    y: 400
                };
                let strMsg = JSON.stringify(msg);
                this._readyRankListView(null, null, e => {
                    this._subCount++;
                    this._subContextSprite.mouseEnabled = false;
                    this.sendMsgToSub(strMsg);
                }, posx, posy);
            }
        }

        /**展示超越好友 */
        public showOverFriView(subView: Laya.Node, pnlView: Laya.Node, posx: number = 100, posy: number = 100): void {
            //wxapi.WxRankList.Default.getRankView()
            Logger.log("展示超越好友")
            //打开超越好友界面时先把右上角好友头像关闭

            let msg = {
                tag: "showOverFriView",
                x: 320,
                y: 380
            };
            let strMsg = JSON.stringify(msg);
            this._readyRankListView(subView, pnlView, e => {
                this._subCount++;
                this._subContextSprite.mouseEnabled = false;
                this.sendMsgToSub(strMsg);
            }, posx, posy);
            //this.sendMsgToSub(strMsg);
        }
        /**关闭超越好友 */
        public closeOverFriView(): void {
            this._removeSubContextSprite()
            this.sendMsgToSub(JSON.stringify({ tag: "closeOverFriView" }));
            //关闭好友超越时再打开右上角好友头像
            let level = LevelManager.instance().CurLevel;
            this.shareSubTexture(null, null, 0, 0, level);
        }
        /**关闭好友头像 */
        public closeFriendPhoto(): void {
            if (UseSub) {
                Logger.log("关闭右上角头像")
                this._removeSubContextSprite()
                this.sendMsgToSub(JSON.stringify({ tag: "closeFriendPhoto" }));
            }
        }



        /**关闭子域界面 */
        public closeSubView(): void {
            this._removeSubContextSprite();
            this.sendMsgToSub(JSON.stringify({ tag: "closeSubView" }));
        }

        /**发送当前关卡 */
        public sendCurLevel(level, score) {
            let msg = {
                tag: "sendMyCurLevel",
                curLevel: level,
                curScore: score,
                x: 320,
                y: 500
            }
            this.sendMsgToSub(JSON.stringify(msg));
            Logger.log("发送当前关卡:", level)
        }

        /**展示当前关卡 */
        public showMyCurLevel(level, score) {
            if (isLowPhone) {
                return;
            }
            if (UseSub) {
                let msg = {
                    tag: "showMyCurLevel",
                    x: 320,
                    y: 500
                }
                this.sendMsgToSub(JSON.stringify(msg));
                Logger.log("展示当前关卡:", level)
            }
        }
        /**发送通关成功的通知 */
        public sendSuccLevel(level) {
            let msg = {
                tag: "succLevel",
                curLevel: level,
                x: 320,
                y: 500
            }
            this.sendMsgToSub(JSON.stringify(msg));
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
            //wxapi.WxRankList.Default.getRankView()
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
        public showNextFriendView(subView: Laya.Node, pnlView: Laya.Node, score: number = 0, posx: number = 0, posy: number = 0): void {
            //wxapi.WxRankList.Default.getRankView()
            let msg = {
                tag: "showNextFriendsView",
                score: score
            };

            let strMsg = JSON.stringify(msg);
            this._readyRankListView(subView, pnlView, e => {
                this._subCount++;
                this._subContextSprite.mouseEnabled = true;
                this.sendMsgToSub(strMsg);
            }, posx, posy);
        }

        public closeNextFriendView() {
            this._removeSubContextSprite()
            this.sendMsgToSub(JSON.stringify({ tag: "closeNextFriendsView" }));
        }

        public showSmallList(btnView: Laya.View): void {
            let msg = {
                tag: "showSmallRankView",
                openID: UserManager.instance().getUserOpenId(),
                nickName: UserManager.instance().getPlayerNickName(),
                iconUrl: UserManager.instance().getPlayerIcon(),
                myScore: UserManager.instance().getPlayerCurLevel(),
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

