//
// setup changes for entering and exting VR on mobile devices
//

AFRAME.registerComponent('enter-exit', {
  init: function() {
    var mainCamera = document.querySelector('#camera');
    var sidePanel = document.querySelector('.side-panel');

    // only if device is mobile
    if (AFRAME.utils.device.isMobile()) {
      mainCamera.setAttribute('universal-controls', 'rotationControls', 'touch-rotation');
      mainCamera.setAttribute('universal-controls', 'rotationSensitivity', 0.1);
      sidePanel.style.visibility = 'visible';

      document.querySelector('a-scene').addEventListener('enter-vr', function() {
        console.log("ENTERED VR");
        mainCamera.setAttribute('universal-controls', 'rotationControls', 'hmd');
        mainCamera.setAttribute('universal-controls', 'movementControls', 'touch');
        sidePanel.style.visibility = 'hidden';
      });

      document.querySelector('a-scene').addEventListener('exit-vr', function() {
        console.log("EXITED VR");
        mainCamera.setAttribute('universal-controls', 'rotationControls', 'touch-rotation');
        mainCamera.setAttribute('universal-controls', 'rotationSensitivity', 0.1);
        mainCamera.setAttribute('universal-controls', 'movementControls', 'touch-movement');
        sidePanel.style.visibility = 'visible';
      });
    }
  },
});
