function random() {
	return (Math.floor(Math.random() * 4) + 1); //랜덤으로 1~4 정수 값 받음
}
window.onload = (function() {
	const wheel = document.querySelector('#wheel');
	const startButton = document.querySelector('#button');
	const home = document.getElementById('home');

    $(document).bind("contextmenu", function (e) {
        return false;
    });

	let deg = 0;

	startButton.addEventListener('click', () => {
		// 병 돌아갈 때 나는 소리
		var audio = document.getElementById("audio");
		if (audio.paused) audio.play();
		else audio.pause();
		// Disable button during spin
		startButton.style.pointerEvents = 'none';
		// Calculate a new rotation between 5000 and 10 000
		deg = Math.floor(5000 + Math.random() * 5000);
		// 병 돌아가는 시간 설정
		wheel.style.transition = 'all 10s ease-out';
		// Rotate the wheel
		wheel.style.transform = `rotate(${deg}deg)`;
		// Apply the blur
		//wheel.classList.add('blur');
		// 돌아가는 동안 버튼 사라짐
		startButton.style.display = "none";
		
	});

	wheel.addEventListener('transitionend', () => {
		// Remove blur
		//wheel.classList.remove('blur');
		// Enable button when spin is over
		startButton.style.pointerEvents = 'auto';
		// Need to set transition to none as we want to rotate instantly
		wheel.style.transition = 'none';
		// Calculate degree on a 360 degree basis to get the "natural" real rotation
		// Important because we want to start the next spin from that one
		// Use modulus to get the rest value from 360
		const actualDeg = deg % 360;
		// Set the real rotation instantly without animation
		wheel.style.transform = `rotate(${actualDeg}deg)`;
		//회전 종료 후 버튼 재등장
		startButton.style.display = "block";

	});

	home.addEventListener('click', function() {
		window.open("../index.html", "_self");
	});
	
	var backImgs = ['../gameImg/spinBg1.png', '../gameImg/spinBg2.png', '../gameImg/spinBg3.png',
		'../gameImg/spinBg4.png', '../gameImg/spinBg5.png'];

	$('body').css({
		'background-image': 'url(/backImgs/' +
			backImgs[Math.floor(Math.random() * backImgs.length)] + ')'
	});
});

