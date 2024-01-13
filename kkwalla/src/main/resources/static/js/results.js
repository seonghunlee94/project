$(document).ready(function() {
  const temp = location.href.split("?");
  const temp2 = temp[1].split("&");
  const temp3 = decodeURI(decodeURIComponent(temp2[0])); 
  let result = temp3.split("=");
	
  result= JSON.parse(result[1]);
  const pronMsg=result.pronMSG.split("/");
  const score = temp2[1].split("=");
	
  $('#pronMsgMain').html(pronMsg[0]);
  $('#pronMsgSub').html(pronMsg[1]);
  $('#foodTitle').html(result.foodImg.replace(".png", ""));
  $("#foodImg").attr("src", '../foodImg/' + result.foodImg+'.png');
  $("#charImg").attr("src", '../charImg/' + result.charImg);
  $('#ranking').html(result.ranking);
  $('#alcScore').html(score[1]);
			
  $('#home').click(function() {
    window.open("../index.html", "_self");
	});
});