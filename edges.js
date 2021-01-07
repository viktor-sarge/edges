'use strict';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
const maxConnectionLength = 150;
const numberOfPoints = 200;
const decelerator = 8;
ctx.canvas.width = width;
ctx.canvas.height = height;

const randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomVelocity = function () {
	let num =
		(Math.random() / decelerator) * (Math.round(Math.random()) ? 1 : -1);
	return num;
};

const getPoints = function (nr, maxX, maxY) {
	const coordinates = [];
	for (let i = 0; i < nr; i++) {
		const x = randomInt(0, maxX);
		const y = randomInt(0, maxY);
		const velX = randomVelocity();
		const velY = randomVelocity();
		coordinates.push([x, y, velX, velY]);
	}
	return coordinates;
};

const paintCircleAt = function (x, y, velX, velY, size) {
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.fillStyle = 'black';
	ctx.fill();
	ctx.stroke();
};

const drawLine = function ([x1, y1], [x2, y2]) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
};

const distance = function ([x1, y1], [x2, y2]) {
	const a = x1 - x2;
	const b = y1 - y2;
	return Math.sqrt(a * a + b * b);
};

// Create array with coordinates for all points
const pointsArr = getPoints(numberOfPoints, width, height);

// Draw initial frame
pointsArr.forEach((current) => paintCircleAt(...current, randomInt(2, 5)));
pointsArr.forEach((current, i, arr) => {
	for (let i = 0; i < arr.length; i++) {
		if (distance(current, arr[i]) < maxConnectionLength)
			drawLine(current, arr[i]);
	}
});

// Animation loop
const step = function () {
	// Update coordinates of all points
	pointsArr.forEach((current) => {
		const newPos = current; // [x,y,velX,velY]
		// Update the X position
		if (newPos[0] < 2) {
			newPos[0] = 3; // Teleport within bounds
			newPos[2] *= -1; // Invert velocity
		} else if (newPos[0] > width - 2) {
			newPos[0] -= 3; // Teleport within bounds
			newPos[2] *= -1; // Invert velocity
		} else {
			newPos[0] += newPos[2];
		}
		// Update the Y positions
		if (newPos[1] < 2) {
			newPos[1] = 3; // Teleport within bounds
			newPos[3] *= -1; // Invert velocity
		} else if (newPos[1] > height - 2) {
			newPos[1] -= 3; // Teleport within bounds
			newPos[3] *= -1; // Invert velocity
		} else {
			newPos[1] += newPos[3];
		}
	});

	// Clear canvas and repaint everything
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	pointsArr.forEach((current) => paintCircleAt(...current, 3));
	pointsArr.forEach((current, i, arr) => {
		for (let i = 0; i < arr.length; i++) {
			if (distance(current, arr[i]) < maxConnectionLength)
				drawLine(current, arr[i]);
		}
	});
	window.requestAnimationFrame(step);
};

// Start animation
window.requestAnimationFrame(step);
