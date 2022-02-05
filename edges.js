'use strict';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const maxConnectionLength = 200;
const decelerator = 8;
let width = window.innerWidth;
let height = window.innerHeight;
let totalPixels = width * height;
let numberOfPoints = totalPixels / 10000;	
let pointsArr = [];
let mouseX = 0;
let mouseY = 0;
const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;
let spawnProtection = 0;
let touching = false;

// Mouse handling
let primaryMouseButtonDown = false;
function setPrimaryButtonState(e) {
    var flags = e.buttons !== undefined ? e.buttons : e.which;
    primaryMouseButtonDown = (flags & 1) === 1;
}
document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);
document.addEventListener('mousemove', (e) => {
    setPrimaryButtonState(e);
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Touch handling
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
document.addEventListener("touchend", touchstop);

function touchstop() {
	touching = false;
}

// Touch handler function
function touchHandler(e) {
	if (e.touches.length == 1) {
		e.preventDefault();
		mouseX = e.touches[0].clientX;
		mouseY = e.touches[0].clientY;
		touching = true;
	}
}


// --------------------------------------------------
// Points class
// --------------------------------------------------
class point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.velX = randomVelocity();
		this.velY = randomVelocity();
		this.radius = 2;
	}
	update() {
		if (this.x < 2) {
			this.x = 3; // Teleport within bounds
			this.velX *= -1; // Invert velocity
		} else if (this.x > width - 2) {
			this.x -= 3; // Teleport within bounds
			this.velX *= -1; // Invert velocity
		} else {
			this.x += this.velX;
		}
		// Update the Y positions
		if (this.y < 2) {
			this.y = 3; // Teleport within bounds
			this.velY *= -1; // Invert velocity
		} else if (this.y > height - 2) {
			this.y -= 3; // Teleport within bounds
			this.velY *= -1; // Invert velocity
		} else {
			this.y += this.velY;
		}
	}
	draw() {
		paintCircleAt(this.x, this.y, this.radius);
	}
}

// --------------------------------------------------
// Helper functions
// --------------------------------------------------
const randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomVelocity = function () {
	let num =
		(Math.random() / decelerator) * (Math.round(Math.random()) ? 1 : -1);
	return num;
};

const getPoints = function (nr, maxX, maxY) {
	const points = [];
	for (let i = 0; i < nr; i++) {
		const x = randomInt(0, maxX);
		const y = randomInt(0, maxY);
		points.push(new point(x, y));
	}
	return points;
};

const paintCircleAt = function (x, y, size) {
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fill();
	ctx.stroke();
};

const drawLine = function (x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
	ctx.stroke();
};

// Mesure distance between two points
const distance = function (x1, y1, x2, y2) {
	const a = x1 - x2;
	const b = y1 - y2;
	return Math.sqrt(a * a + b * b);
};

// Make sure canvas is the same size as the viewport
function fitCanvasToViewport () { 
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	pointsArr = getPoints(numberOfPoints, width, height);
};
fitCanvasToViewport();
window.addEventListener('resize', fitCanvasToViewport);

// Animation loop
const step = function (timestamp) {
	deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
	lastTimestamp = timestamp;
	spawnProtection += deltaTime;
	// Update coordinates of all points
	pointsArr.forEach((current) => {
		current.update();
	});

	if(primaryMouseButtonDown || touching) {
		// Check if mouse is within canvas
		if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && spawnProtection > 3) {
			spawnProtection = 0;
			// Span a new point at mouse position
			pointsArr.shift();
			pointsArr.push(new point(mouseX, mouseY));
		}
	}

	// Clear canvas and repaint everything
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	pointsArr.forEach((current) => current.draw());

	// Calculate and draw connecting lines
	pointsArr.forEach((current, i, arr) => {
		for (let i = 0; i < arr.length; i++) {
			if (distance(current.x, current.y, arr[i].x, arr[i].y) < maxConnectionLength)
				drawLine(current.x, current.y, arr[i].x, arr[i].y);
		}
	});
	window.requestAnimationFrame(step);
};

// Start animation
window.requestAnimationFrame(step);
