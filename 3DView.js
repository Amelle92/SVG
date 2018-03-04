var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var gl;
var Initialize3DView = function () {
	var canvas = document.getElementById('ThreeDView');
	gl = canvas.getContext('webgl');

	if (!gl)
		gl = canvas.getContext('experimental-webgl');

	if (!gl)
		alert('Browser does not support WebGL');

	gl.clearColor(0.88, 0.93, 0.92, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.frontFace(gl.CCW);

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	var HouseVertices = 
	[ 
		// Top
		-1.0, .5, -1.0,   0,0,0,
		-1.0, .5, 1.0,    0,0,0,
		1.0, .5, 1.0,     0,0,0,
		1.0, .5, -1.0,    0,0,0,

		// Left
		-1.0, .5, 1.0,     0,0,0,
		-1.0, -1.0, 1.0,   0,0,0,
		-1.0, -1.0, -1.0,  0,0,0,
		-1.0, .5, -1.0,    0,0,0,

		// Right
		1.0, .5, 1.0,      0,0,0,
		1.0, -1.0, 1.0,    0,0,0,
		1.0, -1.0, -1.0,   0,0,0,
		1.0, .5, -1.0,     0,0,0,

		// Front
		1.0, .5, 1.0,      0,0,0,
		1.0, -1.0, 1.0,    0,0,0,
		-1.0, -1.0, 1.0,   0,0,0,
		-1.0, .5, 1.0,     0,0,0,

		// Back
		1.0, .5, -1.0,     0,0,0,
		1.0, -1.0, -1.0,   0,0,0,
		-1.0, -1.0, -1.0,  0,0,0,
		-1.0, .5, -1.0,    0,0,0,

		// Bottom
		-1.0, -1.0, -1.0,   0,0,0,
		-1.0, -1.0, 1.0,    0,0,0,
		1.0, -1.0, 1.0,     0,0,0,
		1.0, -1.0, -1.0,    0,0,0,

		
		// Roof Side 1
		-1.2, 1.6, 0,      0, 0, 0, //24
		-1.2, .35, 1.15,    0, 0, 0, //25
		1.2, .35, 1.15,     0, 0, 0, //26

		1.2, .35, 1.15,     0, 0, 0, //27
		-1.2, 1.6, 0,      0, 0, 0, //28
		1.2, 1.6, 0,       0, 0, 0, //29

		// Roof Side 2
		-1.2, .35, -1.15,   0, 0, 0, //30 bottom corner
		-1.2, 1.6, 0.0,    0, 0, 0, //31
		1.2, 1.6, 0.0,     0, 0, 0, //32

		-1.2, .35, -1.15,   0, 0, 0, //33
		1.2, .35, -1.15,    0, 0, 0., //34
		1.2, 1.6, 0.0,     0, 0, 0, //35

		//Roof Front1
		-1.0, .5, 1.0,   .94, .89, .73, //33
		-1.0, .5, -1.0,    .94, .89, .73, //34
		-1.0, 1.6, 0.0,     .94, .89, .73, //35

		//Roof Front2
		1.0, .5, -1.0,   .94, .89, .73, //33
		1.0, .5, 1.0,    .94, .89, .73, //34
		1.0, 1.6, 0.0,     .94, .89, .73, //35

		// Front Border
		.999, .49, 1.01,      .94, .89, .73,
		.999, -.99, 1.01,    .94, .89, .73,
		-.999, -.99, 1.01,   .94, .89, .73,
		-.999, .49, 1.01,     .94, .89, .73,
		
		// Top Border
		-.999, .49, -.99,   .94, .89, .73,
		-.999, .49, .99,    .94, .89, .73,
		.999, .49, .99,     .94, .89, .73,
		.999, .49, -.99,    .94, .89, .73,

		// Left Border
		-1.001, .51, .99,     .94, .89, .73,
		-1.001, -.99, .99,   .94, .89, .73,
		-1.001, -.99, -.99,  .94, .89, .73,
		-1.001, .51, -.99,    .94, .89, .73,

		// Right Border
		1.001, .51, .99,      .94, .89, .73,
		1.001, -.99, .99,    .94, .89, .73,
		1.001, -.99, -.99,   .94, .89, .73,
		1.001, .51, -.99,     .94, .89, .73,

		// Back Border
		.999, .49, -1.01,     .94, .89, .73,
		.999, -.99, -1.01,   .94, .89, .73,
		-.999, -.99, -1.01,  .94, .89, .73,
		-.999, .49, -1.01,    .94, .89, .73,

		// Bottom Border
		-.999, -.99, -.99,   .94, .89, .73,
		-.999, -.99, .99,    .94, .89, .73,
		.999, -.99, .99,     .94, .89, .73,
		.999, -.99, -.99,    .94, .89, .73,

		// Chimney Front
		.75, .70, -.60,     0, 0, 0,
		.75, 1.70, -.60,    0, 0, 0,
		.75, 1.70, -.80,    0, 0, 0,
		.75, .70, -.80,     0, 0, 0,

		// Chimney Back
		.55, .70, -.60,     0, 0, 0,
		.55, 1.70, -.60,    0, 0, 0,
		.55, 1.70, -.80,    0, 0, 0,
		.55, .70, -.80,     0, 0, 0,

		// Chimney Left
		.55, .70, -.60,     .67, .15, .15,
		.55, 1.70, -.60,    .67, .15, .15,
		.75, 1.70, -.60,    .67, .15, .15,
		.75, .70, -.60,     .67, .15, .15,

		// Chimney Right
		.55, .70, -.80,     .67, .15, .15,
		.55, 1.70, -.80,    .67, .15, .15,
		.75, 1.70, -.80,    .67, .15, .15,
		.75, .70, -.80,     .67, .15, .15,

		//Chimney Front Border
		.751, .71, -.61,     .67, .15, .15,
		.751, 1.69, -.61,    .67, .15, .15,
		.751, 1.69, -.79,    .67, .15, .15,
		.751, .71, -.79,     .67, .15, .15,

		// Chimney Back Border
		.54, .71, -.61,     .67, .15, .15,
		.54, 1.69, -.61,    .67, .15, .15,
		.54, 1.69, -.79,    .67, .15, .15,
		.54, .71, -.79,     .67, .15, .15,

		// Left Side Window
		-.65, .10, 1.011,      .79, .99, .99,
		-.65, -.35, 1.011,    .79, .99, .99,
		-.30, -.35, 1.011,   .79, .99, .99,
		-.30, .10, 1.011,     .79, .99, .99,

		// Right Side Window
		.65, .10, 1.011,      .79, .99, .99,
		.65, -.35, 1.011,    .79, .99, .99,
		.30, -.35, 1.011,   .79, .99, .99,
		.30, .10, 1.011,     .79, .99, .99,

		//Left Side Window 2
		-.65, .10, -1.011,     .79, .99, .99,
		-.65, -.35, -1.011,   .79, .99, .99,
		-.30, -.35, -1.011,  .79, .99, .99,
		-.30, .10, -1.011,    .79, .99, .99,

		//Right Side Window 2
		.65, .10, -1.011,     .79, .99, .99,
		.65, -.35, -1.011,   .79, .99, .99,
		.30, -.35, -1.011,  .79, .99, .99,
		.30, .10, -1.011,    .79, .99, .99,

		//Left Front Window
		1.002, .20, .70,      .79, .99, .99,
		1.002, -.25, .70,    .79, .99, .99,
		1.002, -.25, .35,   .79, .99, .99,
		1.002, .20, .35,     .79, .99, .99,

		//Left Front Window
		1.002, .20, -.70,      .79, .99, .99,
		1.002, -.25, -.70,    .79, .99, .99,
		1.002, -.25, -.35,   .79, .99, .99,
		1.002, .20, -.35,     .79, .99, .99,

		//Front Door
		1.002, -.30, -.15,      .67, .15, .15,
		1.002, -1, -.15,    .67, .15, .15,
		1.002, -1, .15,   .67, .15, .15,
		1.002, -.30, .15,     .67, .15, .15
	];

	var HouseIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23,

		//Roof
		24, 25, 26,
		27, 28, 29,
		30, 31, 32,
		33, 34, 35,

		//Roof front
		36, 37, 38,
		39, 40, 41,

		//Front border
		43, 42, 44,
		45, 44, 42,
		
		// Top Border
		46, 47, 48,
		46, 47, 49,

		// Left Border
		51, 50, 52,
		52, 50, 53,

		// Right Border
		54, 55, 56,
		54, 56, 57,

		// Back Border
		59, 58, 60,
		61, 60, 58,

		// Bottom Border
		63, 62, 64,
		64, 62, 65,

		//Chimney Front
		67, 66, 68,
		68, 66, 69,

		//Chimney Back
		71, 70, 72,
		72, 70, 73,

		//Chimney Left
		75, 74, 76,
		76, 74, 77,

		//Chimney Right
		79, 78, 80,
		80, 78, 81,

		//Chimney Front Border
		83, 82, 84,
		84, 82, 85,

		//Chimney Back Border
		87, 86, 88,
		88, 86, 89,

		//Left Side Window
		91, 90, 92,
		92, 90, 93,

		//Right Side Window
		95, 94, 96,
		96, 94, 97,

		//Left Side Window 2
		99, 98, 100,
		100, 98, 101,

		//Right Side Window 2
		103, 102, 104,
		104, 102, 105,

		//Left Front Window 
		107, 106, 108,
		108, 106, 109,
		
		//Right Front Window 
		111, 110, 112,
		112, 110, 113,

		//Right Front Window 
		115, 114, 116,
		116, 114, 117
	];

	var HouseVertBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, HouseVertBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(HouseVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(HouseIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.vertexAttribPointer(
		colorAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,
		3 * Float32Array.BYTES_PER_ELEMENT
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 2, -5], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	gl.clearColor(0.88, 0.93, 0.92, 1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	
	var Rotateloop = function () {
		if(Rotate3DClicked) {
			angle = performance.now() / 1000 / 6 * 2 * Math.PI;
			mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
			mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
			mat4.mul(worldMatrix, yRotationMatrix, mat4.identity(identityMatrix));
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
			gl.clearColor(0.88, 0.93, 0.92, 1.0);
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
			requestAnimationFrame(Rotateloop);
		}
	};
	requestAnimationFrame(Rotateloop);
	
	//Click handler for auto 3D rotating
	var Rotate3DClicked = true;
	function Rotate3DHandler() {
  		if(Rotate3DClicked) {
  			Rotate3DClicked = false;
  		}
  		else {
  			Rotate3DClicked = true;
  			requestAnimationFrame(Rotateloop);
  		}
	}
	var Rotate3DButton = document.getElementById('rotate3D');
	Rotate3DButton.addEventListener('click', Rotate3DHandler);

	//Click handler for dimetric view
	function IsometricView() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var yRotate = new Float32Array(16);
  		var anglex = 30 * Math.PI/180;
  		var angley = 45 * Math.PI/180;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.rotate(yRotate, identityMatrix, angley, [0, 1, 0]);
		mat4.mul(worldMatrix, xRotate, yRotate);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var IsometricButton = document.getElementById('Isometric');
	IsometricButton.addEventListener('click', IsometricView);

	//Click handler for dimetric view
	function DimetricView() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var yRotate = new Float32Array(16);
  		var anglex = 10 * Math.PI/180;
  		var angley = 45 * Math.PI/180;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.rotate(yRotate, identityMatrix, angley, [0, 1, 0]);
		mat4.mul(worldMatrix, xRotate, yRotate);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var DimetricButton = document.getElementById('Dimetric');
	DimetricButton.addEventListener('click', DimetricView);

	//Click handler for trimetric view
	function TrimetricView() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var yRotate = new Float32Array(16);
  		var anglex = 22.5 * Math.PI/180;
  		var angley = 60 * Math.PI/180;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.rotate(yRotate, identityMatrix, angley, [0, 1, 0]);
		mat4.mul(worldMatrix, xRotate, yRotate);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var TrimetricButton = document.getElementById('Trimetric');
	TrimetricButton.addEventListener('click', TrimetricView);

	//Click handler for Oblique view
	function ObliqueView() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var yRotate = new Float32Array(16);
  		var anglex = -30 * Math.PI/180;
  		var angley = 60 * Math.PI/180;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.rotate(yRotate, identityMatrix, angley, [0, 1, 0]);
		mat4.mul(worldMatrix, xRotate, yRotate);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var ObliqueButton = document.getElementById('Oblique');
	ObliqueButton.addEventListener('click', ObliqueView);

	//Click handler for 1 point view
	function OnePointView() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var yRotate = new Float32Array(16);
  		var anglex = -15 * Math.PI/180;
  		var angley = 0 * Math.PI/180;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.rotate(yRotate, identityMatrix, angley, [0, 1, 0]);
		mat4.mul(worldMatrix, xRotate, yRotate);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var OnePointButton = document.getElementById('OnePoint');
	OnePointButton.addEventListener('click', OnePointView);

	//Click handler for 2 point view
	function TwoPointView() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var yRotate = new Float32Array(16);
  		var anglex = -25 * Math.PI/180;
  		var angley = -45 * Math.PI/180;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.rotate(yRotate, identityMatrix, angley, [0, 1, 0]);
		mat4.mul(worldMatrix, xRotate, yRotate);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var TwoPointButton = document.getElementById('TwoPoint');
	TwoPointButton.addEventListener('click', TwoPointView);

	//Click handler for 3 point view
	function ThreePointView() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var yRotate = new Float32Array(16);
  		var anglex = 20 * Math.PI/180;
  		var angley = -45 * Math.PI/180;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.rotate(yRotate, identityMatrix, angley, [0, 1, 0]);
		mat4.mul(worldMatrix, xRotate, yRotate);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var ThreePointButton = document.getElementById('ThreePoint');
	ThreePointButton.addEventListener('click', ThreePointView);

	//input handler for 3D rotate X
	function ThreeDRotatex() {
  		Rotate3DClicked = false;

  		var xRotate = new Float32Array(16);
  		var anglex = ((document.getElementById('Sliderx').value - document.getElementById('prevSliderx').value) * Math.PI/180);
  		document.getElementById('prevSliderx').value = document.getElementById('Sliderx').value;

		mat4.rotate(xRotate, identityMatrix, -anglex, [1, 0, 0]);
		mat4.mul(worldMatrix, xRotate, worldMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var SliderX = document.getElementById('Sliderx');
	SliderX.addEventListener('input', ThreeDRotatex);

	//input handler for 3D rotate X
	function ThreeDRotatey() {
  		Rotate3DClicked = false;

  		var yRotate = new Float32Array(16);
  		var angley = ((document.getElementById('Slidery').value - document.getElementById('prevSlidery').value) * Math.PI/180);
  		document.getElementById('prevSlidery').value = document.getElementById('Slidery').value;

		mat4.rotate(yRotate, identityMatrix, -angley, [0, 1, 0]);
		mat4.mul(worldMatrix, yRotate, worldMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var SliderY = document.getElementById('Slidery');
	SliderY.addEventListener('input', ThreeDRotatey);


	//Drag translate sliders
	var mousedown = false;
	var mouseup = true;
	function TranslateHouse(num) {
  		Rotate3DClicked = false;

  		var TransM = new Float32Array(16);
  		var xTrans = 0;
  		var yTrans = 0;
  		var zTrans = 0;

  		if(num == 1) {
  			var xTrans = (document.getElementById('TransSliderx').value - document.getElementById('prevTransSliderx').value);
  			document.getElementById('prevTransSliderx').value = document.getElementById('TransSliderx').value;
  		}
  		if(num == 2) {
  			var yTrans = (document.getElementById('TransSlidery').value - document.getElementById('prevTransSlidery').value);
  			document.getElementById('prevTransSlidery').value = document.getElementById('TransSlidery').value;
  		}
  		if(num == 3) {
  			var zTrans = (document.getElementById('TransSliderz').value - document.getElementById('prevTransSliderz').value);
  			document.getElementById('prevTransSliderz').value = document.getElementById('TransSliderz').value;
  		}

		mat4.translate(TransM, identityMatrix, [xTrans, yTrans, zTrans]);
		mat4.mul(worldMatrix, TransM, worldMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.88, 0.93, 0.92, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, HouseIndices.length, gl.UNSIGNED_SHORT, 0);
	}
	var TransSliderX = document.getElementById('TransSliderx');
	TransSliderX.addEventListener('input', function() {
    	TranslateHouse(1);
	}, false);
	var TransSliderY = document.getElementById('TransSlidery');
	TransSliderY.addEventListener('input', function() {
    	TranslateHouse(2);
	}, false);
	var TransSliderZ = document.getElementById('TransSliderz');
	TransSliderZ.addEventListener('input', function() {
    	TranslateHouse(3);
	}, false);
};