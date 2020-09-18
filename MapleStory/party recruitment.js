let teamList=[];
let run;
let c;

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
	
	if(msg=="/방법"){
		replier.reply(
		"🖋 원정 파티원 모집 명령어\n\n"+"\u200b".repeat(500)+
		"/원정: 원정을 시작합니다."+
		"\n\n/생성(파티 제목): 파티를 생성합니다.\n"+
		"ex) /생성30분에 하실분 혹은 /생성 30분에 하실분\n\n"+
		"/참여(숫자) (할말): 해당 팀에 참여합니다.\n"+
		"ex) /참여1 노여, /참여 1 노여\n\n"+
		"/호스트참여(숫자) (할말): 해당 팀에 호스트로 참여합니다.\n"+
		"ex) /호스트참여1 노여, /호스트참여 1 노여\n\n"+
		"/취소(숫자): 해당 팀의 참여를 취소를 합니다.\n"+
		"ex) /취소1, /취소2\n\n"+
		"/삭제(숫자): 해당 팀을 삭제합니다.\n"+
		"ex) /삭제1\n\n"+
		"/원정끝, /원정 끝, /원정종료, /원정 종료: 원정 리스트를 초기화하고, 파티원 모집을 종료합니다.\n");
		
	}
	
	
	if(msg=="/원정"&&run!=1){
		replier.reply("🍀 원정 모집을 시작합니다! 🍀\n\n도움말: /방법");
		run=1;
	}
	
	if(run==1){
		//파티 생성
		if(msg.indexOf("/생성")!=-1){
			try{
				let roomNumber=[teamList.length];
				if(roomNumber==0){
					roomNumber++;
				}
				teamList[roomNumber]=new Array(12);
				teamList[roomNumber][0]=msg.replace('/생성','');
				teamList[roomNumber][11]=sender;
				let name=sender.split('/');
				replier.reply("["+roomNumber+"]번 "+"파티가 시작되었습니다🍀");
				
				searchForASpecificRoom(roomNumber);
			}catch(e){
				replier.reply("💫 파티를 만들던 중 터졌어요!");
			}
		}
		
		//파티 일반 참여
		if(msg.indexOf("/참여")!=-1){
			//파티에 저장 영역
			try{
				let fullCount=2;
				let getMsg=msg;
				if(msg.indexOf("/참여 ")!=-1){
					getMsg=msg.replace(" ","");
				}
				let msgData=getMsg.split(' ');
				let wantRoomNum=msgData[0].replace('/참여','');
				let saveText;
				if(teamList[wantRoomNum][11]!=undefined){
					let name=sender.split('/');
					for(let i=2;i<11;i++){
						if(teamList[wantRoomNum][i]==undefined){
							for(let i2=1;i2<msgData.length;i2++){
								saveText+=msgData[i2];
							}
							teamList[wantRoomNum][i]=name[0]+" "+saveText;
							searchForASpecificRoom(wantRoomNum);
							break;
						}
					}
					
				}else{
					replier.reply("파티 정보가 없어요! 번호를 확인해 주세요 😓");
				}
			}catch(e){
				replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
			}
		}
		
		
		//호스트 참가
		if(msg.indexOf("/호스트참여")!=-1){
			try{
				//파티에 저장 영역
				let getMsg=msg;
				if(msg.indexOf("/호스트참여 ")!=-1){
					getMsg=msg.replace(" ","");
				}
				let msgData=getMsg.split(' ');
				let wantRoomNum=msgData[0].replace('/호스트참여','');
				let saveText;
				if(teamList[wantRoomNum][11]!=undefined){
					if(teamList[wantRoomNum][1]==undefined){
						let name=sender.split('/');
						for(let i2=1;i2<msgData.length;i2++){
							saveText+=msgData[i2];
						}
						teamList[wantRoomNum][1]=name[0]+" "+saveText;
						searchForASpecificRoom(wantRoomNum);
					}else{
						replier.reply("🤯 이미 호스트가 있는지 확인해 주세요!");
					}
				}else{
					replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
				}
			}catch(e){
				replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
			}
		}
		
		//참여 취소
		if(msg.indexOf("/취소")!=-1){
			if(msg!="/취소"){
				try{
					let getMsg=msg;
					if(msg.indexOf("/취소 ")!=-1){
						getMsg=msg.replace(" ","");
					}
					let roomNumber = getMsg.replace('/취소','');
					for(let i=1;i<11;i++){
						if(teamList[roomNumber][i]!=undefined){
							let getName = teamList[roomNumber][i].split(' ')[0];
							if(getName==sender.split('/')[0]){
								delete teamList[roomNumber][i];
								searchForASpecificRoom(roomNumber);
								break;
							}
						}
					}
					
				}catch(e){
					replier.reply("🤯 취소 중 오류가 발생하였습니다. 방 번호를 확인하세요.");
				}
			}else{
				replier.reply("🤔 취소할 파티 번호를 입력해 주세요!");
			}
		}
		
		//파티 삭제
		if(msg.indexOf("/삭제")!=-1){
			if(msg!="/삭제"){
				try{
					let getMsg=msg;
					if(msg.indexOf("/삭제 ")!=-1){
						getMsg=msg.replace(" ","");
					}
					let roomNumber = getMsg.replace('/삭제','');
					if(roomNumber<=teamList.length){
						for(let i=0;i<12;i++){
							teamList[roomNumber][i]=undefined;
						}
						replier.reply("["+roomNumber+"]번 파티가 삭제되었습니다.");
					}else{
						replier.reply("["+roomNumber+"]번 파티를 확인할 수 없습니다.");
					}
				}catch(e){
					replier.reply("🤯 해당 번호의 파티를 확인할 수 없습니다.");
				}
			}else{
				replier.reply("🤔 번호를 입력해 주세요! ex)/삭제2");
			}
		}
		
		//원정 종료
		if(msg=="/원정끝"||msg=="/원정 끝"||msg=="/원정종료"||msg=="/원정 종료"){
			for(let i=0;i<=teamList.length;i++){
				teamList.pop();
			}
			replier.reply("🗑 파티모집이 종료되어 초기화 되었습니다.");
			run=0;
		}
		
		//목록 보기
		if(msg=="/목록"||msg=="/ㅁㄹ"){
			printTeamList();
		}
		
		//특정 파티 목록 보기
		if(msg.replace(/[0-9]/gi,"")=="/파티"){
			let wantRoomNum=msg.replace(/[^0-9]/g,'')
			try{
				if(teamList[wantRoomNum][11]!=undefined){
					searchForASpecificRoom(wantRoomNum);
				}else{
					replier.reply("🤔파티 번호를 확인하세요.");
				}
			}catch(e){
				replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
			}
		}
	}
	
	
	function printTeamList(){
		if(teamList.length>0){
			var count=0;
			var postMsg="";
			var fullRoomNumber=teamList.length;
			for(var i=1;i<fullRoomNumber;i++){
				try{
					if(teamList[i][11]!=undefined){
						postMsg="<"+i+"파티> "+teamList[i][0]+"\n"+"호스트 : "+teamList[i][1];
						for(let p=2;p<=10;p++){
							postMsg+="\n"+p+". "+teamList[i][p];
						}
						postMsg+="\n------------------------------------\n파티참여방법: (노여/하여),투력\n출발 2분 전까지 인겜 안오신 분은 멘션 부탁드립니다"
						replier.reply(postMsg.replace(/undefined/g,""));
						count++;
					}
				}catch(e){
					replier.reply("🤯 오류가 발생하였습니다.");
				}
				
			}
			if(count==0){
				replier.reply("🤔 현재 있는 파티가 없는 것 같습니다.");
			}
		}	
		else{
		replier.reply("🤔 현재 있는 파티가 없는 것 같습니다.");
		}
	}
	
	function searchForASpecificRoom(c){
		try{
			if(teamList[c][11]!=undefined){
				postMsg="<"+c+"파티> "+teamList[c][0]+"\n"+"호스트 : "+teamList[c][1];
				for(let p=2;p<=10;p++){
					postMsg+="\n"+p+". "+teamList[c][p];
				}
				postMsg+="\n------------------------------------\n파티참여방법: (노여/하여),투력\n출발 2분 전까지 인겜 안오신 분은 멘션 부탁드립니다"
				replier.reply(postMsg.replace(/undefined/g,""));
			}
		}catch(e){
			replier.reply("🤯 팀 정보를 불러오던 중 오류가 발생하였습니다.");
		}
	}
}