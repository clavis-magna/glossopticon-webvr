//
// set up distance check on each data column
// the rate of the check changes based on how far we currently away from the camera 
// closer = more frequent
// this is to reduce the load on mobile devices
//

AFRAME.registerComponent('distance-to-camera', {
  schema: {
    distanceToCam: {
      type: 'number',
      default: 0.0
    },
  },

  init: function() {
    this.mainCamera = document.querySelector('#camera');
    // short delay as getting world position was failing without it.
    setTimeout(this.setUp, 10, this);
  },

  setUp: function(_this) {
    var myWorldPos = new THREE.Vector3();
    myWorldPos.setFromMatrixPosition(_this.el.object3D.matrixWorld);
    _this.myWorldXZ = new THREE.Vector2(myWorldPos.x, myWorldPos.z);
    setTimeout(_this.checkDistance, 1000, _this);
  },

  checkDistance: function(_this) {
    // calculate and set distance to camera
    var cameraPos = new THREE.Vector3();
    cameraPos.setFromMatrixPosition(_this.mainCamera.object3D.matrixWorld);
    _this.cameraPosXZ = new THREE.Vector2(cameraPos.x, cameraPos.z);
    var distanceToCamera = _this.cameraPosXZ.distanceTo(_this.myWorldXZ);
    _this.el.setAttribute('distance-to-camera', 'distanceToCam', distanceToCamera);

    // if audio component attached then check what it should be doing based on distance
    if (_this.el.getAttribute('audio-controller') != null) {
      if (distanceToCamera < 10 && !_this.el.getAttribute('audio-controller').isPlaying) {
        _this.el.components.sound.playSound();
        _this.el.setAttribute('audio-controller', 'isPlaying', true);
      } else if (distanceToCamera >= 10 && _this.el.getAttribute('audio-controller').isPlaying) {
        _this.el.components.sound.stopSound();
        _this.el.setAttribute('audio-controller', 'isPlaying', false);
      }
    }

    // make visible or not based on distance
    if (_this.el.getAttribute('meta-data').hasAudio == false && _this.el.getAttribute('meta-data').showAll == false) {
      if (distanceToCamera > 5) {
        _this.el.setAttribute('visible', false);
      } else {
        _this.el.setAttribute('visible', true);
      }
    }

    if (distanceToCamera < 1.11) {
      _this.el.setAttribute('material', 'opacity', 0.1);
    } else {
      _this.el.setAttribute('material', 'opacity', 1);
    }

    var timeTillNextCheck;
    if (distanceToCamera > 15) {
      timeTillNextCheck = distanceToCamera * 100;
    } else if (distanceToCamera > 3) {
      timeTillNextCheck = 1500;
    } else {
      timeTillNextCheck = 1000;
    }
    setTimeout(_this.checkDistance, timeTillNextCheck, _this);
  }

});
