//
// Touch Rotation controls.
// Based on: https://github.com/aframevr/aframe/pull/1056
// and don mccurdy's universal controls - need to update the controls to move past A-Frame v.7
// used for controlling touch basewd rotation on non VR mobile
//

AFRAME.registerComponent('touch-rotation-controls', {
  schema: {
    enabled: { default: true },
    sensitivity: { default: 1 / 25 }
  },

  init: function () {
    this.width = window.innerWidth;
    this.touchDown = false;
    this.lookVector = new THREE.Vector2();
    this.bindMethods();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    this.lookVector.set(0, 0);
  },

  remove: function () {
    this.pause();
  },

  bindMethods: function () {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
  },

  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
      return;
    }

    canvasEl.addEventListener('touchstart', this.onTouchStart, false);
    canvasEl.addEventListener('touchmove', this.onTouchMove, false);
    canvasEl.addEventListener('touchend', this.onTouchEnd, false);
    canvasEl.addEventListener('touchcancel', this.onTouchCancel, false);
  },

  removeEventListeners: function () {
    var canvasEl = this.el.sceneEl && this.el.sceneEl.canvas;
    if (canvasEl) {
      canvasEl.removeEventListener('touchstart', this.onTouchStart, false);
      canvasEl.removeEventListener('touchmove', this.onTouchMove, false);
      canvasEl.removeEventListener('touchend', this.onTouchEnd, false);
      canvasEl.removeEventListener('touchcancel', this.onTouchCancel, false);
    }
  },

  isRotationActive: function () {
    return this.data.enabled && this.touchDown;
  },

  /**
   * Returns the sum the touch movement since last call.
   */
  getRotationDelta: function () {
    var dRotation = this.lookVector.clone().multiplyScalar(this.data.sensitivity);
    this.lookVector.set(0, 0);
    return dRotation;
  },

  onTouchMove: function (event) {
    if (!this.data.enabled || !this.touchDown) {
      return;
    }
    var touch
    if(event.touches.length > 1){
      touch = event.touches[1];
    }
    else{
      touch = event.touches[0];
    }

    if(touch.clientX > this.width / 10){
      var movementX = touch.screenX - this.previousTouchX;
      var movementY = touch.screenY - this.previousTouchY;
      this.lookVector.x += movementX;
      this.lookVector.y += movementY;

      this.previousTouchX = touch.screenX;
      this.previousTouchY = touch.screenY;
    }

  },

  onTouchStart: function (event) {
    if(event.touches.length > 1 && this.touchDown == false){
      this.touchDown = true;
      this.previousTouchX = event.touches[1].x;
  	  this.previousTouchY = event.touches[1].y;
    }
    else{
      this.touchDown = true;
      this.previousTouchX = event.touches[0].x;
  	  this.previousTouchY = event.touches[0].y;
    }
  },

  onTouchEnd: function (e) {
    if(e.touches.length == 0){
	     this.touchDown = false;
     }
  },

  onTouchCancel: function () {
    this.touchDown = false;
  }

});
