module Game {
    export class User {
        public static openID: string = "";
        public static uid: string = "";
        public static nickName: string = "";
        public static iconUrl: string = "";
        public static score: number = 0;
        public static token: string = "";
        public static needLoad: boolean = true;
        public static upInfoToSrv() {
            let msg = {
                pt: "GetPlayerData",
            }
            wxapi.WxSDK.Default.sendMsg(msg, Game.User.upSucc, Game.User.upFail, Game.User)
        }
        public static upSucc(data) {
        }

        public static upFail(data) {
        }
    }
}