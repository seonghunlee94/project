$(document).ready(function() {
	let temp = location.href.split("?");
	let temp2 = temp[1].split("&");
	let sentenceTemp = temp2[0].split("=");
	let sentence = decodeURI(decodeURIComponent(sentenceTemp[1])); //발음테스트 지문
	let fileNameTemp = temp2[1].split("=");
	let fileName = fileNameTemp[1];  //파일이름

	$.post('../pron', {
		sentence,
		fileName
	},
		function(data) {
			try {
				data = JSON.parse(data);
				$(".overlay_bg").css({ 'visibility': 'hidden' });
				
				let ranking = data.ranking;
                let score = data.score;
				
				$.getJSON('../mainDB/pronTable.json', function(data) {
					if (ranking) {
						var filteredTable = data.filter(function(element) {
							return element.ranking == ranking;
						});
					}
					console.log(filteredTable);
					let randomNum = Math.floor(Math.random() * filteredTable.length);
					let result=filteredTable[randomNum];
					console.log(result);
					let pronMsg=result.pronMSG.split("/");
					
					$('#pronMsgMain').html(pronMsg[0]);
					$('#pronMsgSub').html(pronMsg[1]);
					$('#foodTitle').html(result.foodImg.replace(".png", ""));
					$("#foodImg").attr("src", '../foodImg/' + result.foodImg+'.png');
					$("#charImg").attr("src", '../charImg/' + result.charImg);
					$('#ranking').html(result.ranking);
					$('#alcScore').html(score);
				});
			} catch (e) {
				console.log(data);
				$('#startButton').html(data);
				$('#startButton').css({ 'width': '70vw', 'height': '16.25vh' });
				setTimeout(() => {
					window.open("../index.html", "_self");
				}, 3000);
			}
		});

	$('#home').click(function() {
		window.open("../index.html", "_self");
	});
});