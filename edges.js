'use strict';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
const maxConnectionLength = 200;
const numberOfPoints = 100;
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
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fill();
	ctx.stroke();
};

const drawLine = function ([x1, y1], [x2, y2]) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
	ctx.stroke();
};

// Mesure distance between two points
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
		let [x, y, velX, velY] = current;
		// Update the X position
		if (x < 2) {
			x = 3; // Teleport within bounds
			velX *= -1; // Invert velocity
		} else if (x > width - 2) {
			x -= 3; // Teleport within bounds
			velX *= -1; // Invert velocity
		} else {
			x += velX;
		}
		// Update the Y positions
		if (y < 2) {
			y = 3; // Teleport within bounds
			velY *= -1; // Invert velocity
		} else if (y > height - 2) {
			y -= 3; // Teleport within bounds
			velY *= -1; // Invert velocity
		} else {
			y += velY;
		}
		current[0] = x;
		current[1] = y;
		current[2] = velX;
		current[3] = velY;
	});

	// Clear canvas and repaint everything
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	pointsArr.forEach((current) => paintCircleAt(...current, 2));
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
