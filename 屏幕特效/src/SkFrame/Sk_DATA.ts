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

//全局常用场景及交互数据
module Sk_DATA {
    //本地测试
    export var IsDeBUG = false;
    //服务器的链接配置数据
    export var ServerData: any;
    //服务器列表的数据
    export var GameServerList: any;
    //我的服务器信息
    export var RoleList: any;
    //当前选择的服务器
    export var UseTheServer: any;


    //默认SOCKET
    export var G_SOCKET: any;
    export var G_SOCKET_CONN: boolean;
    //其他

    export var nowWorldMapid:number;

    //场景控制




    //微信
    export var WeChatSKD: any;



}