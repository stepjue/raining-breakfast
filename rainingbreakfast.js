(function() {

window.RB = window.RB || {};

RB.const = {
	windowHeight: window.innerHeight,
	windowWidth: window.innerWidth
};

RB.resources = {
	images: {
		waffle: 'images/waffle.png',
		pancake: 'images/pancake.png',
		doge: 'images/doge.png',
		egg: 'images/egg.png'
	}
};

RB.objects = {
	item: function(type) {
		this.type = type;
		this.img = document.createElement('img');
		this.img.src = RB.resources.images[type];
		this.dim = {
			x: 200,
			y: 200
		};
		this.pos = {
			x: RB.helpers.randIntBetween(this.dim.x, RB.const.windowWidth - this.dim.x),
			y: 0
		};
		this.speed = RB.helpers.randIntBetween(200, 800);
	},

	items: []
};

RB.init = function() {
	RB.setup.createCanvas();
	RB.setup.preloadImages();
	RB.setup.createObjects();
	RB.setup.addListeners();
	RB.play();
};

RB.pause = function() {
	window.cancelAnimationFrame(RB.core.animationFrame);
	RB.isRunning = false;
};

RB.play = function() {
	if (!RB.isRunning) {
		RB.core.then = Date.now();
		RB.core.frame();
		RB.isRunning = true;
	}
};

RB.core = {
	frame: function() {
		RB.core.setDelta();
		RB.core.update();
		RB.workers.renderObjects();
		RB.core.render();
		RB.core.animationFrame = window.requestAnimationFrame(RB.core.frame);
	},

	setDelta: function() {
		RB.core.now = Date.now();
		RB.core.delta = (RB.core.now - RB.core.then) / 1000;
		RB.core.then = RB.core.now;
	},

	update: function() {
		RB.workers.moveItems();
	},

	render: function() {
		RB.workers.clearCanvas();
		RB.workers.renderGraphics();
	}
};

RB.setup = {
	preloadImages: function() {
		var imageObj = new Image();
		_.each(RB.resources.images, function(source, name, images) {
			imageObj.src = source;
		});
	},

	addListeners: function() {
	//	window.addEventListener('resize', );
	},

	createCanvas: function() {
		RB.canvas = document.createElement('canvas');
		RB.canvas.width = RB.const.windowWidth;
		RB.canvas.height = RB.const.windowHeight;
		RB.canvas.context = RB.canvas.getContext('2d');
		document.getElementById('rainingbreakfast').appendChild(RB.canvas);
	},

	createObjects: function() {
		// Setup item timer
		RB.itemTimer = 0;
	}
};

RB.workers = {
	moveItems: function() {
		RB.objects.items = _
			.chain(RB.objects.items)
			.each(function(item) {
				var velocity = item.speed * RB.core.delta;
				item.pos.y += velocity;
			})
			.filter(function(item) {
				return item.pos.y <= RB.const.windowHeight;
			})
			.value();
	},

	clearCanvas: function() {
		RB.canvas.context.clearRect(0, 0, RB.const.windowWidth, RB.const.windowHeight);
	},

	renderGraphics: function() {
		_.each(RB.objects.items, function(item) {
			var wholePixelItemY = (item.pos.y + 0.5) | 0; // fast round to whole pixel
			RB.canvas.context.drawImage(item.img, item.pos.x, wholePixelItemY, item.dim.x, item.dim.y);
		});
	},

	renderObjects: function() {
		if(RB.itemTimer > RB.helpers.randIntBetween(0.5, 1)) {
			RB.objects.items.push(new RB.objects.item('waffle'))
			RB.itemTimer = 0;
		} else {
			RB.itemTimer += RB.core.delta;
		}
	}
};

RB.helpers = {
	randIntBetween: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

window.onload = function() {
	RB.init();
};

})();