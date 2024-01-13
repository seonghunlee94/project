$(document).ready(function(){
	$('#gameSelect').click(function(){
		if($(this).val()=='알아가기'){
			$(this).val('친해지기');
			$('#content1').html("<친해지기>");
			$('#content2').html("#깊은맛 #찐친만들기 #술게임 #밸런스게임 #네가_더_알고싶어졌어 #그것이_알고싶다");
		} else if ($(this).val()=='친해지기') {
			$(this).val('더 친해지기(+19)');
			$('#content1').html("<더 친해지기>");
			$('#content2').html("#혼란한맛 #친구탈출 #속깊은얘기 #TMI대전 #곤란한질문을_뽑게될지도 #그것도_알고싶다");
		} else if ($(this).val()=='더 친해지기(+19)') {
			$(this).val('알아가기');
			$('#content1').html("<알아가기>");
			$('#content2').html("#순한맛 #친해지길바래 #소개팅 #첫만남 #니가 #궁금행 #대화 #어사 #어색한사이 #나로_말할_것_같으면");
		}
	});
	
	$('#boardSize').click(function(){
		if($(this).val()=='4x4(소)'){
			$(this).val('5x5(중)');
		} else if ($(this).val()=='5x5(중)') {
			$(this).val('6x6(대)');
		} else if ($(this).val()=='6x6(대)') {
			$(this).val('4x4(소)');
		}
	});
	$('#start').click(function(){
		const gameSelect = $('#gameSelect').val();
		const boardSize = $('#boardSize').val();
		location.href = 'randGame.html?gameSelect=' + encodeURIComponent(gameSelect) + '&boardSize=' + encodeURIComponent(boardSize);	
	});
	
	for(let i=0;i<3;i++){
		$("#click").fadeTo(500, 0.9);
		//팝업 레이어 보이게
		$("#click").fadeIn(500);
	}
	
	$('#home').click(function(){
		window.open("../index.html", "_self");
	});
});