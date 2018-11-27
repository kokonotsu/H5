/**
 * Created by yangsong on 2014/11/22.
 */
class Log {
    /**
     * Debug_Log
     * @param messsage 内容
     * @constructor
     */
    public static trace(...optionalParams:any[]):void {
        if (App.DebugUtils.isDebug) {
            optionalParams[0] = "[DebugLog]" + optionalParams[0];
            console.log.apply(console, optionalParams);
        }
    }
}
module Log {
    export function print(msg: string) {
        const now = share.Common.formatDateTime( new Date().getTime() ); 
        var str = now + ":" + msg;
        console.log(str);
    }

    export function error(msg: string) {
        const now = share.Common.formatDateTime( new Date().getTime() ); 
        var str = now + ":" + msg;
        console.error(str);
    }

    export function assert(flag, msg) {
            const now = share.Common.formatDateTime( new Date().getTime() ); 
            var str = now + ":" + msg;
            console.assert(flag, str);
        }
}
