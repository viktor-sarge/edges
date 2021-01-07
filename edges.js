'use strict';

console.log('Loaded the js');
const canvas = document.getElementById('myCanvas');
console.log(canvas);
const ctx = canvas.getContext('2d');
console.log(ctx);

const randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const getPoints = function (nr, maxX, maxY) {
	const coordinates = [];
	for (let i = 0; i < nr; i++) {
		const x = randomInt(0, maxX);
		const y = randomInt(0, maxY);
		coordinates.push([x, y]);
	}
	console.log(coordinates);
	return coordinates;
};

const paintCircleAt = function (x, y, size) {
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
	//console.log(x1, y1, x2, y2);
};

const distance = function ([x1, y1], [x2, y2]) {
	const a = x1 - x2;
	const b = y1 - y2;
	return Math.sqrt(a * a + b * b);
};

const pointsArr = getPoints(80, 1200, 800);
console.log(pointsArr);
pointsArr.forEach((current) => paintCircleAt(...current, randomInt(2, 5)));

pointsArr.forEach((current, i, arr) => {
	for (let i = 0; i < arr.length; i++) {
		if (distance(current, arr[i]) < 200) drawLine(current, arr[i]);
	}
});
