/**
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

/**
 * 场景特效类
 * by skave
 * (c) copyright 2018 - 2035
 * All Rights Reserved. 
//切换场景的特效
//1.卷帘特效
//2.左右切换移动
//3.直接翻
//4.旋转掉落
//5.随机一种
 */

module Sk_ScreenMovie {
    //当前舞台 =====特效的number------切换特效
    export function MovieStart(_txnums, _taget) {
        //创建一个截图Bitmap
        var taget;
        if (_taget == null) {
            taget = SK_GLOBAL.curStage()
        } else {
            taget = _taget
        }
        var w = SK_GLOBAL.curWidth();
        var h = SK_GLOBAL.curHeight()
        //新建一个group
        var loadTxGrp = new eui.Group();
        loadTxGrp.width = w;
        loadTxGrp.height = h;
        taget.addChild(loadTxGrp)
        //循环创建多个截图bitmap 这里num自由设置
        var tx1Number = 9;
        //每个横着的数量
        var Xnumber = 3;
        //高数量自动计算
        var Ynumber = tx1Number / Xnumber;
        for (var i = 0; i < tx1Number; i++) {
            //计算每个的XY及宽高
            var _mcW = w / Xnumber;
            var _mcH = h / Ynumber;
            var _mcX = i % Xnumber * _mcW;
            var _mcY = Math.floor(i / Xnumber) * _mcH;

            var renderTexture: egret.RenderTexture = new egret.RenderTexture();
            var mypic = renderTexture.drawToTexture(taget, new egret.Rectangle(_mcX, _mcY, _mcW, _mcH));
            var bmp = new egret.Bitmap;
            bmp.texture = renderTexture;
            bmp.anchorOffsetX = _mcW / 2
            bmp.anchorOffsetY = _mcH / 2
            bmp.x = _mcX + _mcW / 2;
            bmp.y = _mcY + _mcH / 2;
            loadTxGrp.addChild(bmp);
            if (_txnums == 5) {
                _txnums = Math.ceil(Math.random() * 4)
            }
            //开始特效
            switch (_txnums) {
                case 1:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 0, scaleY: 0, alpha: 0, rotation: 359 }, 300, egret.Ease.circIn).call(onComplete, this);
                    break;
                case 2:

                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 1, scaleY: 0.2, alpha: 0 }, 300, egret.Ease.circIn).call(onComplete, this);
                    break;
                case 3:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 0.2, scaleY: 1, alpha: 0, blurFliter: 0 }, 300, egret.Ease.backInOut).call(onComplete, this);
                    break;
                case 4:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ alpha: 0 }, 300, egret.Ease.circIn).call(onComplete, this)
                    break;
                default:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 1, scaleY: 0, alpha: 0 }, 300, egret.Ease.circIn).call(onComplete, this);
            }
        }
        var upNumber = 0;
        //播放完毕自动移除
        function onComplete(evt: Comment) {
            upNumber++
            if (upNumber == tx1Number) {
                taget.removeChild(loadTxGrp)
            }
        }
    }

    //提示弹出图片
    export function tipTxtShow(_bmps, _tage) {
        var bmp = new egret.Bitmap;
        bmp.texture = RES.getRes(_bmps);
        bmp.anchorOffsetX = bmp.width / 2
        bmp.anchorOffsetY = bmp.height / 2
        bmp.x = (SK_GLOBAL.curWidth() - bmp.width) / 2 + bmp.anchorOffsetX
        bmp.y = (SK_GLOBAL.curWidth() - bmp.height) / 2
        _tage.addChild(bmp)
        var tw = egret.Tween.get(bmp);
        tw.to({ y: bmp.y - 80, alpha: 0 }, 1500, egret.Ease.circIn)
        //播放完毕自动移除
        tw.addEventListener(egret.Event.COMPLETE, (e: egret.Event) => {
            //监听播放完毕
            _tage.removeChild(bmp)
        }, true);
    }

    //磨砂特效针对窗口
    export function MaskFilter(_tagret) {
        var taget: any;
        var w: number;
        var h: number;


        //创建模糊背景磨砂效果
        taget = SK_GLOBAL.curStage()
        w = SK_GLOBAL.curWidth();
        h = SK_GLOBAL.curHeight()
        //新建一个group
        var loadTxGrp = new eui.Group();
        loadTxGrp.alpha = 0;
        loadTxGrp.width = w;
        loadTxGrp.height = h;
        var renderTexture: egret.RenderTexture = new egret.RenderTexture();

        var mypic = renderTexture.drawToTexture(taget, new egret.Rectangle(0, 0, w, h));


        var bmp = new egret.Bitmap;
        bmp.texture = renderTexture;

        loadTxGrp.addChild(bmp);

        var blurFliter = new egret.BlurFilter(8, 8);
        bmp.filters = [blurFliter];
        var tw = egret.Tween.get(loadTxGrp);
        tw.to({ alpha: 1 }, 1000);
        _tagret.addChild(loadTxGrp)
    }

    //弹出特效
    export function MovieTweenBox(_tagret) {
        _tagret.anchorOffsetX = _tagret.width / 2;
        _tagret.anchorOffsetY = _tagret.height / 2;
        _tagret.scaleX = 0.1;
        _tagret.scaleY = 0.1;
        _tagret.x = _tagret.x + _tagret.width / 2;
        _tagret.y = _tagret.y + _tagret.height / 2;
        var tw = egret.Tween.get(_tagret);
        tw.to({ scaleX: 1, scaleY: 1, alpha: 1, blurFliter: 0 }, 800, egret.Ease.backInOut);
    }
    //掉落特效
    export function DownTweenBox(_tagret) {
        var they = _tagret.y
        _tagret.y = -100;
        var tw = egret.Tween.get(_tagret);
        tw.to({ y: they }, 800, egret.Ease.backInOut);
    }

    //按钮缩放特效
    export function btnScaleXY(_tagret) {
        var tw = egret.Tween.get(_tagret, { "loop": true });
        //重置锚点
        _tagret.anchorOffsetX = _tagret.width / 2;
        _tagret.anchorOffsetY = _tagret.height / 2;
        tw.to({ scaleX: 1.15, scaleY: 1.15, alpha: 1 }, 500).call(onScaleDown, this);
        function onScaleDown() {
            tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500).call(onScaleUP, this);
        }
        function onScaleUP() {
            tw.to({ scaleX: 1.15, scaleY: 1.15, alpha: 1 }, 500).call(onScaleDown, this);
        }
        //计算位置
        _tagret.x = _tagret.x + _tagret.width / 2;
        _tagret.y = _tagret.y + _tagret.height / 2;
    }
    //系统中央提示文字
    export function setCenterTxt(_strs: string) {
        var tField = new egret.TextField();
        tField.width = 300;
        tField.height = 50;
        tField.anchorOffsetX = 150;
        tField.anchorOffsetY = 25;
        tField.x = (SK_GLOBAL.curWidth() - 300) / 2
        tField.y = (SK_GLOBAL.curHeight() - 50) / 2
        tField.text = _strs;
        tField.size = 33
        tField.textAlign = "center";
        tField.fontFamily = "SimHei"
        tField.textColor = 0xffffff;
        tField.strokeColor = 0x000000;
        tField.stroke = 2;
        tField.bold = true;
    //    Sk_DATA.GameStart.addChildAt(tField, 1999);
        var tw = egret.Tween.get(tField);
        tw.to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 800, egret.Ease.circIn).call(onComplete, this);
        function onComplete(evt: Comment) {
     //       Sk_DATA.GameStart.removeChild(tField)
        }
    }


}