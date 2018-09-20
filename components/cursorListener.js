AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var _this = this;
    var theBox = document.querySelector('#infoGUI');
    var theBoxSurround = document.querySelector('#infoGUISurround');
    var theCamera = document.querySelector('#camera');
    var inFrontObject = document.querySelector('#inFront');
    var audioIcon = document.querySelector('#audioIcon');
    var linkIcon = document.querySelector('#linkIcon');

    offTimer = null;

    this.el.addEventListener('mouseenter', function (evt) {
      this.setAttribute('material', 'color', 'orange');
        clearTimeout(offTimer);
    });

    this.el.addEventListener('click', function (evt) {
      //clearTimeout(offTimer);
      //this.setAttribute('material', 'color', 'red');
      //console.log(evt);
      theBoxSurround.setAttribute('visible',true);
      theBox.setAttribute('visible',true);
      //theBoxSurround.emit('fade');
      //theBox.emit('fade');
      var forwardPos = new THREE.Vector3(0,0,-0.75);
      var GUIPos = inFrontObject.object3D.getWorldPosition();
      var GUIRot = theCamera.getAttribute('rotation');

      theBoxSurround.setAttribute('rotation',GUIRot);
      theBoxSurround.setAttribute('position',{x: GUIPos.x, y:GUIPos.y, z: GUIPos.z});

      var infoText = "Language: " + evt.target.getAttribute('meta-data').name +
      "\n Country: " + evt.target.getAttribute('meta-data').country +
      "\n \n Number of Speakers: " + evt.target.getAttribute('meta-data').numSpeakers;
      //"\n Grammar score: " + evt.target.getAttribute('meta-data').grammar +
      //"\n Lexicon score: " + evt.target.getAttribute('meta-data').lexicon +
      //"\n Texts score: " + evt.target.getAttribute('meta-data').texts +
      //"\n Documentation score: " + evt.target.getAttribute('meta-data').documentationScore +
      //"\n Has Audio: " + evt.target.getAttribute('meta-data').hasAudio;

      theBox.setAttribute('text','value',infoText);

      if(evt.target.getAttribute('meta-data').hasAudio){
        audioIcon.setAttribute('visible',true);
        // set the data of the audioGui so we have access to this to turn the audio on or off.
        audioIcon.setAttribute('audio-gui','audioParent',_this.el.id);
        audioIcon.setAttribute('material','color','grey');
        //audioIcon.emit('fade');
      }
      else{
        audioIcon.setAttribute('visible',false);
      }
      if (localStorage.getItem("gl_"+evt.target.getAttribute('meta-data').name) !== null){
        console.log("it's in here");
        linkIcon.setAttribute('material','color','pink');
      }
      else{
        linkIcon.setAttribute('material','color','grey');
      }
      linkIcon.setAttribute('link-gui','linkText',evt.target.getAttribute('meta-data').name);
      linkIcon.setAttribute('link-gui','linkURL',evt.target.getAttribute('meta-data').linkurl2);

    });
    this.el.addEventListener('mouseleave', function (evt) {
      this.setAttribute('material', 'color', 'grey');

      // uncomment to turn off gui if we are off the beacon for a while
      //offTimer = setTimeout(_this.turnOff, 1000,theBox,theBoxSurround);
    });
  },

  turnOff: function(theBox,theBoxSurround){
    theBoxSurround.setAttribute('visible',false);
  }
});
