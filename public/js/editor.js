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
  "$http", "$rootScope", "$stateParams", "$state", "ScreenCards", "ScreenElements", "Build", "ServiceConfig", function($http, $rootScope, $stateParams, $state, ScreenCards, ScreenElements, Build, ServiceConfig) {
    var currentScreenName, saveCurrentScreen, that;
    this.projectId = null;
    this.name = null;
    this.screens = {};
    this.getScreens = function() {
      return this.screens;
    };
    currentScreenName = "";
    $rootScope.$on("onChangedScreen", function(ev, screenName) {
      return currentScreenName = screenName;
    });
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      console.log(toState);
      if (toState.name.match(/editor/)) {
        return saveCurrentScreen();
      }
    });
    that = this;
    saveCurrentScreen = function() {
      console.log(that);
      that.screens[currentScreenName] = {
        elements: ScreenElements.get(),
        cards: ScreenCards.get(),
        sourceCode: Build.compile(ScreenCards.get())
      };
      return console.log("saved", that.get());
    };
    this.get = function() {
      return {
        name: this.name,
        projectId: this.projectId,
        screens: this.screens,
        defaultScreen: "トップ",
        config: ServiceConfig.get()
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
  "$scope", "$http", "$mdDialog", "$mdSidenav", "$timeout", "$interval", "$injector", "$stateParams", "ProjectData", function($scope, $http, $mdDialog, $mdSidenav, $timeout, $interval, $injector, $stateParams, ProjectData) {
    var cancel, saveProject;
    $scope.projectName = null;
    $scope.screenName = $stateParams.screenName;
    cancel = $interval(function() {
      $scope.projectName = ProjectData.name;
      if ($scope.projectName) {
        console.log($scope.projectName);
        return $interval.cancel(cancel);
      }
    }, 50);
    $scope.toggleSideNav = function() {
      return $mdSidenav("side-menu").toggle().then(function() {});
    };
    $scope.buildDownload = function(ev) {
      var BuildDialogController;
      BuildDialogController = [
        "$scope", "$http", "$timeout", "$interval", "$window", function($scope, $http, $timeout, $interval, $window) {
          $scope.download = function() {
            var stop, win;
            $mdDialog.hide();
            win = $window.open("/builded-projects/" + ProjectData.get().name + ".zip");
            return stop = $interval(function() {
              if (win.closed) {
                return $http({
                  method: "DELETE",
                  url: "/build",
                  data: ProjectData.get(),
                  headers: {
                    "Content-Type": "application/json;charset=utf-8"
                  }
                }).success(function(data, status, headers, config) {
                  console.log("deleted");
                  return $interval.cancel(stop);
                }).error(function(data, status, headers, config) {
                  console.log(data);
                  return $interval.cancel(stop);
                });
              }
            }, 100);
          };
          return $http({
            method: "GET",
            url: "/build",
            params: ProjectData.get()
          }).success(function(data, status, headers, config) {
            var checkBuilded;
            checkBuilded = function() {
              return $http({
                method: "GET",
                url: "/builded",
                params: {
                  projectId: ProjectData.get().name
                }
              }).success(function(data, status, headers, config) {
                console.log(data);
                if (data) {
                  return $timeout(function() {
                    return checkBuilded();
                  }, 2000);
                } else {
                  return $scope.done = true;
                }
              }).error(function(data, status, headers, config) {
                return console.log("Failed", data);
              });
            };
            return checkBuilded();
          }).error(function(data, status, headers, config) {
            return console.log("Failed", data);
          });
        }
      ];
      return $mdDialog.show({
        controller: BuildDialogController,
        templateUrl: 'templates/build-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      }).then(function(answer) {}, function() {});
    };
    $scope.run = function(ev) {
      var RunDialogController;
      console.log("------------実行結果--------------");
      saveProject();
      RunDialogController = [
        "$scope", function($scope) {
          console.log(ProjectData.get());
          $scope.projectId = ProjectData.get().projectId;
          return $scope.close = function() {
            return $mdDialog.hide();
          };
        }
      ];
      return $mdDialog.show({
        controller: RunDialogController,
        templateUrl: 'templates/run-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      }).then(function(answer) {}, function() {});
    };
    return saveProject = function(fnc) {
      return $http({
        method: "PUT",
        url: "/project",
        data: ProjectData.get()
      }).success(function(data, status, headers, config) {
        console.log("Saved", data);
        if (fnc) {
          return fnc();
        }
      }).error(function(data, status, headers, config) {
        return console.log("Failed", data);
      });
    };
  }
]).controller("SelectScreenController", [
  "$scope", "$mdSidenav", "ProjectData", function($scope, $mdSidenav, ProjectData) {
    $scope.screens = {};
    $scope.$on("onSelectScreen", function() {
      return $scope.screens = ProjectData.getScreens();
    });
    return $scope.close = function() {
      return $mdSidenav("select-screen").close();
    };
  }
]).controller("EditorController", [
  "$scope", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$interval", "$mdSidenav", "$rootScope", "ScreenElements", "ScreenCards", "Elements", "projectDataRes", function($scope, ElementDatas, $state, $stateParams, $http, ProjectData, $interval, $mdSidenav, $rootScope, ScreenElements, ScreenCards, Elements, projectDataRes) {
    var changeScreen, projectData;
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
    $scope.changeScreen = function() {
      console.log("toggle");
      $rootScope.$broadcast("onSelectScreen");
      return $mdSidenav("select-screen").toggle().then(function() {
        return console.log("toggled");
      });
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
    Elements.set("screen", angular.element("#screen"));
    projectData = projectDataRes.data;
    console.log(projectData);
    ProjectData.screens = projectData.screens;
    ProjectData.name = projectData.name;
    ProjectData.projectId = projectData.projectId;
    ProjectData.defaultScreen = projectData.defaultScreen;
    $rootScope.$on("onChangedScreen", function(ev, screenName) {
      var nextScreen;
      console.log(ProjectData, screenName);
      nextScreen = ProjectData.getScreens()[screenName];
      if (nextScreen.elements == null) {
        nextScreen.elements = {};
      }
      if (nextScreen.card == null) {
        nextScreen.card = [];
      }
      changeScreen(nextScreen.elements, nextScreen.cards);
      $scope.progress.isLoading = false;
      return $scope.progress.determinateValue += 100;
    });
    return changeScreen = function(elements, cards) {
      angular.forEach(elements, function(data, uuid) {
        return ScreenElements.addFromDataEditor(data, uuid);
      });
      return ScreenCards.list = cards;
    };
  }
]).controller("ChildEditorController", [
  "$scope", "$rootScope", "$stateParams", function($scope, $rootScope, $stateParams) {
    console.log("child");
    return $rootScope.$broadcast("onChangedScreen", $stateParams.screenName);
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
