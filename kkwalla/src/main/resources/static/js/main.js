$(document).ready(function() {

	$('#message').html("지금 기분이 어때?<br>#감정분석 #흰둥이터치");

	$(document).bind("contextmenu", function(e) {
		return false;
	});

	$('#camera').change(function(e) {
		let formData = new FormData();
		const fileName = 'kkwl_' + Date.now() + '.jpg'; // 이미지 파일 이름 정하기
		formData.append('imgFile', $("#camera")[0].files[0], fileName); // formData로 이미지 파일과 이름 묶기 

		$('#character').attr('src', URL.createObjectURL(e.target.files[0])); // 사진 찍음과 동시에 화면 이미지 변경
		var result;
		$.ajax({  // ajax 형태로 서버 전송
			type: 'post',
			url: '../face', // url 설정
			cache: false,
			data: formData,
			processData: false,
			contentType: false,
			success: function(emotion) {  // emotion value가 성공적으로 들어올때 동작
				$.getJSON('../mainDB/faceTable.json', function(data) {
					if (emotion) {
						var filteredTable = data.filter(function(element) {
							return element.emotion == emotion;
						});
					}
					var randomNum = Math.floor(Math.random() * filteredTable.length);
					
					let result = filteredTable[randomNum].faceMSG;
					
					$('#message').html(result); // 서버로부터 String 데이터 리턴
				});
/*				setTimeout(() => {
				}, 10);*/
			}
		});
	});


	$('#randomTest').click(function() {
		window.open(link_random[Math.floor(Math.random() * link_random.length)], "_self");
	});

	$('#announcer').click(function() {
		location.href = 'html/pronTest.html?options=아나운서';
	});
	$('#famousSaying').click(function() {
		location.href = 'html/pronTest.html?options=술 명언';
	});
	$('#song').click(function() {
		location.href = 'html/pronTest.html?options=노래가사';
	});

	$('#blockGame').click(function() {
		window.open("gameHtml/blockGame.html", "_self");
	});
	$('#jumpGame').click(function() {
		window.open("gameHtml/jumpGame.html", "_self");
	});
	$('#randGame').click(function() {
		window.open("gameHtml/randGameIndex.html", "_self");
	});
	$('#spinGame').click(function() {
		window.open("gameHtml/spinGame.html", "_self");
	});

	var link_random = new Array();
	link_random[0] = "gameHtml/blockGame.html";
	link_random[1] = "gameHtml/jumpGame.html";
	link_random[2] = "gameHtml/randGameIndex.html";
	link_random[3] = "gameHtml/spinGame.html";
});

/*function getFaceMsg(emotion) {
	$.getJSON('../mainDB/faceTable.json', function(data) {
		if (emotion) {
			var filteredTable = data.filter(function(element) {
				return element.emotion == emotion;
			});
		}
		var randomNum = Math.floor(Math.random() * filteredTable.length);
		
		return result = filteredTable[randomNum].faceMSG;
	});

}*/

function scrollDisable() {
	$('html, body').addClass('hidden');
}
function scrollAble() {
	$('html, body').removeClass('hidden');
}
function scrollDisable() {
	$('body').addClass('scrollDisable').on('scroll touchmove mousewheel', function(e) {
		e.preventDefault();
	});
}
function scrollAble() {
	$('body').removeClass('scrollDisable').off('scroll touchmove mousewheel');
}