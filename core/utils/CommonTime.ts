module share {
    export class Common {

        static MS_PERDAY = 24 * 60 * 60 * 1000;
        /**
         * 格式化时间
         * @param time 时间
         */
        public static formatDateTime( time: any ){
            const Dates = new Date( time );
            const year: number = Dates.getFullYear();
            const month: any = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
            const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
            const hour: number = Dates.getHours();
            const min: number = Dates.getMinutes();
            const second: number = Dates.getSeconds();

            return year + '-' + month + '-' + day + " " + hour + ":" + min + ":" + second;
        }


        /**
         * 随机数0-9
         */
        public static randomInt0_9(): number {
            let num = Math.random() * 10;
            num = Math.floor(num);
            return (num % 10);
        }

        /**
         * 随意数
         * @param min 最小区间
         * @param max 最大区间
         */
        public static randomInt(min: number, max: number) {
            let range = max - min;  
            let randNum = Math.random();  
            
            return Math.floor(min + Math.round(randNum * range));
        }

        /**
         * 
         * @param time 时间秒为单位
         */
        public static formatTime(time: number): string{
            if (time < 999) {
                return time + "s";
            }

            let m = Math.floor(time / 60);
            let s = time % 60;
            if (m < 60) {
                let sStr = s == 0 ? "" : s + "s";
                let mStr = m + sStr;
                return mStr;
            }

            let h = Math.floor(time / 3600);
            s = time % 3600;
            m = Math.floor(s / 60);
            s = time % 60;

            if (h < 24) {
                return (h + "h" + m + "m" + s + "s");
            }

            let d = Math.floor(h / 24);
            h = h % 24;

            let dStr = d + "d" + (h > 0 ? (h + "h") : "");
            return dStr;
        }

        public static formatTimeEx1(time: number): string {
            if (time == 0) {
                return "00";
            }else if (time < 10){
                return "0" + time;
            }else {
                return time.toString();
            }
        }

        public static formatTimeEx(time: number): string {
            let str = "";

            let h = Math.floor(time / 3600);
            //去掉小时后剩余秒数
            time -= (h * 3600);
            //分钟
            let m = Math.floor(time / 60);
            //秒
            let s = time % 60;

            str = Common.formatTimeEx1(h) + ":" + Common.formatTimeEx1(m) + ":" + Common.formatTimeEx1(s);
        
            return str;
        }

        public static set2Center(view: Laya.View) {
            view.anchorX = 0.5;
            view.anchorY = 0.5;
            view.centerX = 0;
            view.centerY = 0;
        }

        /**
  * 获取规格化的时间差(天数)
  * @param {*} lhsTimestamp 时间戳
  * @param {*} rhsTimestamp 时间戳
  * @param {*} normalizeFlag 0:lhs规格化;1:rhs规格化;2:全规格化
  */
 public static diffTimeSEC (lhsTimestamp, rhsTimestamp, normalizeFlag) {
    lhsTimestamp *= 1000;
    rhsTimestamp *= 1000;
    return share.Common.diffTimeMS(lhsTimestamp, rhsTimestamp, normalizeFlag);
};

/**
 * 获取规格化的时间差(天数)
 * @param {*} lhsTimestamp 时间戳
 * @param {*} rhsTimestamp 时间戳
 * @param {*} normalizeFlag normalizeFlag:0:lhs规格化;1:rhs规格化;2:全规格化
 */
public static diffTimeMS (lhsTimestamp, rhsTimestamp, normalizeFlag) {
    normalizeFlag = (normalizeFlag === undefined) ? -1 : normalizeFlag;
    if (normalizeFlag === 0) {
        lhsTimestamp = share.Common.normalizeTimestamp(lhsTimestamp);
    } else if (normalizeFlag === 1) {
        rhsTimestamp = share.Common.normalizeTimestamp(rhsTimestamp);
    } else if (normalizeFlag === 2) {
        lhsTimestamp = share.Common.normalizeTimestamp(lhsTimestamp);
        rhsTimestamp = share.Common.normalizeTimestamp(rhsTimestamp);
    }
    let diff = lhsTimestamp - rhsTimestamp;
    return parseFloat((diff / share.Common.MS_PERDAY).toFixed(1));
}


/**
 * 规格化时间
 * @param {int} ts 时间戳 
 */
 public static normalizeTimestamp = function(ts) {
    let date = new Date(ts);
    if (date) {
        date.setHours(0, 0, 0, 0);
        ts = date.getTime();
    }
    return ts;
};
    }
}