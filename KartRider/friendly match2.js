/**
 * 제작 : 체크메이트 소속 :: 갈수록퇴화 (KartRider nickname) 
 */

let teamList=[]; 
let roomNumber;
let i=[]; 
let search;
const allsee="\u200b".repeat(500);
const version="2.0 beta build 0009";

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
	/*
	if(msg=="!친선명령어"){
		
	  replier.reply("명령어 전체 보기"+allsee+"\n\n
	  !전체목록 : 초기화되기 전까지의 친선 모집 멤버를 봅니다.\n\n
	  !친선, !ㅊㅅ : 대화 내용중에 해당 문구가 있으면 친선 멤버 모집을 시작합니다.\n\n
	  !친선취소 : 친선 멤버 모집을 취소합니다.\n\n
	  ㄱㄱ,ㄱㄴ,고고,go : 친선 모집에 참여합니다.\n\n\n\n
	  bot version = "+version);
	  
	}
	*/
	if(msg.indexOf("!친선")!=-1||msg.indexOf("!ㅊㅅ")!=-1){
		newSearchRoom();
		teamList[roomNumber+1]=sender;
		i[roomNumber]=2;
		replier.reply("⚔ "+sender+"님이 친선 멤버 모집중 ⚔\nㄱㄱ,ㄱㄴ를 통해 참여하세요!");
	}
	
	if(msg=="!취소"){
		searchRoom();
		if(teamList[roomNumber]==room){
			replier.reply(teamList[roomNumber+1]+"님이 모집하던 친선 멤버의 모집이 종료되었습니다.");
			reStartRemove();
		}
		else if(roomNumber==null){
			replier.reply("톡방 내에서 진행중인 모집이 없습니다.");
		}
		else{
			replier.reply("error");
		}
	}
	
	if(msg.indexOf("rr")!=-1||msg.indexOf("ㄱㄱ")!=-1||msg.indexOf("go")!=-1||msg.indexOf("rs")!=-1||msg.indexOf("ㄱㄴ")!=-1){
		searchRoom();
		if(teamList[roomNumber]==room){
			teamList[roomNumber+i[roomNumber]]=sender;
			i[roomNumber]++;
			replier.reply(sender+"님 🗳");
			if(i[roomNuber]==5){
				printTeamList();
			}
		}
	}
	
	if(msg=="!목록"||msg=="!ㅁㄹ"){
		searchRoom();
		if(teamList[roomNumber]==room){
			printTeamList();
		}
		else if(roomNumber==null){
			replier.reply("톡방 내에서 진행중인 모집이 없습니다.");
		}
		else{
			replier.reply("error");
		}
	}
	if(msg=="!방번호"){
		searchRoom();
		replier.reply(roomNumber+"번 방이며,\n방 이름은 "+teamList[roomNumber]+"방으로 인식됩니다.");
		roomNumber=null;
	}
	function newSearchRoom(){
		search=1;
		while(search>teamList.length+10){
			if(teamList[search]==room){
				roomNumber=search;
				replier.reply(teamList[roomNumber+1]+"님의 팀 삭제 후\n재모집 합니다.");
				reStartRemove();
				teamList[roomNumber]=room;
				break;
			}
			else if(teamList[search]==undefined||teamList[search]==null){
				roomNumber=search;
				teamList[roomNumber]=room;
				break;
			}
			search=search+5;
		}
	}
	
	
	
	function searchRoom(){
		search=1;
		while(search>teamList.length+10){
			if(teamList[search]==room){
				roomNumber=search;
				break;
			}
			else if(teamList[search]==undefined||teamList[search]==null){
				roomNumber=null;
				break;
			}
			search=search+5;
		}
	}
	
	function reStartRemove(){
		teamList[roomNumber]=null;
		teamList[roomNumber+1]=null;
		teamList[roomNumber+2]=null;
		teamList[roomNumber+3]=null;
		teamList[roomNumber+4]=null;
	}
	
	function printTeamList(){
		if(i[roomNumber]==5){
			replier.reply("🎮 모인 친선 멤버\n"+teamList[roomNumber+1]+" "+teamList[roomNumber+2]+" "+teamList[roomNumber+3]+" "+teamList[roomNumber+4]);
		}
		else{
			for(var s=2;s<5;s++){
				if(teamList[roomNumber+s]==null||teamList[roomNumber+s]==undefined){
				teamList[roomNumber+s]="없음";
				}
			}
		}
	}
	
}
