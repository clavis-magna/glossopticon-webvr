//
// keep player above a certain yHeight
//

AFRAME.registerComponent('keep-above', {
  schema: {
    yHeight: {
      type: 'number',
      default: 0.1
    },
  },

  tick: function() {
    if (this.el.getAttribute('position').y < this.data.yHeight) {
      this.el.setAttribute('position', {
        x: this.el.getAttribute('position').x,
        y: this.data.yHeight + 0.01,
        z: this.el.getAttribute('position').z
      });
    }
  },
});
