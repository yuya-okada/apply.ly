var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.service("ServiceConfig", [
  function() {
    var config;
    config = {
      componentScale: 1
    };
    this.get = function() {
      return config;
    };
    this.update = function(key, value) {
      return config[key] = value;
    };
  }
]).service("ProjectData", [
  "$http", "$stateParams", "$state", "ScreenCards", "ScreenElements", "Build", "ServiceConfig", function($http, $stateParams, $state, ScreenCards, ScreenElements, Build, ServiceConfig) {
    this.get = function() {
      return {
        name: $stateParams.projectId,
        elements: ScreenElements.get(),
        cards: ScreenCards.get(),
        config: ServiceConfig.get(),
        sourceCode: Build.compile(ScreenCards.get())
      };
    };
  }
]).service("SelectedElementUUID", [
  "Elements", "SetElementProperty", "ScreenElements", function(Elements, SetElementProperty, ScreenElements) {
    var uuid;
    uuid = null;
    this.get = function() {
      return uuid;
    };
    this.set = function(val) {
      var element, onResizedOrDraged;
      if (val === uuid) {
        return;
      }
      if (uuid && ScreenElements.get()[uuid]) {
        $(ScreenElements.get()[uuid].element).resizable("destroy");
      }
      uuid = val;
      SetElementProperty(val);
      element = ScreenElements.get()[uuid].element;
      onResizedOrDraged = function(ev, ui) {
        console.log(element);
        ScreenElements.set(uuid, "top", element.css("top"));
        ScreenElements.set(uuid, "left", element.css("left"));
        ScreenElements.set(uuid, "width", element.width());
        ScreenElements.set(uuid, "height", element.height());
      };
      return $(element).resizable({
        handles: "ne, se, sw, nw",
        minHeight: 3,
        minWidth: 3,
        stop: onResizedOrDraged
      }).draggable({
        cancel: null,
        stop: function() {
          console.log("あああああ");
          return onResizedOrDraged();
        }
      });
    };
  }
]).controller("HeaderController", [
  "$scope", "$http", "$mdDialog", "$mdSidenav", "$interval", "$injector", "ProjectData", function($scope, $http, $mdDialog, $mdSidenav, $interval, $injector, ProjectData) {
    $scope.toggleSideNav = function() {
      return $mdSidenav("side-menu").toggle().then(function() {});
    };
    $scope.buildDownload = function(ev) {
      $mdDialog.show({
        controller: null,
        templateUrl: 'templates/build-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      }).then(function(answer) {
        return $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        return $scope.status = 'You cancelled the dialog.';
      });
      return $http({
        method: "GET",
        url: "/build",
        params: ProjectData.get()
      }).success(function(data, status, headers, config) {
        var checkBuilded;
        console.log("ビルド");
        checkBuilded = function() {
          console.log("チェック");
          return $http({
            method: "GET",
            url: "/builded-projects/" + ProjectData.get().name + ".zip",
            params: ProjectData.get()
          }).success(function(data, status, headers, config) {
            console.log(data);
            return window.open("/builded-projects/" + ProjectData.get().name + ".zip");
          }).error(function(data, status, headers, config) {
            console.log("Failed", data);
            return $interval(function() {
              return checkBuilded();
            }, 2000);
          });
        };
        return checkBuilded();
      }).error(function(data, status, headers, config) {
        return console.log("Failed", data);
      });
    };
    return $scope.run = function() {
      console.log("------------実行結果--------------");
      return $http({
        method: "PUT",
        url: "/project",
        data: ProjectData.get()
      }).success(function(data, status, headers, config) {
        return console.log("Saved", data);
      }).error(function(data, status, headers, config) {
        return console.log("Failed", data);
      });
    };
  }
]).controller("EditorController", [
  "$scope", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$interval", "ScreenElements", "ScreenCards", "Elements", function($scope, ElementDatas, $state, $stateParams, $http, ProjectData, $interval, ScreenElements, ScreenCards, Elements) {
    $scope.settings = {
      elementDatas: ElementDatas
    };
    $scope.mode = "";
    $scope.designMode = function() {
      return $scope.mode = "design";
    };
    $scope.programMode = function() {
      return $scope.mode = "program";
    };
    $scope.modeList = {
      design: {
        icon: "create"
      },
      program: {
        icon: "code"
      }
    };
    $scope.changeMode = function(name) {
      console.log(name);
      return $state.go("editor." + name);
    };
    $scope.progress = {
      determinateValue: 0,
      isLoading: true
    };
    return $http({
      method: "GET",
      url: "/project",
      params: {
        name: $stateParams.projectId
      }
    }).success(function(data, status, headers, config) {
      Elements.set("screen", angular.element("#screen"));
      if (data.elements == null) {
        data.elements = {};
      }
      angular.forEach(data.elements, function(data, uuid) {
        return ScreenElements.addFromDataEditor(data, uuid);
      });
      console.log("GET", data.cards);
      ScreenCards.list = data.cards || [];
      console.log(data.cards);
      ProjectData.name = data.name || "";
      $scope.progress.isLoading = false;
      $scope.progress.determinateValue += 100;
    }).error(function(data, status, headers, config) {
      return console.log("Failed", data);
    });
  }
]).controller("ScreenController", [
  "$scope", "$timeout", function($scope, $timeout) {
    var editor, screenDefaultHeight, screenDefaultWidth, screenZone;
    $scope.screenScaleRatio = 1;
    editor = $("#editor");
    screenZone = $("#screen-zone");
    screenDefaultWidth = screenZone.width();
    screenDefaultHeight = screenZone.outerHeight();
    return $(window).on("resize", function() {
      return $timeout(function() {
        var height;
        height = editor.height() - 20;
        $scope.screenScaleRatio = height / screenDefaultHeight;
        $scope.marginRight = -1 * (screenDefaultWidth * (1 - $scope.screenScaleRatio));
        return console.log($scope.screenScale);
      }, 0);
    }).trigger("resize");
  }
]).directive("crosetElementEditor", function() {
  return {
    restrict: "A",
    scope: false,
    controller: [
      "$scope", "$element", "$attrs", "$compile", "ElementDatas", "SelectedElementUUID", function($scope, $element, $attrs, $compile, ElementDatas, SelectedElementUUID) {
        $element.bind("mousedown", function(e) {
          SelectedElementUUID.set($attrs.uuid);
        });
        return SelectedElementUUID.set($attrs.uuid);
      }
    ]
  };
}).directive("crosetDynamicInput", [
  "$compile", function($compile) {
    return {
      restrict: "E",
      scope: {
        tag: "=",
        options: "="
      },
      compile: function(element, attributes) {
        return {
          pre: function(scope, el, attrs) {
            var compiled, newEl;
            newEl = angular.element("<" + scope.tag + ">").attr("options", angular.toJson(scope.options));
            compiled = $compile(newEl[0])(scope);
            return el.append(compiled);
          }
        };
      },
      controller: [
        "$scope", "$attrs", "ScreenElements", "SelectedElementUUID", function($scope, $attrs, ScreenElements, SelectedElementUUID) {
          this.onchange = function(value) {
            return ScreenElements.set(SelectedElementUUID.get(), $scope.options.result, value);
          };
          this.onchange($scope.options.defaultValue);
        }
      ]
    };
  }
]).directive("crosetText", function() {
  return {
    restirct: "E",
    scope: {
      options: "="
    },
    templateUrl: "input-text.html"
  };
}).directive("crosetHeadline", function() {
  return {
    restirct: "E",
    scope: {
      options: "="
    },
    templateUrl: "input-headline.html"
  };
}).directive("crosetColorIcon", [
  "showColorPicker", "GetTextColor", "HexToRgb", function(showColorPicker, GetTextColor, HexToRgb) {
    return {
      restrict: "E",
      scope: {
        options: "="
      },
      require: "^crosetDynamicInput",
      templateUrl: "input-color-icon.html",
      link: function(scope, element, attrs, dynamicInput) {
        var setColor;
        scope.onclick = function() {
          return showColorPicker.showColorPicker(function(value) {
            return setColor(value);
          }, scope.color);
        };
        setColor = function(value) {
          scope.color = value;
          scope.textColor = GetTextColor(HexToRgb(value));
          return dynamicInput.onchange(scope.color);
        };
        return setColor(scope.options.defaultValue);
      }
    };
  }
]).directive("crosetToggleIcon", [
  "ColorPallet", function(ColorPallet) {
    return {
      restrict: "E",
      scope: {
        options: "="
      },
      require: "^crosetDynamicInput",
      templateUrl: "input-toggle-icon.html",
      link: function(scope, element, attrs, dynamicInput) {
        var getColor;
        getColor = function() {
          if (scope.disabled) {
            return "#888";
          } else {
            return ColorPallet.mc;
          }
        };
        if (angular.isUndefined(scope.options.disabled)) {
          scope.disabled = true;
        } else {
          scope.disabled = scope.options.disabled;
        }
        scope.color = getColor();
        return scope.onclick = function() {
          scope.disabled = !scope.disabled;
          scope.color = getColor();
          return dynamicInput.onchange(!scope.disabled);
        };
      }
    };
  }
]).directive("crosetTextbox", function() {
  return {
    restrict: "E",
    require: "^crosetDynamicInput",
    scope: {
      options: "="
    },
    templateUrl: "input-textbox.html",
    link: function(scope, element, attrs, dynamicInput) {
      scope.value = scope.options.defaultValue;
      return scope.onchange = function() {
        return dynamicInput.onchange(scope.value);
      };
    }
  };
}).directive("crosetTextarea", function() {
  return {
    restrict: "E",
    require: "^crosetDynamicInput",
    scope: {
      options: "="
    },
    templateUrl: "input-textarea.html",
    link: function(scope, element, attrs, dynamicInput) {
      scope.value = scope.options.defaultValue;
      return scope.onchange = function() {
        return dynamicInput.onchange(scope.value);
      };
    }
  };
}).directive("crosetNumber", function() {
  return {
    restrict: "E",
    require: "^crosetDynamicInput",
    scope: {
      options: "="
    },
    templateUrl: "input-number.html",
    link: function(scope, element, attrs, dynamicInput) {
      scope.value = scope.options.defaultValue;
      return scope.onchange = function() {
        return dynamicInput.onchange(scope.value);
      };
    }
  };
}).directive("crosetSlider", [
  "getUUID", function(getUUID) {
    return {
      restrict: "E",
      require: "^crosetDynamicInput",
      scope: {
        options: "="
      },
      templateUrl: "input-slider.html",
      link: function(scope, element, attrs, dynamicInput) {
        scope.id = getUUID();
        scope.value = scope.options.defaultValue;
        return scope.onchange = function() {
          console.log(scope.value);
          return dynamicInput.onchange(scope.value);
        };
      }
    };
  }
]).directive("crosetSelect", [
  "getUUID", function(getUUID) {
    return {
      restrict: "E",
      require: "^crosetDynamicInput",
      scope: {
        options: "="
      },
      templateUrl: "input-select.html",
      link: function(scope, element, attrs, dynamicInput) {
        scope.id = getUUID();
        scope.value = scope.options.defaultValue;
        return scope.onchange = function() {
          return dynamicInput.onchange(scope.value);
        };
      }
    };
  }
]).directive("resizer", [
  function() {
    return {
      restrict: "E",
      templateUrl: "resizer.html",
      link: function(scope, element, attrs) {}
    };
  }
]);
