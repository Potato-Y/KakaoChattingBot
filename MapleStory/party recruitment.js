///
///본 스크립트는 모바일 메이플스토리M에서 10명의 인원을 고정하고 사용할 경우 적용되는 스크립트입니다.
///릴리즈 날짜 20200922 0136
///

///
///이 부분은 설정에 대한 부분입니다. 관리자의 유저 이름을 masterUserName에 포함하시기 바랍니다. masterUserName 항목 외의 설정은 인챗에서 할 수 있지만 영구적이지 않아 스크립트가 재시작 되면 초기화 됩니다. 영구적이길 원한다면 이곳에서 수정하세요.
///0 : 본인과 관리자만 수정, 1 : 모두에게 권한이 주어짐
///
let masterUserName = []; //봇 관리자의 카카오톡 닉네임을 포함시킵니다. ex) ['admin1',"admin2",'admin3'] 이 때, admin1 위치에 있는 사람은 최고 관리자로 인톡방 권한 수정 잠금을 유일하게 해제하고 잠금할 수 있는 관리자입니다.
let maxNumber = 10; //변경 명령어: /인원변경 (수)   한 파티당 최대 인원 수 입니다. 이는 의뢰자의 조건에 의하여 파티마다 가변으로 제공되지 않고 있으며, 설정으로만 일괄 제공됩니다. 수정시 정상 작동을 보장하지 않으며, 인챗에서 수정시 원정이 종료됩니다.
let inChatSettingPermissin = 1; //변경 명령어: /권한잠금   인챗에서 설정을 변경할 수 있도록 할 것인지 설정합니다.
let partyDeletePermission = 0; //변경 명령어: /삭제권한   파티 삭제 권한 관리입니다.
let rightToCancel = 0; //변경 명령어: /취소권한  강제 참가 취소 관리 권한입니다.
let addGuestPermissin = 0; //변경 명령어: /게스트권한   나 이외의 사람을 참여시킵니다. 본 기능을 이용할 경우 강제로 참여한 사람의 이름이 다르면 강제로 취소해야 합니다.
let partyNameEditPermission = 0; //변경 명령어: /제목수정권한   파티 이름을 수정할 권한을 정합니다.

