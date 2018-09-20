//
// Sets up the environment and loads all of the data into the components that needs it
// aim to move dat.gui usage to an 'in VR' GUI
//

AFRAME.registerComponent('loader', {

  init: function() {

    this.languageData = {};

    //
    // test for ios
    // initiates audio on first screen touch
    // needed as ios needs a user interaction to initiate audio
    //

    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS) {
      this.el.addEventListener('touchstart', function(evt) {
        var allSound = document.querySelectorAll('[sound]');
        for (i = 0; i < allSound.length; i++) {
          if (allSound[i].getAttribute('audio-controller').isPlaying) {
            allSound[i].components.sound.pauseSound();
            allSound[i].components.sound.playSound();
          }
        }
      });
    }

    var _this = this;

    // array to store a list of unique county names present in the json data
    this.countryNames = [];

    // get the language data json file and add unique countries
    // that exist within it to the countryNames array.
    $.getJSON('./data/glossopticon-78ffd-export.json', function(data) {
      _this.languageData = data;
      for (let i = 0; i < _this.languageData.length; i++) {
        if (_this.countryNames.indexOf(_this.languageData[i].country) === -1) {
          _this.countryNames.push(_this.languageData[i].country);
        }
      }

      // once we have finished building this list
      // use run setUpGUI with the list as a parameter
      _this.setUpGUI(_this.countryNames);
    });
  },

  //
  // setUpGUI function
  // to create the initialising GUI
  // takes an array of country names
  //
  setUpGUI: (function(names) {
    var _this = this;
    // create a new dat.GUI
    var gui = new dat.GUI();
    // object for the GUI attributes
    var mainGui = {};
    // for each county name in the array
    for (i = 0; i < names.length - 1; i++) {
      //remove any white spaces by substituting them for an underscore
      names[i] = names[i].split(' ').join('_');
      //
      var a = names[i]; // eg: var a = Australia
      str = 'mainGui.' + a + ' = ' + false; // eg: this.Australia = false;
      eval(str); // runs the above string as code making rather than a string

      // add this to the GUI
      // with a label (name) having the underscore returned to a white space
      gui.add(mainGui, names[i]).name(names[i].split('_').join(' '));
    }

    // scale option
    // allows the ability to scale the environment
    // though need to build in an automatic move of the player start position
    // to compnensate for this
    mainGui.scale = 10;
    gui.add(mainGui, 'scale');

    // showAll option
    // if showAll is checked, then all data points are rendered - NOT recommended on mobile
    mainGui.showAll = false;
    gui.add(mainGui, 'showAll');

    // submit button
    var obj = {
      add: function() {
        //
        // generate a list of countries the user has selected
        // to pass to the doit function which will build the environment
        // happens when the submit button is selected
        //
        var countriesToUse = [];
        for (var j = 0; j < names.length - 1; j++) {
          //console.log("*** " + 'mainGui.' + names[j] + " .. " + eval('mainGui.' + names[j]));
          if (eval('mainGui.' + names[j])) {
            countriesToUse.push(names[j].split('_').join(' '));
          }
        }
        _this.doit(countriesToUse, mainGui.scale, mainGui.showAll);

        // remove this GUI
        gui.destroy();
      }
    };

    //  add the actual submit button
    gui.add(obj, 'add').name('submit and build');
  }),

  //
  // create the locations on the map
  // accroding to the counties the user has chosen to display
  // then destroy the GUI
  //
  doit: (function(countyList, theScale, showAll) {
    var _this = this;
    //console.log(countyList);
    // set the map to the right scale

    var thePlane = document.querySelector('#world-plane');
    thePlane.setAttribute('height', 50 * theScale);
    thePlane.setAttribute('width', 100 * theScale);

    // add each node
    //mySnapshot.forEach(function(childSnapshot) {
    for (let i = 0; i < _this.languageData.length; i++) {
      if (countyList.indexOf(_this.languageData[i].country) != -1) {

        var xyPos = _this.getXYpos(_this.languageData[i].latitude, _this.languageData[i].longitude, theScale);
        var fileName = _this.languageData[i].audiofile;

        // adding a new entity and setting its attributes
        var sceneEl = document.querySelector('a-scene');
        var entityEl = document.createElement('a-entity');
        // Do `.setAttribute()`s to initialize the entity.

        entityEl.setAttribute('geometry', {
          primitive: 'box',
          height: _this.languageData[i].numberofspeakers / 500,
          width: 0.02,
          depth: 0.02
        });

        entityEl.setAttribute('material', {
          'color': '#999',
          'shader': 'flat',
          'opacity': 1,
          'transparent': true
        });
        entityEl.setAttribute('position', {
          x: xyPos[0],
          y: 0,
          z: xyPos[1]
        });
        entityEl.setAttribute('class', 'clickable');
        entityEl.setAttribute('id', _this.guidGenerator());
        entityEl.setAttribute('cursor-listener', null);
        entityEl.setAttribute('distance-to-camera', 1000.0);
        if (!showAll) {
          entityEl.setAttribute('visible', false);
        }
        // add meta data
        entityEl.setAttribute('meta-data', {
          'numSpeakers': _this.languageData[i].numberofspeakers,
          'name': _this.languageData[i].name,
          'country': _this.languageData[i].country,
          'linkurl2': _this.languageData[i].linkurl2,
          'linktext2': _this.languageData[i].linktext2,
          'grammar': _this.languageData[i].grammar15,
          'lexicon': _this.languageData[i].lexicon15,
          'texts': _this.languageData[i].texts15,
          'documentationScore': _this.languageData[i].documentationscore,
          'showAll': showAll
        });
        if (fileName != undefined) {
          entityEl.setAttribute('audio-controller', 'audioFile', fileName);
          entityEl.setAttribute('meta-data', 'hasAudio', true);
          entityEl.setAttribute('visible', true);
        }
        sceneEl.appendChild(entityEl);
      }
    };
  }),

  //
  // returns the x,y coordinate of a lat long position from the database
  // currently hardcoded with the size in x,y of the whole world area
  // which needs to match #world-plane size
  //
  getXYpos: (function(lat, long, theScale) {
    if (long < 0) {
      long = long + 360;
    }
    //var x = (100) * (lat) / 360;
    //var y = ((50) * (long) / 180)-50;
    var x = (100 * theScale) * (lat) / 360;
    var y = ((50 * theScale) * (long) / 180) - 50 * theScale;
    return [x, y];
  }),

  guidGenerator: (function() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return ('a' + S4() + S4());
  }),
});
