var crosetModule;

crosetModule = angular.module("Croset", ["ui.router", "uiRouterStyles", "oc.lazyLoad", "ngAria", "ngMaterial", "ngAnimate", "ngMessages", "ngDragDrop", "mdColorPicker", "angular.filter", "ui.ace"]);

crosetModule.service("Elements", [
  function() {
    var elements;
    elements = {
      screen: null
    };
    this.get = function() {
      return elements;
    };
    this.set = function(key, value) {
      return elements[key] = value;
    };
  }
]);

crosetModule.factory("GetDistance", function() {
  return function(p1, p2) {
    var leftD, topD;
    leftD = p1.left - p2.left;
    topD = p1.top - p2.top;
    return Math.sqrt(leftD * leftD + topD * topD);
  };
});

crosetModule.factory("IsInDiv", function() {
  return function(point, div) {
    var bottom, left, right, top;
    div = $(div);
    top = div.offset().top;
    left = div.offset().left;
    bottom = div.offset().top + div.height();
    right = div.offset().left + div.width();
    if (point.top >= top && point.left >= left && point.top <= bottom && point.left <= right) {
      return true;
    } else {
      return false;
    }
  };
}).value("ColorPallet", {
  mc: "#0F9D58",
  ac: "#E53935"
}).value("GetTextColor", function(bgRgb) {
  var blue, color, green, red;
  red = bgRgb.r;
  green = bgRgb.g;
  blue = bgRgb.b;
  color = 'black';
  if ((red * 0.299 + green * 0.587 + blue * 0.114) < 186) {
    color = 'white';
  }
  return color;
}).value("HexToRgb", function(hex) {
  var result;
  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  } else {
    return null;
  }
}).factory("GenerateElement", [
  "$compile", function($compile) {
    return function(e, scope, appendTo) {
      e = $compile(angular.element(e))(scope);
      if (appendTo) {
        return e.appendTo(appendTo);
      }
    };
  }
]).run([
  "$http", "$rootScope", "$state", function($http, $rootScope, $state) {
    var stateChangeBypass;
    console.log("run");
    stateChangeBypass = false;
    return $rootScope.$on("$stateChangeStart", function(ev, toState, toParams, fromState, fromParams) {
      if (stateChangeBypass || toState.name === "login") {
        stateChangeBypass = false;
        return;
      }
      ev.preventDefault();
      console.log("Change");
      return $http.get("/profile").then(function(result) {
        var data;
        data = result.data;
        console.log(data);
        if (data) {
          stateChangeBypass = true;
          $rootScope.profile = data;
          return $state.go(toState, toParams);
        } else {
          ev.preventDefault();
          return $state.go("login");
        }
      }, function(result) {
        return console.log("Failed", result);
      });
    });
  }
]).config([
  "$stateProvider", "$urlRouterProvider", "$mdThemingProvider", function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.definePalette('myBlue', {
      '50': '526FFF',
      '100': '526FFF',
      '200': '526FFF',
      '300': '526FFF',
      '400': '526FFF',
      '500': '526FFF',
      '600': '526FFF',
      '700': '526FFF',
      '800': '526FFF',
      '900': '526FFF',
      'A100': '526FFF',
      'A200': '526FFF',
      'A400': '526FFF',
      'A700': '526FFF',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': void 0
    });
    $mdThemingProvider.definePalette('myOrange', {
      '50': '#FF5722',
      '100': '#FF5722',
      '200': '#FF5722',
      '300': '#FF5722',
      '400': '#FF5722',
      '500': '#FF5722',
      '600': '#FF5722',
      '700': '#FF5722',
      '800': '#FF5722',
      '900': '#FF5722',
      'A100': '#FF5722',
      'A200': '#FF5722',
      'A400': '#FF5722',
      'A700': '#FF5722',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': void 0,
      'contrastDefaultColor': 'light'
    });
    $mdThemingProvider.theme('default').primaryPalette('myBlue', {
      "default": "500"
    }).accentPalette('myOrange', {
      'default': '500'
    });
    return $stateProvider.state("editor", {
      url: "/editor/:projectId",
      controller: "EditorController",
      templateUrl: "editor.html",
      resolve: {
        projectDataRes: [
          "$http", "$stateParams", function($http, $stateParams) {
            return $http({
              method: "GET",
              url: "/project",
              params: {
                projectId: $stateParams.projectId
              }
            });
          }
        ],
        files: [
          "$ocLazyLoad", function($ocLazyLoad) {
            return $ocLazyLoad.load(["blockly/blockly_uncompressed.js", "blockly/generators/javascript.js", "blockly/blocks/logic.js", "blockly/blocks/math.js", "blockly/blocks/lists.js", "blockly/blocks/colour.js", "blockly/blocks/loops.js", "blockly/blocks/variables.js", "blockly/blocks/text.js", "blockly/blocks/procedures.js", "blockly/blocks/custom.js", "blockly/blocks/element.js", "blockly/generators/javascript/logic.js", "blockly/generators/javascript/math.js", "blockly/generators/javascript/lists.js", "blockly/generators/javascript/colour.js", "blockly/generators/javascript/loops.js", "blockly/generators/javascript/variables.js", "blockly/generators/javascript/text.js", "blockly/generators/javascript/procedures.js", "blockly/generators/javascript/custom.js", "blockly/generators/javascript/element.js", "blockly/msg/js/ja.js"]);
          }
        ]
      }
    }).state("editor.design", {
      url: "/design/:screenId",
      css: "css/design",
      views: {
        left: {
          templateUrl: "hierarchy.html"
        },
        right: {
          templateUrl: "properties.html"
        }
      }
    }).state("editor.program", {
      url: "/program/:screenId",
      css: ["css/program", "css/workspace"],
      views: {
        right: {
          templateUrl: "program.html",
          controller: "ChildEditorController"
        }
      }
    }).state("editor.server", {
      url: "/server/:screenId",
      css: "css/server",
      views: {
        full: {
          templateUrl: "server.html",
          controller: "ChildEditorController"
        }
      }
    }).state("editor.script", {
      url: "/script/:screenId",
      css: ["css/script", "css/workspace"],
      views: {
        full: {
          templateUrl: "script.html",
          controller: "ChildEditorController"
        }
      }
    }).state("login", {
      url: "/login",
      css: "css/login",
      templateUrl: "login.html",
      controller: "LoginController"
    }).state("dashboard", {
      url: "/dashboard",
      css: "css/dashboard",
      templateUrl: "dashboard.html",
      controller: "DashboardController"
    });
  }
]);

