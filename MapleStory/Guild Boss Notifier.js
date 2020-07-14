function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
	msg=msg.trim();
	sender=sender.trim();
	room=room.trim();
	var c=0;
	if(msg=="on"){
		if(room=="길드 방 이름"){ //필요시 없애도 됨
		replier.reply("길보 알리미 서비스를 시작합니다.");
		var s="on";
		while(s=="on"){
			var time=new Date();
			if(time.getHours()==12||time.getHours()==20){
				if(c==0){
					replier.reply("길보돌 시간입니다");
					c++;
					}
				if(time.getHours()==13||time.getHours()==21){
					if(c==1){
						replier.reply("길보 종료 시간입니다");
						c++;
						c=0;
					}
				}
			}
		}
	}
}