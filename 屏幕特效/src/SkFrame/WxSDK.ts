/**
 * @class JSSDK
 * @constructor
 **/

interface SignPackage {
    appid: string;
    noncestr: string;
    timestamp: number;
    signature: string;
    url: string;
}

class WXSDK extends egret.EventDispatcher {
    public CLASS_NAME: string = "JSSDK";


    private signPackage: SignPackage;
    private url: string;


    /**分享标题*/
    public title: string = "赏金猎魔团-TestDemoV1.0";
    /**分享描述*/
    public desc: string = "根本停不下来啊！骚年！没有什么比这个打钱更刺激的啦！！";
    /**分享链接*/
    public link: string = "#";
    /**分享图片*/
    public imgUrl: string = "http://game.x8yx.com/game/ads/ads2.jpg";




    /**
     * 初始化
     **/
    public init() {

    }

    public WxStart() {
        //你的后端数据JSON入口
        //this.url = "你的后端数据入口，自行配置JSON串，后端语言不限，可以参照PHP/NET程序";
        this.url = "http://game.x8yx.com/gameserver/weixinapi/json.php?url=" + encodeURIComponent(location.href.split("#")[0]);

        //获取签名
        this.getSignPackage();
        Sk_DATA.WeChatSKD = this;
    }

    /**
     * 获取签名分享
     */
    private getSignPackage() {
        var urlloader = new egret.URLLoader();
        var req = new egret.URLRequest(this.url);
        urlloader.load(req);
        req.method = egret.URLRequestMethod.GET;
        urlloader.addEventListener(egret.Event.COMPLETE, (e) => {
            this.signPackage = <SignPackage>JSON.parse(e.target.data);
            //........................................................
            //基本配置
            this.getWeiXinConfig();
            //下面可以加更多接口,可自行扩展
            this.getWeiXinShareTimeline();//分享朋友圈
            this.getWeiXinShareAppMessage(null, null);//分享朋友
            this.getWeiXinShareQQ();//分享QQ
            this.getWeiXinShareWeiBo();//分享到腾讯微博
            //this.getWeixinShowMenuItems(["menuItem:share:timeline"]);//显示菜单项
            // this.getWeixinHideMenuItems();//隐藏菜单项
            //........................................................
        }, this);
    }

    /**
     * 获取微信配置
     */
    private getWeiXinConfig() {
        /*
         * 注意：
         * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
         * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
         * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
         *
         * 如有问题请通过以下渠道反馈：
         * 邮箱地址：weixin-open@qq.com
         * 邮件主题：【微信JS-SDK反馈】具体问题
         * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
         */
        //配置参数
        var bodyConfig = new BodyConfig();

        bodyConfig.debug = false;// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        bodyConfig.appId = this.signPackage.appid;// 必填，公众号的唯一标识
        bodyConfig.timestamp = this.signPackage.timestamp;// 必填，生成签名的时间戳
        bodyConfig.nonceStr = this.signPackage.noncestr;// 必填，生成签名的随机串
        bodyConfig.signature = this.signPackage.signature;// 必填，签名，见附录1
        bodyConfig.jsApiList = [// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            // 所有要调用的 API 都要加到这个列表中
            'checkJsApi',//判断当前客户端是否支持指定JS接口
            'onMenuShareTimeline',//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            'onMenuShareAppMessage',//获取“分享给朋友”按钮点击状态及自定义分享内容接口
            'onMenuShareQQ',//获取“分享到QQ”按钮点击状态及自定义分享内容接口
            'onMenuShareWeibo',//获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
            'hideMenuItems',//批量隐藏功能按钮接口
            'showMenuItems',//批量显示功能按钮接口
            'hideAllNonBaseMenuItem',//隐藏所有非基础按钮接口
            'showAllNonBaseMenuItem',//显示所有功能按钮接口
            'translateVoice',//识别音频并返回识别结果接口
            'startRecord',//开始录音接口
            'stopRecord',//停止录音接口
            'playVoice',//播放语音接口
            'pauseVoice',//暂停播放接口
            'stopVoice',//停止播放接口
            'uploadVoice',//上传语音接口
            'downloadVoice',//下载语音接口
            'chooseImage',//拍照或从手机相册中选图接口
            'previewImage',//预览图片接口
            'uploadImage',//上传图片接口
            'downloadImage',//下载图片接口
            'getNetworkType',//获取网络状态接口
            'openLocation',//使用微信内置地图查看位置接口
            'getLocation',//获取地理位置接口
            'hideOptionMenu',//隐藏右上角菜单接口
            'showOptionMenu',//显示右上角菜单接口
            'closeWindow',//关闭当前网页窗口接口
            'scanQRCode',//调起微信扫一扫接口
            'chooseWXPay',//发起一个微信支付请求
            'openProductSpecificView',//跳转微信商品页接口
            'addCard',//批量添加卡券接口
            'chooseCard',//调起适用于门店的卡券列表并获取用户选择列表
            'openCard'//查看微信卡包中的卡券接口
        ];

        wx.config(bodyConfig);
        wx.ready(function (): void {
          //  Sk_DATA.GameStart.WechatSucc(true, "成功!")
            console.log("注入成功！")
        })

        wx.error(function (data): void {
           // Sk_DATA.GameStart.WechatSucc(false, data)
            console.log(data)
        })
    }

