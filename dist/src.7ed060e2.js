// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/index.js":[function(require,module,exports) {
/* ARBRE */
(function () {
  'use strict'; // Constructor

  var TreeView = function TreeView($element) {
    this.isEnabled = false;
    this.element = $element;
    this.ctx = this.element.getContext('2d');
    this.element.height = 400;
    this.element.width = window.innerWidth / 2 > 500 ? window.innerWidth / 2 : 500;
    this.baseWidth = 20;
    this.landHeight = 40;
    this.branches = [{
      xPos: (this.element.width - this.baseWidth) / 2,
      yPos: this.element.height - this.landHeight / 2,
      startTime: null
    }];
    this.branchCount = 1;
    this.currentStrokeWidth = this.baseWidth;
    this.branchLength = 250;
    this.rateOfGrowth = 1;
    this.branchSpread = 1;
    this.animationRequests = [];
    this.init();
  };

  var proto = TreeView.prototype; // Top level function

  proto.init = function () {
    return this.drawScape().drawTree().enable();
  };

  proto.enable = function () {
    if (this.isEnabled) {
      return this;
    }

    this.isEnabled = true;
    return this;
  };

  proto.drawTree = function () {
    this.ctx.strokeStyle = '#825201';
    this.ctx.beginPath();
    var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, 0));
    this.animationRequests.push(request);
    return this;
  };

  proto.taperedTrunk = function (branchIndex, timestamp) {
    if (!this.branches[branchIndex].startTime) this.branches[branchIndex].startTime = timestamp;
    var elapsedTime = timestamp - this.branches[branchIndex].startTime;
    var endTime = this.baseWidth * this.branchLength;
    this.ctx.lineWidth = this.currentStrokeWidth - elapsedTime / endTime * 8;
    this.ctx.moveTo(this.branches[branchIndex].xPos, this.branches[branchIndex].yPos);
    this.branches[branchIndex].yPos -= Math.random() * this.rateOfGrowth;

    if (branchIndex === 0 && this.branchCount === 1) {
      var newX = Math.random() * 0.5;
      newX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      this.branches[branchIndex].xPos += newX;
    } else if (branchIndex < this.branchCount / 2) {
      this.branches[branchIndex].xPos -= Math.random() * this.branchSpread;
    } else if (branchIndex >= this.branchCount / 2) {
      this.branches[branchIndex].xPos += Math.random() * this.branchSpread;
    }

    this.ctx.lineTo(this.branches[branchIndex].xPos, this.branches[branchIndex].yPos);
    this.ctx.stroke();

    if (this.currentStrokeWidth < 0.2 || this.branchCount >= 64) {
      this.cancelAllAnimationRequests();
    } else if (elapsedTime >= endTime * (5 / 8)) {
      this.splitBranch();
    } else if (elapsedTime < endTime * (5 / 8)) {
      var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, branchIndex));
      this.animationRequests.push(request);
    }

    return this;
  };

  proto.splitBranch = function () {
    this.cancelAllAnimationRequests();

    for (var i = 0; i < this.branchCount; i++) {
      this.branches[i].startTime = null;
      var newBranch = {
        xPos: this.branches[i].xPos,
        yPos: this.branches[i].yPos,
        startTime: null
      };
      this.branches.push(newBranch);
    }

    this.branchCount = this.branches.length;
    this.currentStrokeWidth *= 2 / 3;
    this.branchLength *= 2 / 3;

    for (var i = 0; i < this.branchCount; i++) {
      var request = window.requestAnimationFrame(this.taperedTrunk.bind(this, i));
      this.animationRequests.push(request);
    }

    return this;
  };

  proto.cancelAllAnimationRequests = function () {
    for (var i = 0; i < this.animationRequests.length; i++) {
      window.cancelAnimationFrame(this.animationRequests[i]);
    }

    this.animationRequests = [];
    return this;
  };

  proto.drawScape = function () {
    return this;
  };

  proto.drawHills = function () {
    var hillWidth = 70;
    var hillWidthHalf = hillWidth / 2;
    var xPos = 20;
    var skyHeight = this.element.height - this.landHeight;
    var yPos = skyHeight; // relative heights are the difference between a given hill
    // and its previous

    var small, med, large;
    small = 0.15;
    med = 0.25;
    large = 0.7;
    var hillHeights = [{
      full: skyHeight * med,
      relative: -skyHeight * med
    }, {
      full: skyHeight * med + hillWidthHalf,
      relative: 0
    }, {
      full: skyHeight * large,
      relative: -(skyHeight * large - (skyHeight * med + hillWidth))
    }, {
      full: skyHeight * large - hillWidthHalf,
      relative: skyHeight * large - hillWidthHalf - (skyHeight * small + hillWidthHalf)
    }, {
      full: skyHeight * small,
      relative: skyHeight * small
    }];
    var midway = Math.floor(hillHeights.length / 2);
    this.ctx.fillStyle = '#069611';
    this.ctx.strokewidth = 2;
    this.ctx.strokeStyle = '#000';
    this.ctx.beginPath();

    for (var i = 0, j = hillHeights.length; i < j; i++) {
      this.ctx.moveTo(xPos, yPos);

      if (i <= midway) {
        // First half
        yPos += hillHeights[i].relative;
        this.ctx.lineTo(xPos, yPos);
        this.ctx.arc(xPos + hillWidthHalf, yPos, hillWidthHalf, Math.PI, 0, false);
        this.ctx.fillRect(xPos, yPos, hillWidth, hillHeights[i].full);
      } else {
        // second half
        this.ctx.arc(xPos + hillWidthHalf, yPos, hillWidthHalf, Math.PI, 0, false);
        this.ctx.fillRect(xPos, yPos, hillWidth, hillHeights[i].full);
      }

      this.ctx.moveTo(xPos + hillWidthHalf - 5, yPos - hillWidthHalf / 2 - 4);
      this.ctx.lineTo(xPos + hillWidthHalf - 5, yPos - hillWidthHalf / 2 + 4);
      this.ctx.moveTo(xPos + hillWidthHalf + 5, yPos - hillWidthHalf / 2 - 4);
      this.ctx.lineTo(xPos + hillWidthHalf + 5, yPos - hillWidthHalf / 2 + 4);
      xPos += hillWidthHalf;

      if (i < midway) {
        yPos -= hillWidthHalf;
      } else if (i === midway) {
        yPos += hillWidthHalf;
      } else {
        xPos += hillWidthHalf;
        this.ctx.moveTo(xPos, yPos);
        yPos += hillHeights[i].relative;
        this.ctx.lineTo(xPos, yPos);
        xPos -= hillWidthHalf;
        yPos += hillWidthHalf;
      }
    }

    this.ctx.fill();
    this.ctx.stroke();
    return this;
  };

  proto.drawCloud = function (xPos, yPos) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9';
    this.ctx.strokewidth = 0;
    this.ctx.beginPath();

    for (var i = 0; i < 5; i++) {
      var altY = i % 2 === 0 ? yPos : yPos - 15;
      this.ctx.arc(xPos, altY, 20, 0, Math.PI * 2, false);
      xPos += 15;
    }

    this.ctx.fill();
    return this;
  };

  return new TreeView(document.getElementById('tree'));
})();
/* INSECTE */


function AnimateIt() {
  var theDiv = $("#insectcontainer"),
      theContainer = $("#maincontainer"),
      maxLeft = theContainer.width() - theDiv.width(),
      maxTop = theContainer.height() - theDiv.height(),
      leftPos = Math.floor(Math.random() * maxLeft),
      topPos = Math.floor(Math.random() * maxTop);

  if (theDiv.position().left <= leftPos + 250) {
    theDiv.removeClass("left").addClass("right");
  } else {
    theDiv.removeClass("right").addClass("left");
  }

  theDiv.animate({
    "left": leftPos,
    "top": topPos
  }, 1200, AnimateIt);
}

AnimateIt();
},{}],"../../../.nvm/versions/node/v13.7.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33443" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v13.7.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/index.js"], null)
//# sourceMappingURL=/src.7ed060e2.js.map