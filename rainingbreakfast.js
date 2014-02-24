(function() {

// constants
var FPS = 60,
    ONE_SECOND = 1000,
    BASE_SIXTEEN = 16,

    MIN_SIZE = 100,
    MAX_SIZE = 200,

    MIN_SPEED = 10,
    MAX_SPEED = 20,

    NUM_ITEMS = 3;


// window properties
var screenHeight = window.innerHeight,
    screenWidth = window.innerWidth;


// helper functions 
function randIntBetween (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem () {
	return randIntBetween(0, NUM_ITEMS - 1);
}

function vendorRequestAnimationFrame() {
	return (
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(  callback, fps ) {
			window.setTimeout( callback, ONE_SECOND / fps );
		}
	);
}

function mouseOnItem(item, x, y) {
	return (
		x >= item.pos.x &&
		x - item.pos.x <= item.dim.width &&
		y >= item.pos.y &&
		y - item.pos.y <= item.dim.height
	);
}

// item class
function Item(type) {
	// properties
	this.type = type;
	this.id = Math.random().toString(BASE_SIXTEEN).slice(2);
	this.el = document.getElementById(type);
	this.dim = {
		width: MAX_SIZE,
		height: MAX_SIZE
	};
	this.pos = {
		x: randIntBetween(0, screenWidth) - this.dim.width,
		y: 0
	};
	this.speed = {
		x: 0,
		y: randIntBetween(MIN_SPEED,MAX_SPEED)
	}
	this.clicked = false;

	// class methods
	this.isVisible = function() {
		return (this.pos.x <= screenWidth && this.pos.y <= screenHeight);
	};

	this.move = function() {
		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;
	};
}

window.onload = function() {
	// canvas variables
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        main = document.querySelector('div.main');

    // loop variables
	var frameCount = time = 0,
	    items = [],
	    types = ['waffle', 'pancake', 'egg'];

	var score = 0;

	// initialize canvas
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	canvas.addEventListener('click', click, false);
	canvas.addEventListener('hover', hover, false);
	main.appendChild(canvas);

	function click(e) {
		var x = e.clientX,
		    y = e.clientY;
		e.preventDefault();

		var removedItems = _.chain(items)
			.filter(function(item) { return mouseOnItem(item, x, y); })
			.each(function(item) {
				item.clicked = true;
				score++;
			});
	}

	function hover(e) {
		var x = e.clientX,
		    y = e.clientY;
		e.preventDefault();

		_.each(items, function(item){
			if(mouseOnItem(item,x,y)) {
				console.log('hi');
			};
		})
	}

	// animation loop
	function loop() {
		var refreshRate = randIntBetween(0.25*FPS, FPS);

		context.clearRect(0,0,screenWidth,screenHeight);
		context.save();

		frameCount++;
		if(frameCount % FPS == 0) {
			time++;
		}

		if(frameCount % refreshRate == 0) {
			var type = types[randItem()];
			items.push(new Item(type));
		}

		items = _.chain(items)
			.filter(function(item) { return (item.isVisible() && !item.clicked); })
			.each(function(item) {
				item.move();
				context.drawImage(item.el, item.pos.x, item.pos.y);
			});

		context.fillText(score, 300, 300);

		context.restore();
		requestAnimationFrame(loop, FPS);
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = vendorRequestAnimationFrame();
	}

	loop();
}

})();