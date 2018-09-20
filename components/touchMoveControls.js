//
// Touch Movement controls.
// Based on don mccurdy's universal controls - need to update the controls to move past A-Frame v.7
// used for controlling touch based movement on non VR mobile
//

AFRAME.registerComponent('touch-movement-controls', {
  schema: {
      enabled: { default: true }
    },

    init: function () {
      this.width = window.innerWidth;
      this.dVelocity = new THREE.Vector3();
      this.bindMethods();
    },

    play: function () {
      this.addEventListeners();
    },

    pause: function () {
      this.removeEventListeners();
      this.dVelocity.set(0, 0, 0);
    },

    remove: function () {
      this.pause();
    },

    addEventListeners: function () {
      var sceneEl = this.el.sceneEl;
      var canvasEl = sceneEl.canvas;

      if (!canvasEl) {
        sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
        return;
      }

      canvasEl.addEventListener('touchstart', this.onTouchStart);
      canvasEl.addEventListener('touchend', this.onTouchEnd);
    },

    removeEventListeners: function () {
      var canvasEl = this.el.sceneEl && this.el.sceneEl.canvas;
      if (!canvasEl) { return; }

      canvasEl.removeEventListener('touchstart', this.onTouchStart);
      canvasEl.removeEventListener('touchend', this.onTouchEnd);
    },

    isVelocityActive: function () {
      return this.data.enabled && this.isMoving;
    },

    getVelocityDelta: function () {
      this.dVelocity.z = this.isMoving ? -1 : 0;
      return this.dVelocity.clone();
    },

    bindMethods: function () {
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);
    },

    onTouchStart: function (e) {
      console.log('on touch start in move');
      if(e.touches[0].clientX < this.width / 10){
        this.isMoving = true;
        e.preventDefault();
      }
      else{
        //this.isMoving = false;
        //e.preventDefault();
      }
    },

    onTouchEnd: function (e) {
      console.log("ending" + e.touches.length);
      if(e.touches.length == 0 || e.touches[0].clientX > this.width / 10){
        this.isMoving = false;
      }
      e.preventDefault();
    }

});
