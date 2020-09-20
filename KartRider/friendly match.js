/*
 * 제작 : 체크메이트 소속 :: 갈수록퇴화 (KartRider nickname)
 */

let teamList = [];
var i;
var startName;
var version = 1.0;

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
    msg = msg.trim();
    sender = sender.trim();
    room = room.trim();

    if (msg.indexOf("!친선") != -1 || msg.indexOf("!ㅊㅅ") != -1) {
        i = 0;
        teamList = [];
        replier.reply("⚔ " + sender + "님이 친선 멤버 모집중 ⚔\nㄱㄱ,ㄱㄴ를 통해 참여하세요!");
        startName = sender;
    }

    if (startName != undefined || startName != null) {
        if (msg.indexOf("ㄱㄱ") != -1 || msg.indexOf("ㄱㄴ") != -1 || msg.indexOf("go") != -1) {
            if (sender != startName && sender != teamList[0] && sender != teamList[1] && sender != teamList[2]) {
                teamList[i] = sender;
                replier.reply(sender + "님 🗳");
                i++;
                if (i == 3) {
                    replier.reply("🎮 모인 친선 멤버\n" + startName + ", " + teamList[0] + ", " + teamList[1] + ", " + teamList[2]);
                    teamList.pop();
                    teamList.pop();
                    teamList.pop();
                    startName = null;
                }
            }
        }
    }
    if (msg == "!ㅁㄹ" || msg == "!목록" || msg == "!멤버" || msg == "!ㅁㅂ") {
        if (startName == undefined || startName == null) {
            replier.reply("🗒 모집중인 친선 멤버가 없습니다.");
        }
        if (startName != undefined || startName != null) {
            for (let i2 = 0; i2 < 3; i2++) {
                if (teamList[i2] == undefined) {
                    teamList[i2] = "없음";
                }
            }
            replier.reply("📋 현재까지 모인 팀 목록\n" + startName + ", " + teamList[0] + ", " + teamList[1] + ", " + teamList[2]);
        }
    }
}
