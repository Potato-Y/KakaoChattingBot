let c;
let use;

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	msg = msg.trim();
	sender = sender.trim();
	room = room.trim();

	if (msg == "!알림") {
		if (use == undefined || use == 2) {
			use = 1;
			replier.reply("길드 보스 알리미를 시작합니다.");
			while (use == 1) {
				var time = new Date();
				if (time.getHours() == 12 || time.getHours() == 20) {
					if (c == 0) {
						replier.reply("길보돌 시간입니다");
						c++;
					}

					if (time.getHours() == 13 || time.getHours() == 21) {
						if (c == 1) {
							replier.reply("길보 종료 시간입니다");
							c = 0;
						}
					}
				}
				if (use == 2) { break; }
			}
		}
		else if (use == 1) {
			use = 2;
			replier.reply("길드 보스 알리미를 종료합니다.");
		}
	}
}