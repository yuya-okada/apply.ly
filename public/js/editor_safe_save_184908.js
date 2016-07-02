var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.controller("EditorController", [
  "$scope", "ElementDatas", "$timeout", "$stateParams", "$injector", "ProjectData", function($scope, ElementDatas, $timeout, $stateParams, $injector, ProjectData) {
    var dataStore;
    ProjectData.projectName = $stateParams.projectname;
    $scope.settings = {
      elementDatas: ElementDatas
    };
    $scope.mode = $stateParams.mode;
    $scope.designMode = function() {
      return $scope.mode = "design";
    };
    $scope.programMode = function() {
      return $scope.mode = "program";
    };
    dataStore = new Firebase("https://apply-backend.firebaseio.com/");
    return dataStore.child("projects").child(ProjectData.projectName).once("value", function(dataSnapshot) {
      var ScreenElements, elementDatas, result;
      ScreenElements = $injector.get("ScreenElements");
      result = dataSnapshot.val();
      ProjectData.projectData = result;
      elementDatas = JSON.parse(decodeURIComponent(result.html));
      return angular.forEach(elementDatas, function(data, uuid) {
        return ScreenElements.addFromDataEditor(data, uuid);
      });
    });
  }
]).service("ProjectData", function() {
  this.projectName = "";
  return this.projectData = {};
}).factory("Elements", function() {
  return {
    screen: (function() {
      console.log(angular.element("#screen"));
      return angular.element("#screen");
    })(),
    propertyBody: angular.element("#property-body")
  };
}).service("SelectedElementUUID", [
  "Elements", "SetElementProperty", "ScreenElements", function(Elements, SetElementProperty, ScreenElements) {
    var uuid;
    uuid = null;
    this.get = function() {
      return uuid;
    };
    this.set = function(val) {
      if (val === uuid) {
        return;
      }
      if (uuid && ScreenElements.get()[uuid]) {
        $(ScreenElements.get()[uuid].element).resizable("destroy");
      }
      uuid = val;
      SetElementProperty(val);
      console.log(ScreenElements.get()[uuid].element, "ｲｪｱ");
      return $(ScreenElements.get()[uuid].element).resizable({
        handles: "ne, se, sw, nw",
        minHeight: 3,
        minWidth: 3
      }).draggable({
        cancel: null
      }).mousedown(function(ev) {
        return $(this).trigget(ev);
      });
    };
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