    //获取用户位置

    public getUserWeizhi(fun, tage) {
        wx.getLocation(
            {
                success: function (res) {
                    console.log(res)
                    //这里是获取经纬度  
                    var setData = {
                        hasLocation: true,
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                    fun(setData, tage);
                }
            })
    }


    //支付
    private getchooseWXPay(_data, taget) {
        var payObj: any = {};
        payObj.timestamp = _data.timestamp.toString();
        payObj.nonceStr = _data.nonceStr;
        payObj.package = _data.package;
        payObj.signType = _data.signType//加密MD5;
        payObj.paySign = _data.paySign;
        payObj.success = function (res): void {
            //支付成功之后回调
            taget.SuccPayback(true)
            console.log("支付成功")
        }
        payObj.fail = function (res): void {
            taget.SuccPayback(false)
            alert("支付失败，请稍后重试" + JSON.stringify(res));
        }
        wx.chooseWXPay(payObj);
    }

    /**
     * 获取微信分享到朋友圈
     */
    public getWeiXinShareTimeline() {
        var body: BodyMenuShareTimeline = new BodyMenuShareTimeline();
        body.title = this.title;
        body.imgUrl = this.imgUrl;
        body.link = this.link;
        //分享成功
        body.success = function () {

        }
        //分享失败
        body.fail = function () {

        }
        //分享撤销
        body.cancel = function () {

        }
        wx.onMenuShareTimeline(body);
    }


    /**
     * 获取微信分享到朋友
     */
    private getWeiXinShareAppMessage(_backfun, taget) {
        var bodyFriend: BodyMenuShareAppMessage = new BodyMenuShareAppMessage();
        bodyFriend.title = this.title;
        bodyFriend.imgUrl = this.imgUrl;
        bodyFriend.link = this.link;
        bodyFriend.desc = this.desc;
        bodyFriend.success = function () {
            _backfun(taget);
        }
        wx.onMenuShareAppMessage(bodyFriend);
    }

    /**
     * 获取微信分享到QQ
     */
    private getWeiXinShareQQ() {

        var bodyMenuShareQQ = new BodyMenuShareQQ();
        bodyMenuShareQQ.title = this.title;
        bodyMenuShareQQ.desc = this.desc;
        bodyMenuShareQQ.link = this.link;
        bodyMenuShareQQ.imgUrl = this.imgUrl;
        bodyMenuShareQQ.trigger = () => {
            alert('用户点击分享到QQ');
        };
        bodyMenuShareQQ.complete = (res) => {
            alert(JSON.stringify(res));
        };
        bodyMenuShareQQ.success = () => {
            alert('已分享');
        };
        bodyMenuShareQQ.cancel = () => {
            alert('已取消');
        };
        bodyMenuShareQQ.fail = (res) => {
            alert(JSON.stringify(res));
        };
        wx.onMenuShareQQ(bodyMenuShareQQ);

    }

    /**
     * 获取微信分享到腾讯微博
     */
    private getWeiXinShareWeiBo() {

        var bodyMenuShareWeibo = new BodyMenuShareWeibo();
        bodyMenuShareWeibo.title = this.title;
        bodyMenuShareWeibo.desc = this.desc;
        bodyMenuShareWeibo.link = this.link;
        bodyMenuShareWeibo.imgUrl = this.imgUrl;
        bodyMenuShareWeibo.trigger = () => {
            alert('用户点击分享到微博');
        };
        bodyMenuShareWeibo.complete = (res) => {
            alert(JSON.stringify(res));
        };
        bodyMenuShareWeibo.success = () => {
            alert('已分享');
        };
        bodyMenuShareWeibo.cancel = () => {
            alert('已取消');
        };
        bodyMenuShareWeibo.fail = (res) => {
            alert(JSON.stringify(res));
        };
        wx.onMenuShareWeibo(bodyMenuShareWeibo);
    }

    /**
    * 批量显示菜单项
    */
    private getWeixinShowMenuItems(arr_menu: any[] = null) {
        var _arr_menu: any[] = [
            //传播类
            "menuItem:share:appMessage",//发送给朋友
            "menuItem:share:timeline",//分享到朋友圈
            "menuItem:share:qq",//分享到QQ
            "menuItem:share:weiboApp",//分享到Weibo
            "menuItem:favorite",//收藏
            "menuItem:share:facebook",//分享到FB
            "menuItem:share:QZone",//分享到 QQ 空间

            //保护类
            "menuItem:editTag",//编辑标签
            "menuItem:delete",//删除
            "menuItem:copyUrl",//复制链接
            "menuItem:originPage",//原网页
            "menuItem:readMode",//阅读模式
            "menuItem:openWithQQBrowser",//在QQ浏览器中打开
            "menuItem:openWithSafari",//在Safari中打开
            "menuItem:share:email",//邮件
            "menuItem:share:brand" //一些特殊公众号
        ];
        if (arr_menu != null) {
            _arr_menu = arr_menu;
        };


        wx.showMenuItems({
            menuList: _arr_menu,
            success: (res) => {
                alert('已显示“分享到朋友圈”等按钮');
            },
            fail: (res) => {
                alert(JSON.stringify(res));
            }
        });

    }

    /**
    * 批量隐藏菜单项
    */
    private getWeixinHideMenuItems(arr_menu: any[] = null) {
        var _arr_menu: any[] = [
            //传播类
            "menuItem:share:appMessage",//发送给朋友
            "menuItem:share:timeline",//分享到朋友圈
            "menuItem:share:qq",//分享到QQ
            "menuItem:share:weiboApp",//分享到Weibo
            "menuItem:favorite",//收藏
            "menuItem:share:facebook",//分享到FB
            "menuItem:share:QZone",//分享到 QQ 空间

            //保护类
            "menuItem:editTag",//编辑标签
            "menuItem:delete",//删除
            "menuItem:copyUrl",//复制链接
            "menuItem:originPage",//原网页
            "menuItem:readMode",//阅读模式
            "menuItem:openWithQQBrowser",//在QQ浏览器中打开
            "menuItem:openWithSafari",//在Safari中打开
            "menuItem:share:email",//邮件
            "menuItem:share:brand" //一些特殊公众号
        ];
        if (arr_menu != null) {
            _arr_menu = arr_menu;
        };
        wx.hideMenuItems({
            menuList: _arr_menu,
            success: (res) => {
                alert('已隐藏所有传播和保护类按钮');
            },
            fail: (res) => {
                alert(JSON.stringify(res));
            }
        });

    }
}