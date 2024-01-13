$(document).bind("contextmenu", function (e) { return false; });
$(document).ready(function(){
	window.focus(); // Capture keys right away (by default focus is on editor)
	
	
	let camera, scene, renderer; // ThreeJS globals
	let world; // CannonJs world
	let lastTime; // Last timestamp of animation
	let stack; // Parts that stay solid on top of each other
	let overhangs; // Overhanging parts that fall down
	const boxHeight = 1; // Height of each layer
	const originalBoxSize = 3; // Original width and height of a box
	let autopilot;
	let gameEnded;
	let robotPrecision; // 자동 조종 장치
	
	const scoreElement = document.getElementById("score");
	const instructionsElement = document.getElementById("instructions");
	const resultsElement = document.getElementById("results");
	const background = document.querySelector('body');

	init();
	
	// 자동 조종 장치에서 정확도 결정하는 부분
	function setRobotPrecision() {
	  robotPrecision = Math.random() * 1 - 0.5;
	}
	
	function init() {
	  autopilot = true;
	  gameEnded = false;
	  lastTime = 0;
	  stack = [];
	  overhangs = [];
	  setRobotPrecision();
	
	  // Initialize CannonJS
	  world = new CANNON.World();
	  world.gravity.set(0, -10, 0); // Gravity pulls things down
	  world.broadphase = new CANNON.NaiveBroadphase();
	  world.solver.iterations = 40;
	
	  // Initialize ThreeJS
	  const aspect = window.innerWidth / window.innerHeight;
	  const width = 10;
	  const height = width / aspect;
	
	  camera = new THREE.OrthographicCamera(
	    width / -2, // left
	    width / 2, // right
	    height / 2, // top
	    height / -2, // bottom
	    0, // near plane
	    100 // far plane
	  );
	
	  /*
	  // If you want to use perspective camera instead, uncomment these lines
	  camera = new THREE.PerspectiveCamera(
	    45, // field of view
	    aspect, // aspect ratio
	    1, // near plane
	    100 // far plane
	  );
	  */
	
	  camera.position.set(4, 4, 4);
	  camera.lookAt(0, 0, 0);
	
	  scene = new THREE.Scene();
	
	  // Foundation
	  addLayer(0, 0, originalBoxSize, originalBoxSize);
	
	  // First layer
	  addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");
	
	  // Set up lights
	  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // 주변광으로 모든 방향에서 오는 빛, 없으면 물체가 보이지 않는다. 색상과 0~1사이의 강도를 지정할 수 있다.
	  scene.add(ambientLight);
	
	  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6); // 지향성광으로 pointlight와 spotlight가 있다. 태양광과 비슷한 것으로 물체의 그림자를 주는 역할
	  dirLight.position.set(10, 20, 0); // 빛이 들어오는 기울기 값이라고 생각하면 될 거 같다.
	  scene.add(dirLight);
	
	  // Set up renderer  
	  renderer = new THREE.WebGLRenderer({ background, antialias: true ,alpha: true });   // scene과 camera를 제공할 때 실제 이미지를 html 캔버스로 렌더링 하는 부분
	  renderer.setSize(window.innerWidth, window.innerHeight);  // 브라우저에 표시되는 상자의 크기를 설정하는 부분이고 앞서 설정한 부분은 상대크기이다.
	  renderer.setAnimationLoop(animation);
	  document.body.appendChild(renderer.domElement);  // 렌더링된 캔버스를 html 문서에 추가해주는 부분
	  resultsElement.style.display = "none";
	}
	
	function startGame() {
	  autopilot = false;
	  gameEnded = false;
	  lastTime = 0;
	  stack = [];
	  overhangs = [];
	
	  if (instructionsElement) instructionsElement.style.display = "none";
	  if (resultsElement) resultsElement.style.display = "none";
	  if (scoreElement) scoreElement.innerText = 0;
	
	  if (world) {
	    // Remove every object from world
	    while (world.bodies.length > 0) {
	      world.remove(world.bodies[0]);
	    }
	  }
	
	  if (scene) {
	    // Remove every Mesh from the scene
	    while (scene.children.find((c) => c.type == "Mesh")) {
	      const mesh = scene.children.find((c) => c.type == "Mesh");
	      scene.remove(mesh);
	    }
	
	    // Foundation
	    addLayer(0, 0, originalBoxSize, originalBoxSize);
	
	    // First layer
	    addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");
	  }
	
	  if (camera) {
	    // Reset camera positions
	    camera.position.set(4, 4, 4);
	    camera.lookAt(0, 0, 0);
	  }
	}
	
	function addLayer(x, z, width, depth, direction) { // 전역 스택 배열에 상자를 추가한다.
	  const y = boxHeight * stack.length; // Add the new box one layer higher
	  const layer = generateBox(x, y, z, width, depth, false);
	  layer.direction = direction;
	  stack.push(layer);
	}
	
	function addOverhang(x, z, width, depth) {
	  const y = boxHeight * (stack.length - 1); // Add the new box one the same layer
	  const overhang = generateBox(x, y, z, width, depth, true);
	  overhangs.push(overhang);
	}
	
	function generateBox(x, y, z, width, depth, falls) {
	  // ThreeJS
	  const geometry = new THREE.BoxGeometry(width, boxHeight, depth); // 상자의 너비, 높이, 깊이 설정
	  const color = new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`);  // 채도를 30도에서 4도씩 추가하는 것
	  const material = new THREE.MeshLambertMaterial({ color,opacity: 0.5,transparent:true }); // 여러가지 옵션이 있지만 빛에 반응하는 방식의 차이 가장자리를 만드는 것으로 고급스런 처리를 할 수도 있으나 느려질수있다.
	  const mesh = new THREE.Mesh(geometry, material);
	  mesh.position.set(x, y, z);
	  scene.add(mesh);
	
	  // CannonJS
	  const shape = new CANNON.Box(
	    new CANNON.Vec3(width / 2, boxHeight / 2, depth / 2)
	  );
	  let mass = falls ? 5 : 0; // If it shouldn't fall then setting the mass to zero will keep it stationary
	  mass *= width / originalBoxSize; // Reduce mass proportionately by size
	  mass *= depth / originalBoxSize; // Reduce mass proportionately by size
	  const body = new CANNON.Body({ mass, shape });
	  body.position.set(x, y, z);
	  world.addBody(body);
	
	  return {
	    threejs: mesh,
	    cannonjs: body,
	    width,
	    depth
	  };
	}
	
	function cutBox(topLayer, overlap, size, delta) {
	  const direction = topLayer.direction;
	  const newWidth = direction == "x" ? overlap : topLayer.width;
	  const newDepth = direction == "z" ? overlap : topLayer.depth;
	
	  // Update metadata
	  topLayer.width = newWidth;
	  topLayer.depth = newDepth;
	
	  // Update ThreeJS model
	  topLayer.threejs.scale[direction] = overlap / size;
	  topLayer.threejs.position[direction] -= delta / 2;
	
	  // Update CannonJS model
	  topLayer.cannonjs.position[direction] -= delta / 2;
	
	  // Replace shape to a smaller one (in CannonJS you can't simply just scale a shape)
	  const shape = new CANNON.Box(
	    new CANNON.Vec3(newWidth / 2, boxHeight / 2, newDepth / 2)
	  );
	  topLayer.cannonjs.shapes = [];
	  topLayer.cannonjs.addShape(shape);
	}
	
	window.addEventListener("touchstart", eventHandler);
	function eventHandler() {
	  if (autopilot) startGame();
	  else splitBlockAndAddNextOneIfOverlaps();
	}
	
	function splitBlockAndAddNextOneIfOverlaps() {
	  if (gameEnded) return;
	
	  const topLayer = stack[stack.length - 1];
	  const previousLayer = stack[stack.length - 2];
	
	  const direction = topLayer.direction;
	
	  const size = direction == "x" ? topLayer.width : topLayer.depth;
	  const delta =
	    topLayer.threejs.position[direction] -
	    previousLayer.threejs.position[direction];
	  const overhangSize = Math.abs(delta);
	  const overlap = size - overhangSize;
	
	  if (overlap > 0) {
	    cutBox(topLayer, overlap, size, delta);
	
	    // Overhang
	    const overhangShift = (overlap / 2 + overhangSize / 2) * Math.sign(delta);
	    const overhangX =
	      direction == "x"
	        ? topLayer.threejs.position.x + overhangShift
	        : topLayer.threejs.position.x;
	    const overhangZ =
	      direction == "z"
	        ? topLayer.threejs.position.z + overhangShift
	        : topLayer.threejs.position.z;
	    const overhangWidth = direction == "x" ? overhangSize : topLayer.width;
	    const overhangDepth = direction == "z" ? overhangSize : topLayer.depth;
	
	    addOverhang(overhangX, overhangZ, overhangWidth, overhangDepth);
	
	    // Next layer
	    const nextX = direction == "x" ? topLayer.threejs.position.x : -10;
	    const nextZ = direction == "z" ? topLayer.threejs.position.z : -10;
	    const newWidth = topLayer.width; // New layer has the same size as the cut top layer
	    const newDepth = topLayer.depth; // New layer has the same size as the cut top layer
	    const nextDirection = direction == "x" ? "z" : "x";
	
	    if (scoreElement) scoreElement.innerText = stack.length - 1;
	    addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
	  } else {
	    missedTheSpot();
	  }
	}
	
	function missedTheSpot() {
	  const topLayer = stack[stack.length - 1];
	
	  // Turn to top layer into an overhang and let it fall down
	  addOverhang(
	    topLayer.threejs.position.x,
	    topLayer.threejs.position.z,
	    topLayer.width,
	    topLayer.depth
	  );
	  world.remove(topLayer.cannonjs);
	  scene.remove(topLayer.threejs);
	
	  gameEnded = true;
	  if (resultsElement && !autopilot) resultsElement.style.display = "flex";
	}
	
	function animation(time) {
	  if (lastTime) {
	    const timePassed = time - lastTime;
	    const speed = 0.008;
	
	    const topLayer = stack[stack.length - 1];
	    const previousLayer = stack[stack.length - 2];
	
	    // The top level box should move if the game has not ended AND
	    // it's either NOT in autopilot or it is in autopilot and the box did not yet reach the robot position
	    const boxShouldMove =
	      !gameEnded &&
	      (!autopilot ||
	        (autopilot &&
	          topLayer.threejs.position[topLayer.direction] <
	            previousLayer.threejs.position[topLayer.direction] +
	              robotPrecision));
	
	    if (boxShouldMove) {
	      // Keep the position visible on UI and the position in the model in sync
	      topLayer.threejs.position[topLayer.direction] += speed * timePassed;
	      topLayer.cannonjs.position[topLayer.direction] += speed * timePassed;
	
	      // If the box went beyond the stack then show up the fail screen
	      if (topLayer.threejs.position[topLayer.direction] > 10) {
	        missedTheSpot();
	      }
	    } else {
	      // If it shouldn't move then is it because the autopilot reached the correct position?
	      // Because if so then next level is coming
	      if (autopilot) {
	        splitBlockAndAddNextOneIfOverlaps();
	        setRobotPrecision();
	      }
	    }
	
	    // 4 is the initial camera height
	    if (camera.position.y < boxHeight * (stack.length - 2) + 4) {
	      camera.position.y += speed * timePassed;
	    }
	
	    updatePhysics(timePassed);
	    renderer.render(scene, camera);
	  }
	  lastTime = time;
	}
	
	function updatePhysics(timePassed) {
	  world.step(timePassed / 1000); // Step the physics world
	
	  // Copy coordinates from Cannon.js to Three.js
	  overhangs.forEach((element) => {
	    element.threejs.position.copy(element.cannonjs.position);
	    element.threejs.quaternion.copy(element.cannonjs.quaternion);
	  });
	}
	
	window.addEventListener("resize", () => {
	  // Adjust camera
	  console.log("resize", window.innerWidth, window.innerHeight);
	  const aspect = window.innerWidth / window.innerHeight;
	  const width = 10;
	  const height = width / aspect;
	
	  camera.top = height / 2;
	  camera.bottom = height / -2;
	
	  // Reset renderer
	  renderer.setSize(window.innerWidth, window.innerHeight);
	  renderer.render(scene, camera);
	});
	
	$('#instructions').click(function(){
		startGame();
	});
	$('#replay').click(function(){
		startGame();
	});
	$('.water-fill2').click(function(){
		startGame();
	});
	$('#home').click(function(){
		window.open("../index.html", "_self");
	});
});
