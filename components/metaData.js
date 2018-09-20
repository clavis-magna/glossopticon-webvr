//
// Holder for all of the data for each language point
// every data point has one metaData component atttached
// this component is added along with its schema data by the loader component
//

AFRAME.registerComponent('meta-data', {
  schema:{
    numSpeakers: {type: 'number', default: 0},
    name: {type: 'string', default: ""},
    country: {type: 'string', default: ""},
    linktext2: {type: 'string', default: ""},
    linkurl2: {type: 'string', default: ""},
    grammar: {type: 'number', default: 0},
    lexicon: {type: 'number', default: 0},
    texts: {type: 'number', default: 0},
    hasAudio: {type: 'boolean', default: false},
    documentationScore: {type: 'number', default: 0},
    showAll: {type: 'boolean', default: false},
  },

  init: function () {
  }
});