///
///해당 부분부터 수정하면 작동을 보장하지 않습니다.
///
let teamList = [];
let run;
let c;

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
    if (msg == "/방법") {
        let postMsg;
        postMsg =
            "🖋 원정 파티원 모집 명령어\n\n" +
            "\u200b".repeat(500) +
            "\n공식 Wiki : https://github.com/Potato-Y/KakaoChattingBot/wiki/3-2.-Recruitment-of-expedition-party-members\n\n" +
            "/원정: 원정을 시작합니다." +
            "\n\n/생성(파티 제목): 파티를 생성합니다.\n" +
            "ex) /생성30분에 하실분 혹은 /생성 30분에 하실분\n\n" +
            "/참여(숫자) (할말): 해당 파티에 참여합니다.\n" +
            "ex) /참여1 노여, /참여 1 노여\n\n" +
            "/호스트참여(숫자) (할말): 해당 파티에 호스트로 참여합니다.\n" +
            "ex) /호스트참여1 노여, /호스트참여 1 노여\n\n" +
            "/취소(숫자): 해당 파티에 참여를 취소를 합니다.\n" +
            "ex) /취소1, /취소2\n\n" +
            "/삭제(숫자): 해당 파티를 삭제합니다.\n" +
            "ex) /삭제1\n\n" +
            "/원정끝, /원정 끝, /원정종료, /원정 종료: 원정 리스트를 초기화하고, 파티원 모집을 종료합니다.\n\n\n";

        if ((inChatSettingPermissin = 1)) {
            postMsg += "권한 안내\n\n";

            switch (addGuestPermissin) {
                case 1:
                    postMsg += "게스트 참여 권한 : 공개\n" + "명령어: /게스트(파티 번호) (이름) (할말)  ex)/게스트1 회원1 (할말)\n\n";
                    break;
                case 0:
                    postMsg += "게스트 참여 권한 : 비공개\n\n";
                    break;
            }
            switch (rightToCancel) {
                case 1:
                    postMsg += "타인 취소 권한 : 공개\n" + "명령어: /강제취소(파티 번호) (등록된 이름)  ex)/강제취소1 회원1\n\n";
                    break;
                case 0:
                    postMsg += "타인 취소 권한 : 비공개\n\n";
                    break;
            }
            switch (partyDeletePermission) {
                case 1:
                    postMsg += "타인 파티 취소 권한 : 공개\n\n";
                    break;
                case 0:
                    postMsg += "타인 파티 취소 권한 : 비공개\n\n";
                    break;
            }
            switch (partyNameEditPermission) {
                case 1:
                    postMsg += "타인이 생성한 파티 제목 수정 권한 : 공개\n" + "명령어: /(파티 번호)파티제목 (수정할 것)  ex)/1파티제목 30분 고고요";
                    break;
                case 0:
                    postMsg += "타인이 생성한 파티 제목 수정 권한 : 비공개";
            }

            replier.reply(postMsg);
        }
    }

    if (msg == "/원정" && run != 1) {
        replier.reply("🍀 원정 모집을 시작합니다! 🍀\n\n도움말: /방법");
        run = 1;
    } else if (msg == "/원정" && run == 1) {
        replier.reply("😓 이미 원정이 활성화되어 있습니다!");
    }

    if (run == 1) {
        //파티 생성
        if (msg.indexOf("/생성") != -1) {
            try {
                let roomNumber = [teamList.length];
                if (roomNumber == 0) {
                    roomNumber++;
                }
                teamList[roomNumber] = new Array(maxNumber + 2);
                teamList[roomNumber][0] = msg.replace("/생성", "");
                teamList[roomNumber][maxNumber + 1] = sender;
                let name = sender.split("/");
                replier.reply("[" + roomNumber + "]번 " + "파티가 시작되었습니다🍀");

                searchForASpecificRoom(roomNumber);
            } catch (e) {
                replier.reply("💫 파티를 만들던 중 터졌어요!");
            }
        }

        //파티 일반 참여
        if (msg.indexOf("/참여") != -1) {
            try {
                let getMsg = msg;
                if (msg.indexOf("/참여 ") != -1) {
                    getMsg = msg.replace(" ", "");
                }
                let msgData = getMsg.split(" ");
                let wantRoomNum = msgData[0].replace("/참여", "");
                let saveText;
                if (teamList[wantRoomNum][maxNumber + 1] != undefined) {
                    let name = sender.split("/");
                    for (let i = 2; i < maxNumber + 1; i++) {
                        if (teamList[wantRoomNum][i] == undefined) {
                            for (let i2 = 1; i2 < msgData.length; i2++) {
                                saveText += msgData[i2] + " ";
                            }
                            teamList[wantRoomNum][i] = name[0] + " " + saveText;
                            searchForASpecificRoom(wantRoomNum);
                            break;
                        }
                    }
                } else {
                    replier.reply("파티 정보가 없어요! 번호를 확인해 주세요 😓");
                }
            } catch (e) {
                replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
            }
        }

        //파티 게스트 참여
        if (msg.indexOf("/게스트") != -1 && msg.indexOf("/게스트호스트") == -1) {
            if (addGuestPermissin == 0) {
                let authority = 0;
                authority = authorityCheck();
                if (authority == 1) {
                    guestAdd();
                } else {
                    replier.reply("🤔 권한을 확인해 주세요.");
                }
            } else if (addGuestPermissin == 1) {
                guestAdd();
            } else {
                replier.reply("🤔 권한을 확인해 주세요.");
            }
        }

        //호스트 참가
        if (msg.indexOf("/호스트참여") != -1) {
            try {
                let getMsg = msg;
                if (msg.indexOf("/호스트참여 ") != -1) {
                    getMsg = msg.replace(" ", "");
                }
                let msgData = getMsg.split(" ");
                let wantRoomNum = msgData[0].replace("/호스트참여", "");
                let saveText = "";
                if (teamList[wantRoomNum][maxNumber + 1] != undefined) {
                    if (teamList[wantRoomNum][1] == undefined) {
                        let name = sender.split("/");
                        for (let i2 = 1; i2 < msgData.length; i2++) {
                            if (i2 == msgData.length - 1) {
                                saveText += msgData[i2];
                            } else {
                                saveText += msgData[i2] + " ";
                            }
                        }
                        teamList[wantRoomNum][1] = name[0] + " " + saveText;
                        searchForASpecificRoom(wantRoomNum);
                    } else {
                        replier.reply("🤯 이미 호스트가 있는지 확인해 주세요!");
                    }
                } else {
                    replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
                }
            } catch (e) {
                replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
            }
        }

        //게스트 호스트 참가
        if (msg.indexOf("/게스트호스트") != -1) {
            if (addGuestPermissin == 0) {
                let authority = 0;
                authority = authorityCheck();
                if (authority == 1) {
                    guestHostAdd();
                } else {
                    replier.reply("🤔 권한을 확인해 주세요.");
                }
            } else if (addGuestPermissin == 1) {
                guestHostAdd();
            } else {
                replier.reply("🤔 권한을 확인해 주세요.");
            }
        }

        //참여 취소
        if (msg.indexOf("/취소") != -1) {
            if (msg != "/취소") {
                try {
                    let getMsg = msg;
                    if (msg.indexOf("/취소 ") != -1) {
                        getMsg = msg.replace(" ", "");
                    }
                    let roomNumber = getMsg.replace("/취소", "");
                    for (let i = 1; i < maxNumber + 1; i++) {
                        if (teamList[roomNumber][i] != undefined) {
                            if (teamList[roomNumber][i].split(" ")[0] == sender.split("/")[0]) {
                                delete teamList[roomNumber][i];
                                searchForASpecificRoom(roomNumber);
                                break;
                            }
                        }
                    }
                } catch (e) {
                    replier.reply("🤯 취소 중 오류가 발생하였습니다. 방 번호를 확인하세요.");
                }
            } else {
                replier.reply("🤔 취소할 파티 번호를 입력해 주세요!");
            }
        }

        //강제 취소
        if (msg.indexOf("/강제취소") != -1) {
            try {
                if (rightToCancel == 0) {
                    let authority = 0;
                    authority = authorityCheck();
                    if (authority == 1) {
                        forceUserRemoval();
                    } else {
                        replier.reply("🤔 방 번호, 혹은 권한을 확인해 주세요.");
                    }
                } else if (rightToCancel == 1) {
                    forceUserRemoval();
                } else {
                    replier.reply("🤔 방 번호, 혹은 권한을 확인해 주세요.");
                }
            } catch (e) {
                replier.reply("🤔 방 번호, 혹은 권한을 확인해 주세요.");
            }
        }

        //파티 이름 변경하기
        if (msg.split(" ")[0].replace(/[0-9]/gi, "") == "/파티제목") {
            if (addGuestPermissin == 0) {
                let authority = 0;
                let roomNumber = msg.split(" ")[0].replace(/[^0-9]/g, "");
                authority = authorityCheck();
                if (authority == 1 || teamList[roomNumber][maxNumber + 1] == sender) {
                    editPartyTitle();
                } else {
                    replier.reply("🤔 권한을 확인해 주세요.");
                }
            } else if (addGuestPermissin == 1) {
                editPartyTitle();
            } else {
                replier.reply("🤔 무언가가 방해합니다.");
            }
        }

        //파티 삭제
        if (msg.indexOf("/삭제") != -1) {
            if (msg != "/삭제") {
                try {
                    let getMsg = msg;
                    if (msg.indexOf("/삭제 ") != -1) {
                        getMsg = msg.replace(" ", "");
                    }
                    let roomNumber = getMsg.replace("/삭제", "");
                    if (partyDeletePermission == 0) {
                        let authority = 0;
                        authority = authorityCheck();
                        if (authority == 1 || teamList[roomNumber][maxNumber + 1] == sender) {
                            if (roomNumber <= teamList.length) {
                                for (let i = 0; i < maxNumber + 2; i++) {
                                    teamList[roomNumber][i] = undefined;
                                }
                                replier.reply("[" + roomNumber + "]번 파티가 삭제되었습니다.");
                            } else {
                                replier.reply("[" + roomNumber + "]번 파티를 확인할 수 없습니다.");
                            }
                        }
                    } else if (partyDeletePermission == 1) {
                        if (roomNumber <= teamList.length) {
                            for (let i = 0; i < maxNumber + 2; i++) {
                                teamList[roomNumber][i] = undefined;
                            }
                            replier.reply("[" + roomNumber + "]번 파티가 삭제되었습니다.");
                        } else {
                            replier.reply("[" + roomNumber + "]번 파티를 확인할 수 없습니다.");
                        }
                    } else {
                        replier.reply("[" + roomNumber + "]번 파티를 확인할 수 없습니다. 혹은 권한이 없습니다. 🧐");
                    }
                } catch (e) {
                    replier.reply("🤯 해당 번호의 파티를 확인할 수 없습니다.");
                }
            } else {
                replier.reply("🤔 번호를 입력해 주세요!\nex)/삭제2");
            }
        }

        //목록 보기
        if (msg == "/목록" || msg == "/ㅁㄹ") {
            printTeamList();
        }

        //특정 파티 목록 보기
        if (msg.replace(/[0-9]/gi, "") == "/파티" && msg.indexOf("파티제목") == -1) {
            let wantRoomNum = msg.replace(/[^0-9]/g, "");
            try {
                if (teamList[wantRoomNum][maxNumber + 1] != undefined) {
                    searchForASpecificRoom(wantRoomNum);
                } else {
                    replier.reply("🤔파티 번호를 확인하세요.");
                }
            } catch (e) {
                replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
            }
        }

        //원정 종료
        if (msg == "/원정끝" || msg == "/원정 끝" || msg == "/원정종료" || msg == "/원정 종료") {
            shutdown();
        }
    }

    //인챗 권한 변경 코드
    if (inChatSettingPermissin == 1) {
        let authority = 0;

        if (msg == "/삭제권한") {
            authority = authorityCheck();

            if (partyDeletePermission == 1 && authority == 1) {
                partyDeletePermission = 0;
                replier.reply("삭제 권한이 비공개로 변경됨");
            } else if (partyDeletePermission == 0 && authority == 1) {
                partyDeletePermission = 1;
                replier.reply("삭제 권한이 공개로 변경됨");
            } else {
                replier.reply("권한이 없습니다.");
            }
        }
        if (msg == "/게스트권한") {
            authority = authorityCheck();

            if (addGuestPermissin == 1 && authority == 1) {
                addGuestPermissin = 0;
                replier.reply("게스트 추가 권한이 비공개로 변경됨");
            } else if (addGuestPermissin == 0 && authority == 1) {
                addGuestPermissin = 1;
                replier.reply("게스트 추가 권한이 공개로 변경됨");
            } else {
                replier.reply("권한이 없습니다.");
            }
        }
        if (msg == "/취소권한") {
            authority = authorityCheck();

            if (rightToCancel == 1 && authority == 1) {
                rightToCancel = 0;
                replier.reply("취소 권한이 비공개로 변경됨");
            } else if (rightToCancel == 0 && authority == 1) {
                rightToCancel = 1;
                replier.reply("취소 권한이 공개로 변경됨");
            } else {
                replier.reply("권한이 없습니다.");
            }
        }
        if (msg.indexOf("/인원변경") != -1) {
            authority = authorityCheck();

            if (authority == 1) {
                replier.reply("원정이 자동으로 종료되고 인원수가 변경됩니다.");
                let getMsg = msg;
                if (msg.indexOf("/인원변경 ") != -1) {
                    getMsg = msg.replace(" ", "");
                }
                getMsg = getMsg.replace("/인원변경", "");
                shutdown();
                maxNumber = getMsg;
                replier.reply("인원이 " + maxNumber + "명으로 변경되었습니다.");
            } else {
                replier.reply("권한이 없습니다.");
            }
        }
        if (msg == "/제목수정권한") {
            authority = authorityCheck();

            if (partyNameEditPermission == 1 && authority == 1) {
                partyNameEditPermission = 0;
                replier.reply("파티 제목 수정 권한이 비공개로 변경됨");
            } else if (partyNameEditPermission == 0 && authority == 1) {
                partyNameEditPermission = 1;
                replier.reply("파티 제목 수정 권한이 공개로 변경됨");
            } else {
                replier.reply("권한이 없습니다.");
            }
        }
    }

    if (msg == "/권한잠금") {
        //최고 관리자가 제어할 수 있음. 권한 수정 잠금 장치
        if (sender == masterUserName[0]) {
            if (inChatSettingPermissin == 1) {
                inChatSettingPermissin = 0;
                replier.reply("권한 수정이 잠겼습니다.");
            } else {
                inChatSettingPermissin = 1;
                replier.reply("권한 수정 잠금이 해제되었습니다.");
            }
        } else {
            replier.reply("접근 권한이 없습니다.");
        }
    }

    //게스트 추가
    function guestAdd() {
        let getMsg = msg;
        if (msg.indexOf("/게스트 ") != -1) {
            getMsg = msg.replace(" ", "");
        }
        let msgData = getMsg.split(" "); //게스트1 ㅇㅇ
        let wantRoomNum = msgData[0].replace("/게스트", "");
        let saveText = "";
        try {
            if (teamList[wantRoomNum][maxNumber + 1] != undefined) {
                for (let i = 2; i < maxNumber + 1; i++) {
                    if (teamList[wantRoomNum][i] == undefined) {
                        for (let i2 = 1; i2 < msgData.length; i2++) {
                            if (i2 == msgData.length - 1) {
                                saveText += msgData[i2];
                            } else {
                                saveText += msgData[i2] + " ";
                            }
                        }
                        teamList[wantRoomNum][i] = saveText;
                        searchForASpecificRoom(wantRoomNum);
                        break;
                    }
                }
            } else {
                replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
            }
        } catch (e) {
            replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
        }
    }

    //게스트 호스트 추가
    function guestHostAdd() {
        let getMsg = msg;
        if (msg.indexOf("/게스트호스트 ") != -1) {
            getMsg = msg.replace(" ", "");
        }
        getMsg = getMsg.replace("/게스트호스트", "");
        let saveText;
        let msgData = getMsg.split(" ");
        let wantRoomNum = msgData[0].replace("/게스트호스트", "");
        if (teamList[wantRoomNum][maxNumber + 1] != undefined) {
            if (teamList[wantRoomNum][1] == undefined) {
                for (let i2 = 1; i2 < msgData.length; i2++) {
                    if (i2 == msgData.length - 1) {
                        saveText += msgData[i2];
                    } else {
                        saveText += msgData[i2] + " ";
                    }
                }
                teamList[wantRoomNum][1] = saveText;
                searchForASpecificRoom(wantRoomNum);
            } else {
                replier.reply("🤯 이미 호스트가 있는지 확인해 주세요!");
            }
        } else {
            replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
        }
    }

    //파티 이름 수정
    function editPartyTitle() {
        let msgData = msg.split(" ");
        let wantRoomNum = msg.split(" ")[0].replace(/[^0-9]/g, "");
        let saveText;
        try {
            if (teamList[wantRoomNum][maxNumber + 1] != undefined) {
                for (let i2 = 1; i2 < msgData.length; i2++) {
                    if (i2 == msgData.length - 1) {
                        saveText += msgData[i2];
                    } else {
                        saveText += msgData[i2] + " ";
                    }
                }
                teamList[wantRoomNum][0] = saveText;
                searchForASpecificRoom(wantRoomNum);
            } else {
                replier.reply("🤔파티 번호를 확인하세요.");
            }
        } catch (e) {
            replier.reply("🤔 그 파티는 없는 것 같습니다.. 번호를 확인해 주세요!");
        }
    }

    //강제 참여 제거
    function forceUserRemoval() {
        let getMsg = msg;
        if (msg.indexOf("/강제취소 ") != -1) {
            getMsg = msg.replace(" ", "");
        }
        let roomNumber = getMsg.replace("/강제취소", "").split(" ")[0];
        for (let i = 1; i < maxNumber + 1; i++) {
            if (teamList[roomNumber][i] != undefined) {
                if (teamList[roomNumber][i].split(" ")[0] == getMsg.split(" ")[1]) {
                    delete teamList[roomNumber][i];
                    searchForASpecificRoom(roomNumber);
                    break;
                }
            }
        }
    }

    function printTeamList() {
        if (teamList.length > 0) {
            var count = 0;
            var postMsg = "";
            var fullRoomNumber = teamList.length;
            for (var i = 1; i < fullRoomNumber; i++) {
                try {
                    if (teamList[i][maxNumber + 1] != undefined) {
                        postMsg = "<" + i + "파티> " + teamList[i][0] + "\n" + "호스트 : " + teamList[i][1];
                        for (let p = 2; p <= maxNumber; p++) {
                            postMsg += "\n" + p + ". " + teamList[i][p];
                        }
                        postMsg += "\n------------------------------------\n" + "명령어: /참여 파티번호 여제 투력\n" + "출발 2분 전까지 인겜\n" + "안오신 분은 멘션 부탁드립니다";
                        replier.reply(postMsg.replace(/undefined/g, ""));
                        count++;
                    }
                } catch (e) {
                    replier.reply("🤯 오류가 발생하였습니다.");
                }
            }
            if (count == 0) {
                replier.reply("🤔 현재 있는 파티가 없는 것 같습니다.");
            }
        } else {
            replier.reply("🤔 현재 있는 파티가 없는 것 같습니다.");
        }
    }

    function searchForASpecificRoom(c) {
        try {
            if (teamList[c][maxNumber + 1] != undefined) {
                postMsg = "<" + c + "파티> " + teamList[c][0] + "\n" + "호스트 : " + teamList[c][1];
                for (let p = 2; p <= maxNumber; p++) {
                    postMsg += "\n" + p + ". " + teamList[c][p];
                }
                postMsg += "\n------------------------------------\n" + "명령어: /참여 파티번호 여제 투력\n" + "출발 2분 전까지 인겜\n" + "안오신 분은 멘션 부탁드립니다";
                replier.reply(postMsg.replace(/undefined/g, ""));
            }
        } catch (e) {
            replier.reply("🤯 파티 정보를 불러오던 중 오류가 발생하였습니다.");
        }
    }

    function shutdown() {
        for (let i = 0; i <= teamList.length; i++) {
            teamList.pop();
        }
        replier.reply("🗑 파티모집이 종료되어 초기화 되었습니다.");
        run = 0;
    }

    function authorityCheck() {
        //권한 확인
        for (let i = 0; i < masterUserName.length; i++) {
            if (masterUserName[i] == sender) {
                return 1;
            }
        }
    }
}
