$(document).ready(function() {
	let temp = location.href.split("?");
	let option = temp[1].split("&");
	let gameOption = option[0].split("=");
	let gameSelect = decodeURI(decodeURIComponent(gameOption[1]));
	let boardOption = option[1].split("=");
	let boardSize = decodeURI(decodeURIComponent(boardOption[1]));
	
	const audio = $("#randomBGM");
	const randomNum = Math.floor(Math.random()*10)+1;
	audio.attr("src","../gameAudio/randomMissionBGM"+randomNum+".mp3");

  const mainAudio = document.getElementById("randomBGM");
  const soundIcon = $("#sound");
  soundIcon.click(function(){
    if(mainAudio.paused){
	  mainAudio.play();
      soundIcon.attr("src","../img/soundOn.svg");
    } else{
	  mainAudio.pause();
	  mainAudio.currentTime=0;
	  soundIcon.attr("src","../img/soundOff.svg");
    }	
  });
	
	if(boardSize==="4x4(소)") {
		boardSize=4;
	} else if (boardSize==="5x5(중)") {
		boardSize=5;
	} else if (boardSize==="6x6(대)") {
		boardSize=6
	}
	
	if(gameSelect=="연인끼리") {
		gameSelect=1;
	} else if(gameSelect=="친해지기") {
		gameSelect=2;
	} else if(gameSelect=="더 친해지기(+19)") {
		gameSelect=3;
	}
	
	create(boardSize,gameSelect);
	
	function create(boardSize,gameSelect) {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
 		canvas.height = window.innerHeight;
		const boardwidth = canvas.width; // 보드 크기
		const cw = (ch = canvas.width = canvas.height = boardwidth);
		const row = boardSize; // 칸 수
		const rowSize = boardwidth / row; // 한 칸의 너비
		let board = new Array(Math.pow(row, 2)).fill(-1); // 배열을 생성해서 -1로 채움
		  
		const replay = document.getElementById('replay');
		const main = document.getElementById('main');
		  
		const MSG = document.getElementById('MSG');
		let num;
		
		drawCard(); // 시작하면서 카드판 그리기
		// x,y 좌표를 배열의 index값으로 변환
		let xyToIndex = (x, y) => {
			return x + y * row;
		};
	
		// 배열 index값을 x,y좌표로 변환
		let indexToXy = (i) => {
			w = Math.sqrt(board.length);
			x = i % w;
			y = Math.floor(i / w); //소수점 무시
			return [x, y];
		};
		
		// 카드판 그리기 함수
		function drawCard() {
	     var img = new Image();
	     if(canvas.width<330) {
		 	img.src="../gameImg/beer_320.png";
		 } else if(330<=canvas.width<370) {
		 	img.src="../gameImg/beer_360.png";
		 } else if(370<=canvas.width<380) {
		 	img.src="../gameImg/beer_375.png";
		 } else if(380<=canvas.width<412) {
		 	img.src="../gameImg/beer_411.png";
		 } else if(412<=canvas.width<420) {
		 	img.src="../gameImg/beer_414.png";
		 }
		 img.onload = function() {
		 ctx.fillStyle=ctx.createPattern(img, "no-repeat");
		 ctx.fillRect(10, 10, 380, 180);
			ctx.fillRect(0, 0, cw, ch); // 카드판 높이, 너비 설정
			for (let x = 0; x < row; x++) { // 카드 간격 줄 설정
				for (let y = 0; y < row; y++) {
					let w = cw/ row;
					ctx.strokeStyle = "rgba(255,255,255,.3)"; // 줄 색상
					ctx.lineWidth = 2; // 줄 굵기
					ctx.strokeRect(w * x, w * y, w, w);
				}
			}
    		 }
		}
	
		//카드 변경하기
		usedCard = (x, y) => {
			for (i = 0; i < board.length; i++) {
			// 누른적 있나 확인하기
			let a = indexToXy(i)[0];
			let b = indexToXy(i)[1];  // 0,0 부터 3,3 까지 순차적으로 확인하는 함수
			
			if (board[xyToIndex(a, b)] == 2) { // 0,0값을 board의 값과 비교해서 2일 경우 누른적 있는거로 간주해서 그림 그리기
					let w = cw/ row;
					ctx.fillStyle =  "#1A171C"; // 꾸미기 &&&&&&&&&&&&&&&&&&&
					ctx.fillRect(w * x, w * y, w, w);
				}
			}
			checkEnd(); // 카드를 전부 눌렀는지 확인하는 함수
		};
		
		// 끝내는 함수
		function checkEnd() {
			count = 0;
			for(let i=0;i<board.length;i++) {
				if(board[i] == 2) {
					count++;
				}
			}
			if(board.length == count) {
				winShow();
			}
		}
	
		// 게임 종료 다시하기 메인화면 버튼 생성
		function winShow() {
			$("#result").css({'display' : 'block','z-index' : 1});
		}
	
		// 마우스 클릭한 위치를 정확한 눈금 위치로 보정
		document.addEventListener('mouseup', (e) => {
			$('#MSG').empty();
			if (e.target.id == 'canvas') {
				let x = Math.round((Math.abs(e.offsetX / rowSize)-0.5));
				let y = Math.round((Math.abs(e.offsetY / rowSize)-0.5));
				console.log(e.offsetX, e.offsetY, x, y);  // 들어온 좌표를 x,y로 변경시키겠다.
				if ( e.offsetX > 0 && e.offsetX < boardwidth && e.offsetY > 0 && e.offsetY < boardwidth ) {
					// 이미 돌이 놓여진 자리이면 비프음 출력
					if (board[xyToIndex(x, y)] != -1) {
					} else {
						// 누른적 없으면, 카드 제시어 실행
						board[xyToIndex(x, y)] = 2;  // 배열 수정
						usedCard(x, y);  // 카드 모양 변경
						
					    const flipSound = document.getElementById("flipSound"); // 카드 터치 효과음
						if (flipSound.paused) {
							flipSound.play();
						} else if (usedCard) {
							flipSound.pause();
						}
						
						switch(gameSelect) {
						case 1:
							jQuery.get("../gameDB/niceToMeetU_DB.txt", function(data){
								let man = data.split("\n");
								num = Math.floor(Math.random()*man.length);  // &&&&&&&&&&&&&&&&&&&
								MSG.append(man[num]);
							});
							break;
						case 2:
							jQuery.get("../gameDB/let'sBeFriend_DB.txt", function(data){
								let man = data.split("\n");
								num = Math.floor(Math.random()*man.length);  // &&&&&&&&&&&&&&&&&&&
								MSG.append(man[num]);
							});
							break;
						case 3:
							jQuery.get("../gameDB/wantMore_DB.txt", function(data){
								let man = data.split("\n");
								num = Math.floor(Math.random()*man.length);  // &&&&&&&&&&&&&&&&&&&
								MSG.append(man[num]);
							});
							break;
						default:
							jQuery.get("../gameDB/niceToMeetU_DB.txt", function(data){
								let man = data.split("\n");
								num = Math.floor(Math.random()*man.length);  // &&&&&&&&&&&&&&&&&&&
								MSG.append(man[num]);
							});
							break;
						}			
					}
				}	
			}
		});
		
		back.addEventListener('click',function(){
			window.open("../gameHtml/randGameIndex.html", "_self");
		});
		replay.addEventListener('click',function(){
			window.location.reload();
		});
		main.addEventListener('click',function(){
			window.open("../html/subIndex.html", "_self");
		});
	};

});