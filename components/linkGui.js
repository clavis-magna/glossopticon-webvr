//
// logic for the link icon/button on the inworld GUI
// component attached to link icon plane on the GUI
//

AFRAME.registerComponent('link-gui', {
  schema: {
    linkText: {
      default: '#'
    },
    linkURL: {
      default: '#'
    },
  },

  init: function() {

    var _this = this;

    this.el.addEventListener('click', function(evt) {
      //_this.el.setAttribute('material', 'color', 'pink');
      var parentBeacon = document.querySelector("#" + _this.data.audioParent);

      if (localStorage.getItem("gl_"+_this.data.linkText) === null){
        localStorage.setItem("gl_"+_this.data.linkText, _this.data.linkURL);
        _this.el.setAttribute('material', 'color', 'pink');
      }
      else{
        localStorage.removeItem("gl_"+_this.data.linkText);
        _this.el.setAttribute('material', 'color', 'grey');
      }

      //parentBeacon.setAttribute('material', 'color', 'green');
    });

    this.el.addEventListener('mouseleave', function(evt) {
      //this.setAttribute('material', 'color', 'grey');
    });
  },
});
