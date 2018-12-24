/**----------网络SOCKET公共类
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


class Sk_Scoket {

    //创建一个SOCKET


    public static initScoket(_socketIP) {

        var ws = new egret.WebSocket();
        Sk_DATA.G_SOCKET_CONN = false;
        ws.type = egret.WebSocket.TYPE_STRING;
        ws.addEventListener(egret.ProgressEvent.SOCKET_DATA, onReceiveMessage, this);
        ws.addEventListener(egret.Event.CONNECT, onSocketOpen, this);
        ws.addEventListener(egret.Event.CLOSE, onSocketClose, this);
        ws.addEventListener(egret.IOErrorEvent.IO_ERROR, onSocketError, this);
        ws.connectByUrl(_socketIP);

        //发送数据 socket 内容
        function SendMsg(_content) {
            ws.writeUTF(JSON.stringify(_content))
        }

        //SOCKET打开
        function onSocketOpen() {
            Sk_DATA.G_SOCKET_CONN = true;

            console.log("WEBSCOKET已链接");
        }

        //SOCKET被关闭了
        function onSocketClose() {
            Sk_DATA.G_SOCKET_CONN = false;
         //   Sk_DATA.GameTips.ShowTips("错误", "WEBSCOKET关闭了!")
            console.log("WEBSCOKET关闭了");
        }


        //消息错误
        function onSocketError() {
            Sk_DATA.G_SOCKET_CONN = false;
           // Sk_DATA.GameTips.ShowTips("错误", "WEBSCOKET错误！!")
            console.log("WEBSCOKET错误！");
        }


        //收到消息
        function onReceiveMessage(e: egret.Event): void {
            //读取字符串信息
            var msg: string = ws.readUTF();
            var _dates = JSON.parse(msg);
      
        }

        return this;
    }

}
