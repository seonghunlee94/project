$(document).bind("contextmenu", function(e) { return false; });

const workerOptions = {
  OggOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OggOpusEncoder.wasm',
  WebMOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/WebMOpusEncoder.wasm'
};

$(document).ready(function() {
  let sentence;
  let recorder;
  const fileName = 'web_snapshot_' + Date.now() + ".wav";

  window.MediaRecorder = OpusMediaRecorder;

  $("#record").on("click", function() {
    getSentence(); // 제시어 생성
		
	navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
			
	// 크롬 호환성 문제 해결 코드
	recorder = new MediaRecorder(stream, { mimeType: 'audio/ogg' }, workerOptions); 
			
	let chunks = [];
	recorder.start(); // 녹음 시작
	recorder.addEventListener('dataavailable', (e) => { // 데이터가 들어오기 시작하면 동작하는 함수
	  chunks.push(e.data); // chunks에 집어넣는 함수
	  const blob = new Blob(chunks, { mimeType: 'audio/ogg' }); // blob으로 데이터 저장
	  const formData = new FormData();
	  formData.append('audioFile', blob, fileName); // 서버로 전송
		
	  $.ajax({
	    type: "post",
		url: "../saveRecord",
		cache: false,
		data: formData,
		processData: false,
		contentType: false,
		success: function() {
	      location.href = 'results.html?data=' + encodeURIComponent(sentence) + '&fileName=' + fileName;
					    
		}
	  });
	});
	});
  });

  function getSentence() {
    let temp = location.href.split("?");
	let temp2 = temp[1].split("=");
	let options = decodeURI(decodeURIComponent(temp2[1]));
	
	let filteredTable;
	let info;
	$.getJSON('../mainDB/sentenceTable.json', function(data) {
	  if (options) {
	    filteredTable = data.filter(function(element) {
		return element.options == options;
		});
	  }
	  let randomNum = Math.floor(Math.random() * filteredTable.length);
	  console.log(filteredTable[randomNum].sentence);
	  let result = filteredTable[randomNum];
	  if(options=="노래가사"){
		info=result.info;
	  };
	  $("#info").html(info);
	  $('#second').html(result.second);
		$('#pronTestMessage').html(result.sentence);
      sentence = result.sentence;
	  $('.progress span').animate({
	    width: $('.progress span').data('charge') + '%'
	  }, result.second * 1000);
	  
	  setTimeout(function() {
	    recorder.stop();
	  }, result.second * 1000);
	});
  };
  
  $('#home').click(function() {
    window.open("../index.html", "_self");
  });

});