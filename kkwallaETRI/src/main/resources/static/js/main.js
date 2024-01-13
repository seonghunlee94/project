$(document).ready(function() {
  document.getElementById("splashContainer").addEventListener("click", () => {
	document.getElementById("mainAudio").play();
	$("#splashContainer").hide();
	}, {once: true});
  
  $(".menuBtn").click(function(){
	clickAudio.play();
  });
  
  const mainAudio = document.getElementById("mainAudio");
  const soundIcon = $("#sound");
  soundIcon.click(function(){
    if(mainAudio.paused){
	  mainAudio.play();
      soundIcon.attr("src","img/soundOn.svg");
    } else{
	  mainAudio.pause();
	  mainAudio.currentTime=0;
	  soundIcon.attr("src","img/soundOff.svg");
    }	
  });
  
  $("#message").html("지금 기분이 어때?<br>#감정분석 #흰둥이터치");

  $(document).bind("contextmenu", function(e) {
	  return false;
  });

       
  $("#camera").change(function(e) {
    let formData = new FormData();
	const fileName = 'kkwl_' + Date.now() + '.jpg'; // 이미지 파일 이름 정하기
	formData.append('imgFile', $("#camera")[0].files[0], fileName); // formData로 이미지 파일과 이름 묶기 

	$.ajax({  // ajax 형태로 서버 전송
	  type: 'post',
	  url: '../face', // url 설정
	  cache: false,
	  data: formData,
      processData: false,
	  contentType: false,
	  success: false
	  });
	
  $("#character").attr('src', URL.createObjectURL(e.target.files[0])); // 사진 찍음과 동시에 화면 이미지 변경
	if(document.getElementById("character").getAttribute('src')!='img/dog.svg') {
		return predict();
	}
	var result;
	
  });
 		async function predict() {
		if(document.getElementById("character").getAttribute('src') == "img/dog.svg"){
			 return null; 
		}else{
	    const URL = "./my_model/";
		const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
		let model, labelContainer, maxPredictions;
	    model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
      
        let image = document.getElementById("character");
        const prediction = await model.predict(image, false);
        console.log(prediction);
        
       let array = [prediction[0].probability,prediction[1].probability,prediction[2].probability];
	   let apply =Math.max.apply(null, array);
	   let emotion;
	   console.log(apply);
	   if(apply == prediction[0].probability){
	     emotion=prediction[0].className;
	  }if(apply == prediction[1].probability){
		 emotion = prediction[1].className;
	  }if(apply == prediction[2].probability){
		 emotion = prediction[2].className;
	  }
	  console.log(emotion);
	  // emotion value가 성공적으로 들어올때 동작
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
	  }
      }  

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