//
// set up basic audio attributes including audio file and spatialisation details
// keep track of if audio is playing or not with isPlaying schema attributes
// this component is added along with its schema data by the loader component
//

AFRAME.registerComponent('audio-controller', {
    schema: {
      audioFile: {type: 'string'},
      isPlaying: {default: false}
    },

    init: function () {
      var node = this.el;

      var url = './audio/'+this.data.audioFile+'.mp3';
      node.setAttribute('sound','distanceModel','inverse');
      node.setAttribute('sound','rolloffFactor',1);
      node.setAttribute('sound','autoplay',false);
      node.setAttribute('sound','src',url);
      node.setAttribute('sound','loop',true);
    }

  });
