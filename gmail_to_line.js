var CHANNEL_ACCESS_TOKEN = 'アクセストークン';

var LINE_USER_ID = 'ユーザーあいでぃー';

//subjectの中から"連絡"を探す　　学内連絡だけを転送する。正直なくてもいい。
var QUERY = '-label:treated subject:連絡';

function main() {
    var threads = GmailApp.search(QUERY);
    var messages = GmailApp.getMessagesForThreads(threads);

    for (var i in messages) {
        for (var j in messages[i]) {

            //スターがないメッセージのみ処理   本文を250文字でカットしてたけどしてない 
            if (!messages[i][j].isStarred()) {

                var strDate = messages[i][j].getDate();
                var strSubject = messages[i][j].getSubject();
                var strMessage = messages[i][j].getPlainBody();

                //日付を変換
                var uHiduke = Utilities.formatDate(strDate, "JST", 'yyyy年MM月dd日  hh:mm:ss');


                //LINEにメッセージを送信
                line_push(uHiduke, strMessage);

                //処理済みのメッセージにスターをつける
                messages[i][j].star();
            }
        }
    }

}



// LINEにプッシュ通知する
function line_push(uHiduke, strMessage) {

    var url = 'https://api.line.me/v2/bot/message/multicast';
    var userIds = [LINE_USER_ID];

    var postData = {

        "to": userIds,

        "messages": [
            {
                "type": "text",
                "text": uHiduke + "\n\n" + strMessage
            }
        ]
    };



    var options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
        },
        "payload": JSON.stringify(postData)
    };

    UrlFetchApp.fetch(url, options);
}

