'use strict';

var DeviceListener = {
	listener: {},
	hisAlpha: null,
	turnThreshold: 1,
	tiltThreshold: 1,
	shakeThreshold: 2000,
	timer: 0,
	hisAcceleration: { x: 0, y: 0, z: 0 },
	start: function start() {
		var self = this;
		window.addEventListener('deviceorientation', function (e) {
			self.handleOrientation(e);
		});
		window.addEventListener("devicemotion", function (e) {
			self.handleMotion(e);
		});
	},
	finish: function finish() {
		var self = this;
		window.removeEventListener('deviceorientation', function (e) {
			self.handleOrientation(e);
		});
		window.removeEventListener("devicemotion", function (e) {
			self.handleMotion(e);
		});
	},
	addListener: function addListener(eventType, fnHandler) {
		if (typeof fnHandler !== "function") {
			console.error("device-listener parameter fnHandler must a function.");
			return;
		}
		if (this.listener === undefined) this.listener = {};
		if (this.listener[eventType] === undefined) {
			this.listener[eventType] = [];
		}
		if (this.listener[eventType].indexOf(fnHandler) === -1) {
			this.listener[eventType].push(fnHandler);
		}
	},
	removeListener: function removeListener(eventType, fnHandler) {
		if (this.listener === undefined) return;
		var listenerArray = this.listener[eventType];
		if (listenerArray !== undefined) {
			var index = listenerArray.indexOf(fnHandler);
			if (index !== -1) {
				listenerArray.splice(index, 1);
			}
		}
	},
	touchListener: function touchListener(_type, _arr) {
		var type = _type;
		var listenerArray = this.listener[type];
		if (listenerArray !== undefined) {
			for (var i = 0, len = listenerArray.length; i < len; i++) {
				listenerArray[i].apply(this, _arr);
			}
		}
	},
	hasListener: function hasListener(eventType, fnHandler) {
		if (this.listener === undefined) return false;
		if (this.listener[eventType] !== undefined && this.listener[eventType].indexOf(fnHandler) !== -1) {
			return true;
		}
		return false;
	},
	handleOrientation: function handleOrientation(event) {
		var absolute = event.absolute,
		    alpha = event.alpha,
		    beta = event.beta,
		    gamma = event.gamma;
		var orientation = window.orientation ? window.orientation : 0;
		var self = this;
		self.touchListener("deviceorientation", [event]);
		if (!isNaN(beta) && !isNaN(gamma)) {
			var sx, sy, nx, ny;
			if (beta > 0) {
				sy = beta > 90 ? 180 - beta : beta;
			} else {
				sy = beta < -90 ? -180 - beta : beta;
			}
			sx = gamma;
			switch (orientation) {
				case 0:
					nx = sx;
					ny = sy;
					break;
				case 90:
					nx = sy;
					ny = -sx;
					break;
				case 180:
					nx = -sx;
					ny = -sy;
					break;
				case -90:
					nx = -sy;
					ny = sx;
					break;
			}
			var argumentArr = [event, nx, ny];
			if (Math.abs(nx) > self.tiltThreshold || Math.abs(ny) > self.tiltThreshold) {
				self.touchListener("tilt", argumentArr);
			}
			if (nx > 0) {
				self.touchListener("righttilt", argumentArr);
			} else {
				self.touchListener("lefttilt", argumentArr);
			}
			if (ny > 0) {
				self.touchListener("downtilt", argumentArr);
			} else {
				self.touchListener("uptilt", argumentArr);
			}
		}
		if (!isNaN(alpha)) {
			if (self.hisAlpha == null) {
				self.hisAlpha = alpha;
			} else {
				var difAlpha = alpha - self.hisAlpha;
				var turnArgument = [event, alpha, difAlpha];
				if (Math.abs(difAlpha) > self.turnThreshold) {
					if (difAlpha > 0) {
						self.touchListener("ccwturn", turnArgument);
						self.touchListener("turn", turnArgument);
					} else if (difAlpha < 0) {
						self.touchListener("cwturn", turnArgument);
						self.touchListener("turn", turnArgument);
					}
					self.hisAlpha = alpha;
				}
			}
		}
	},
	handleMotion: function handleMotion(event) {
		var self = this;
		var curTime = new Date().getTime();
		self.touchListener("devicemotion", [event]);
		if (curTime - self.timer > 100) {
			var acceleration = event.accelerationIncludingGravity;
			var difTime = curTime - self.timer;
			var speed = Math.abs(acceleration.x + acceleration.y + acceleration.z - self.hisAcceleration.x - self.hisAcceleration.y - self.hisAcceleration.z) / difTime * 10000;
			self.hisAcceleration.x = acceleration.x;
			self.hisAcceleration.y = acceleration.y;
			self.hisAcceleration.z = acceleration.z;
			if (speed > self.shakeThreshold) {
				self.touchListener("shake", [event, self.hisAcceleration]);
			}
			self.timer = curTime;
		}
	}
};

module.exports = DeviceListener;