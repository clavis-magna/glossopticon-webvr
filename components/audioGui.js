//
// logic for the audio icon/button on the inworld GUI
// mutes and unmutes all other audio except the currently selected data point
// component attached to link icon plane on the GUI
//

AFRAME.registerComponent('audio-gui', {
  schema: {
    audioParent: {
      default: '#'
    },
  },

  init: function() {
    var _this = this;

    this.el.addEventListener('click', function(evt) {
      _this.el.setAttribute('material', 'color', 'pink');
      var parentBeacon = document.querySelector("#" + _this.data.audioParent);
      //parentBeacon.setAttribute('material', 'color', 'green');

      var allSound = document.querySelectorAll('[sound]');
      for (i = 0; i < allSound.length; i++) {
        allSound[i].components.sound.stopSound();
        //allSound[i].setAttribute('audio-controller','isPlaying',false);
      }
      parentBeacon.components.sound.playSound();
      //parentBeacon.setAttribute('audio-controller','isPlaying',true);

    });

    //this.el.addEventListener('click', function(evt) {});

    this.el.addEventListener('mouseleave', function(evt) {
      //this.setAttribute('material', 'color', 'grey');
    });
  },

  doit: function(data) {
    this.el.setAttribute('material', 'color', 'pink');
    console.log(data);
    var parentBeacon = document.querySelector(this.data.audioParent);

    parentBeacon.setAttribute('material', 'color', 'green');
  },
});
