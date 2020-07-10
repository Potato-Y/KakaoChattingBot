/**
 * 제작 : 체크메이트 소속 :: 갈수록퇴화 (KartRider nickname) 
 */


let teamList=[][]; //앞 : 톡방 이름, 뒤 : 참가자 이름
var boxNumber;
let i[]; 
var search;
var allsee="\u200b".repeat(500);
var version="2.0";

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
	msg=msg.trim();
	sender=sender.trim();
	room=room.trim();
	
	if(msg=="!친선명령어"){
		
	  replier.reply("명령어 전체 보기"+allsee+"\n\n
	  !전체목록 : 초기화되기 전까지의 친선 모집 멤버를 봅니다.\n\n
	  !친선, !ㅊㅅ : 대화 내용중에 해당 문구가 있으면 친선 멤버 모집을 시작합니다.\n\n
	  !친선취소 : 친선 멤버 모집을 취소합니다.\n\n
	  ㄱㄱ,ㄱㄴ,고고,go : 친선 모집에 참여합니다.\n\n\n\n
	  version = "+version);
	  
	}
	if(msg.indexOf("!친선")!=-1||msg.indexOf("!ㅊㅅ")!=-1){
		newBoxSearch();
		teamList[boxNumber][0] = room;
		i[boxNumber] = 1;
		teamList[boxNumber][i[boxNumber]] = sender;
		i[boxNumber]++; //i[]=2
	}
	
	if(msg=="!취소"){
		searchBoxNumber();
		teamList[boxNumber][1] = '없음';
		replier.reply("친선 모집이 취소되었습니다.");
	}
	
	if(msg.indexOf("rr")!=-1||msg.indexOf("ㄱㄱ")!=-1||msg.indexOf("go")!=-1||msg.indexOf("rs")!=-1||msg.indexOf("ㄱㄴ")!=-1){
		searchBoxNumber();
		teamList[boxNumber][i[boxNumber]] = sender; //2번째 멤버 = i[3] 
		replier.reply(sender+"님 🗳"); 
		i[boxNumber]++;
		if(i[boxNumber]==5){
			printTeam();
		}
	}
	
	if(msg=="!목록"||msg=="!ㅁㄹ"){
		searchBoxNumber();
		if(teamList[boxNumber][2]==null||teamList[boxNumber][2]==undefined){
			replier.reply("🗒 모집중인 친선 멤버가 없습니다.");
		}
		else{
			printTeam();
		}
		
	}
	
	if(msg=="!친선취소"){
		searchBoxNumber();
		if(teamList[boxNumber][2]==null||teamList[boxNumber][2]==undefined){
			replier.reply("🗒 모집중인 친선팟이 없습니다.");
		}
		else{
			for(s=0;s<5;s++){
				teamList[boxNumber][s]=null;
			}
			replier.reply("🗒 삭제했습니다.");
		}
	}
	
	function newBoxSearch(){
		search=0;
		while(search==(teamList.length+1)){
			if(teamList[search][0]==undefined||teamList[search][0]==null){
				boxNumber=search;
				break;
			}
			search++;
		}	
	}
	
	function searchBoxNumber(){
		search=0;
		while(search==(teamList.length+1)){
			if(teamList[search][0]==room){
				boxNumber=search;
				break;
			}
			search++;
		}	
	}
	
	function printTeam(){
		
		if(i[boxNumber]==5){
			replier.reply("🎮 모인 친선 멤버\n"+teamList[boxNumber][1]+" "+teamList[boxNumber][2]+" "+teamList[boxNumber][3]+" "+teamList[boxNumber][4]);
		}
		else{
			for(s=2;s<5;s++){
				if(teamList[boxNumber][s]==null||teamList[boxNumber][s]==undefined){
				teamList[boxNumber][s]="없음";
				}
			}
			replier.reply("📋 현재까지 모인 팀 목록\n"+teamList[boxNumber][1]+" "+teamList[boxNumber][2]+" "+teamList[boxNumber][3]+" "+teamList[boxNumber][4]);
		}
		
		
	}
}
  