crosetModule.controller("LoginController", [
  "$scope", function($scope) {
    $('.form-control').on('focus blur', function(e) {
      return $(this).parents('.form-group').toggleClass('focused', e.type === 'focus' || this.value.length > 0);
    }).trigger('blur');
    $('#moveleft').click(function() {
      $('#textbox').animate({
        marginLeft: "0"
      });
      return $('.toplam').animate({
        marginLeft: "100%"
      });
    });
    return $('#moveright').click(function() {
      $('#textbox').animate({
        marginLeft: "50%"
      });
      return $('.toplam').animate({
        marginLeft: "0"
      });
    });
  }
]);

crosetModule.controller("CrosetController", [
  "$scope", "$rootScope", "$mdSidenav", function($scope, $rootScope, $mdSidenav) {
    $scope.cssPaths = [];
    return $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      $mdSidenav("side-menu").close();
      $mdSidenav("select-screen").close();
      $scope.cssPaths = [];
      if (toState.css) {
        if (angular.isArray(toState.css)) {
          return $scope.cssPaths = toState.css;
        } else {
          return $scope.cssPaths = [toState.css];
        }
      }
    });
  }
]);

crosetModule.controller("SideMenuController", [
  "$scope", "$injector", "$state", "$mdSidenav", function($scope, $injector, $state, $mdSidenav) {
    $scope.toggleSideNav = function() {
      return $mdSidenav("side-menu").toggle().then(function() {});
    };
    $scope.navigateTo = function(sref) {
      return $state.go(sref);
    };
    return $scope.sideLinks = (function() {
      var child, i, item, j, len, len1, list, ref, result;
      list = [
        {
          icon: "home",
          text: "ホーム"
        }, {
          icon: "dashboard",
          text: "ダッシュボード",
          sref: "dashboard",
          children: [
            {
              icon: "edit",
              text: "デザイン",
              sref: "^.design"
            }, {
              icon: "code",
              text: "プログラム",
              sref: "^.program"
            }
          ]
        }
      ];
      result = [];
      for (i = 0, len = list.length; i < len; i++) {
        item = list[i];
        result.push(item);
        if (item.children) {
          ref = item.children;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            child = ref[j];
            child.isChild = true;
            result.push(child);
          }
        }
      }
      return result;
    })();
  }
]).directive("ngRightClick", [
  "$parse", function($parse) {
    return function(scope, element, attrs) {
      var fn;
      fn = $parse(attrs.ngRightClick);
      return element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          return fn(scope, {
            $event: event
          });
        });
      });
    };
  }
]);


/* コンテキストメニュー
 	.e(ng-context-menu="#menu")   の場合、
	#menuを.eのコンテキストメニューとして使用し、.eのスコープの_contextmenuプロパティの中身をすべて#menuのスコープに展開する
 */

crosetModule.directive("ngContextMenu", [
  "$parse", "$compile", function($parse, $compile) {
    return function(scope, element, attrs) {
      var menu;
      menu = angular.element(attrs.ngContextMenu);
      menu.appendTo($("body")).hide();
      element.bind("contextmenu", function(event) {
        scope.$apply(function() {
          menu.show().offset({
            top: event.pageY,
            left: event.pageX
          });
          return angular.forEach(element.scope()._contextmenu, function(value, key) {
            return menu.scope()[key] = value;
          });
        });
        return false;
      });
      return $(window).bind("mouseup", function(e) {
        if (e.which !== 1) {
          return false;
        }
        menu.hide();
      });
    };
  }
]).directive("repeatFinished", function($timeout) {
  return function(scope, element, attrs) {
    console.log(scope.$last, element, scope);
    return $timeout(function() {
      return scope.$emit("repeatFinishedEventFired", element);
    });
  };
}).filter("toArray", function() {
  return function(input) {
    if (!input) {
      return;
    }
    if (input instanceof Array) {
      return input;
    }
    return $.map(input, function(val, key) {
      val.$$key = key;
      return val;
    });
  };
});
