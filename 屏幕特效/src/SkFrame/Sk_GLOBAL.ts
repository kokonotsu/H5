/**-----------通用工具类----
 *                             _ooOoo_
 *                            o8888888o
 *                            88" . "88
 *                            (| -_- |)
 *                            O\  =  /O
 *                         ____/`---'\____
 *                       .'  \\|     |//  `.
 *                      /  \\|||  :  |||//  \
 *                     /  _||||| -:- |||||-  \
 *                     |   | \\\  -  /// |   |
 *                     | \_|  ''\---/''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'  /--.--\  `. . __
 *                ."" '<  `.___\_<|>_/___.'  >'"".
 *               | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *          ======`-.____`-.___\_____/___.-`____.-'======
 *                             `=---='
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *             佛祖保佑        永无BUG        永不修改
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *          Skave.Egret.游戏框架工具类 By：2018-20？？ 活到老更到老
 *          QQ:251662618  微信:13798593743  Mail:tmskave@126.com
 *          =====================================================
 */
module SK_GLOBAL {

    //获取当前面板
    export var curPanel: egret.DisplayObjectContainer;

    //获取当前面板
    export function curStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    //当前游戏宽度
    export function curWidth(): number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    //当前游戏宽度
    export function curHeight(): number {
        return egret.MainContext.instance.stage.stageHeight;
    }

    //是不是大屏
    export function isBigScreen(): boolean {
        return (document.body.clientHeight / document.body.clientWidth > 1.32);
    }

    //设置AUTO模式下EXML的分辨率自适应
    export function screenAuto(target) {
        if (target != null) {
            target.left = 0;
            target.right = 0;
            target.top = 0;
            target.bottom = 0;
        }
    }

    //循环播放EGRET TWEEN动画
    export function playTweenAnimation(target: egret.tween.TweenGroup, isLoop: boolean): void {
        if (isLoop) {
            for (var key in target.items) {
                target.items[key].props = { loop: true };
            }
        }
        target.play();
    }

    //播放RES声音: 路径,次数(次数为-1则无限)
    export function PlayBgSound(soundurl: string, _cont: number) {
        if (soundurl != null) {
            var sound: egret.Sound = RES.getRes(soundurl);
            sound.play(0, _cont);
            return sound;
        } else {
            console.log("声音文件为空！")
        }

    }

    //创建播放龙骨动画: 资源名,x,y,动画名,加载的容器
    export function createArmature(_x: number, _y: number, _movieName: string, armatureName: string, target) {
        if (target != null) {
            let rawData = RES.getRes(armatureName + "_ske_json");
            let texture = RES.getRes(armatureName + "_tex_png");
            let textureData = RES.getRes(armatureName + "_tex_json");

            var dragonbonesFactory: dragonBones.EgretFactory = new dragonBones.EgretFactory();
            dragonbonesFactory.parseDragonBonesData(rawData, armatureName);
            dragonbonesFactory.parseTextureAtlasData(textureData, texture, armatureName);

            var armature: dragonBones.Armature = dragonbonesFactory.buildArmature("Armature");
            target.addChild(armature.getDisplay());
            armature.animation.play(_movieName);
            armature.display.x = _x;
            armature.display.y = _y;
            dragonBones.WorldClock.clock.add(armature);
            return armature;
        } else {
            console.log("装载容器不存在")
        }
    }


    //创建播放MovieClip动画： 动画名,加载的容器,x,y,动画组名,播放次数-1为无限,资源名
    export function LoadMovieClipMovie(_movieName: string, _loadMc, _x: number, _y: number, GroupName, timers: number, _jsonname: string) {
        let data = RES.getRes(_jsonname + "_json");
        let txtr = RES.getRes(_jsonname + "_png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        var _mc: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData(GroupName));
        _mc.x = _x;
        _mc.y = _y
        _loadMc.addChild(_mc)
        _mc.gotoAndPlay(_movieName, timers);
        _mc.addEventListener(egret.Event.COMPLETE, (e: egret.Event) => {
            //监听播放完毕直接移除掉
            _loadMc.removeChild(_mc)
        }, this);
        return _mc;
    }


    //创建播放粒子动画: 资源名,加载的容器,x,y
    export function creatParticle(_pname: string, _target, _x: number, _y: number) {
        if (_target != null) {
            let texture = RES.getRes(_pname + "_png");
            let config = RES.getRes(_pname + "_json");
   
            var _particle = new particle.GravityParticleSystem(texture, config);
            _particle.touchEnabled = false;
            _target.addChild(_particle);

            _particle.x = _x;
            _particle.y = _y;
            _particle.start()
            return _particle;
        } else {
            console.log("装载容器不存在");
        }
    }

    //计算时间截差 timer1-timer2 格式数据库默认转换 返回的是秒数*1000
    export function timerOver(_timer1, _timer2) {
        //正则转换
        var _T1 = _timer1.replace(/-/g, '/');
        var _T2 = _timer2.replace(/-/g, '/');
        //转换成时间戳
        var date_t1 = Date.parse(_T1);
        var date_t2 = Date.parse(_T2);
        //计算时间差
        var usedTime = date_t1 - date_t2;  //两个时间戳相差的毫秒数  
        var days = Math.floor(usedTime / (24 * 3600 * 1000));
        //计算出小时数  
        var leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
        var hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数  
        var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
        var minutes = Math.floor(leave2 / (60 * 1000));
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000)
        var time = hours + ":" + minutes + ":" + seconds;
        return time;
    }




    //是不是微信浏览
    export function isWeiXin(): boolean {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (microStr == "null") {
            return false;
        } else if (microStr == "micromessenger") {
            return true;
        }
    }

}