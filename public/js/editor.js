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
]).service("CurrentScreenData", [
  function() {
    var that;
    this.id = "";
    this.elementsManager = null;
    that = this;
    this.getElementsManager = function() {
      return that.elementsManager;
    };
  }
]).service("ProjectData", [
  "$http", "$rootScope", "$stateParams", "$state", "ScreenCards", "ScreenElementsManager", "Build", "ServiceConfig", "getUUID", "CurrentScreenData", function($http, $rootScope, $stateParams, $state, ScreenCards, ScreenElementsManager, Build, ServiceConfig, getUUID, CurrentScreenData) {
    var callbacksVal, saveCurrentScreen, that, trigerCallback;
    this.projectId = null;
    this.name = null;
    this.screens = {};
    this.defaultScreen = "トップ";
    this.variables = [];
    this.getScreens = function() {
      return this.screens;
    };
    CurrentScreenData.id = this.defaultScreen;
    $rootScope.$on("onChangedScreen", function(ev, screenId) {
      return CurrentScreenData.id = screenId;
    });
    that = this;
    this.init = function() {
      that.callback = [];
      that.projectId = null;
      that.name = null;
      that.screens = {};
      that.defaultScreen = "トップ";
      return that.variables = [];
    };
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      if (toState.name.match(/editor/)) {
        if (toParams.projectId === that.projectId + "") {
          saveCurrentScreen();
          this.parsedStock = [];
        }
        if (fromState.name.match(/program/)) {
          return ScreenCards.list = Build.parse();
        }
      }
    });
    saveCurrentScreen = function() {
      var cards;
      cards = Build.parse();
      if (cards.length === 0) {
        cards = ScreenCards.list;
      }
      return angular.extend(that.screens[CurrentScreenData.id], {
        elements: CurrentScreenData.elementsManager.get(),
        cards: cards,
        sourceCode: Build.compile(cards)
      });
    };
    this.addScreen = function(name) {
      if (that.getScreenByName(name)) {
        return false;
      } else {
        this.screens[getUUID()] = {
          elements: {},
          cards: [],
          sourceCode: "",
          name: name
        };
        trigerCallback();
        return true;
      }
    };
    this.renameScreen = function(id, newName) {
      var ref;
      if (that.getScreenByName(newName)) {
        return false;
      } else {
        if ((ref = that.screens[id]) != null) {
          ref.name = newName;
        }
        trigerCallback();
        return true;
      }
    };
    this.removeScreen = function(id) {
      if (that.screens[id]) {
        delete that.screens[id];
        trigerCallback();
        return true;
      } else {
        return false;
      }
    };
    this.getScreenByName = function(name) {
      var id, ref, screen;
      ref = that.screens;
      for (id in ref) {
        screen = ref[id];
        console.log(screen, name);
        if (screen.name === name) {
          return id;
        }
      }
      return null;
    };
    this.callbacks = [];
    this.setCallback = function(fnc) {
      return that.callbacks.push(fnc);
    };
    trigerCallback = function() {
      var callback, i, len, ref, results;
      ref = that.callbacks;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        callback = ref[i];
        results.push(callback());
      }
      return results;
    };
    this.addvariable = function(name) {
      if (that.variables.indexOf(name) === -1) {
        that.variables.push(name);
        that.trigetCallbackVal();
        return true;
      } else {
        return false;
      }
    };
    callbacksVal = [];
    this.onChangevariables = function(fnc) {
      return callbacksVal.push(fnc);
    };
    this.trigetCallbackVal = function() {
      var callback, i, len, results;
      results = [];
      for (i = 0, len = callbacksVal.length; i < len; i++) {
        callback = callbacksVal[i];
        results.push(callback(that.variables));
      }
      return results;
    };
    this.get = function() {
      saveCurrentScreen();
      return {
        name: this.name,
        projectId: this.projectId,
        screens: this.screens,
        defaultScreen: this.defaultScreen,
        config: ServiceConfig.get(),
        variables: this.variables
      };
    };
  }
]).service("SelectedElementUUID", [
  "Elements", "SetElementProperty", "CurrentScreenData", function(Elements, SetElementProperty, CurrentScreenData) {
    var uuid;
    uuid = null;
    this.init = function() {
      return uuid = null;
    };
    this.get = function() {
      return uuid;
    };
    this.set = function(val) {
      var element, onResizedOrDraged, screenElements, selectedElement;
      screenElements = CurrentScreenData.elementsManager;
      if (uuid && screenElements.get()[uuid]) {
        console.log(screenElements.get()[uuid].element);
        selectedElement = $(screenElements.get()[uuid].element);
        if (selectedElement.data("ui-resizable")) {
          console.log("aaaa");
          selectedElement.resizable("destroy");
        }
      }
      uuid = val;
      SetElementProperty(val);
      element = screenElements.get()[uuid].element;
      onResizedOrDraged = function(ev, ui) {
        console.log(element);
        screenElements.set(uuid, "top", element.css("top"));
        screenElements.set(uuid, "left", element.css("left"));
        screenElements.set(uuid, "width", element.width());
        screenElements.set(uuid, "height", element.height());
      };
      return $(element).resizable({
        handles: "ne, se, sw, nw",
        minHeight: 3,
        minWidth: 3,
        stop: onResizedOrDraged
      }).draggable({
        cancel: null,
        stop: function() {
          return onResizedOrDraged();
        }
      });
    };
  }
]).controller("HeaderController", [
  "$scope", "$http", "$mdDialog", "$mdSidenav", "$timeout", "$interval", "$injector", "$stateParams", "$mdToast", "ProjectData", function($scope, $http, $mdDialog, $mdSidenav, $timeout, $interval, $injector, $stateParams, $mdToast, ProjectData) {
    var cancel, saveProject;
    $scope.projectName = null;
    $scope.screenId = $stateParams.screenId;
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
    $scope.save = function(ev) {
      return saveProject(function() {
        return $mdToast.show($mdToast.simple().textContent('保存しました').position("right top").hideDelay(3000));
      });
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
  "$scope", "$mdSidenav", "$injector", "$state", "$mdDialog", "$mdToast", "ProjectData", "ScreenElementsManager", function($scope, $mdSidenav, $injector, $state, $mdDialog, $mdToast, ProjectData, ScreenElementsManager) {
    var confirmScreenName, goScreen;
    $scope.projectId = $injector.get("$stateParams").projectId;
    $scope.defaultScreen = ProjectData.defaultScreen;
    $scope.screens = {};
    $scope.$on("onSelectScreen", function() {
      return $scope.screens = ProjectData.getScreens();
    });
    $scope.$on('repeatFinishedEventFired', function(ev, element) {
      var data, ref, results, screen, screenElementsManager, uuid;
      screen = ev.targetScope.screen;
      console.log(screen, ev.target);
      screenElementsManager = new ScreenElementsManager(element.find(".select-screen-preview"));
      ref = screen.elements;
      results = [];
      for (uuid in ref) {
        data = ref[uuid];
        results.push(screenElementsManager.addFromData(data, uuid));
      }
      return results;
    });
    $scope.onclick = function(id) {
      goScreen(id);
      return $scope.close();
    };
    $scope.close = function() {
      return $mdSidenav("select-screen").close();
    };
    $scope.setAsTop = function(id) {
      ProjectData.defaultScreen = id;
      return $scope.defaultScreen = ProjectData.defaultScreen;
    };
    $scope.rename = function(ev, id) {
      return confirmScreenName(ev, "画面の名前を変更", function(newName) {
        var result;
        result = ProjectData.renameScreen(id, newName);
        console.result;
        if (result) {
          return $scope.screens = ProjectData.getScreens();
        } else {
          return $mdToast.show($mdToast.simple().textContent("その名前の画面はすでに存在します").hideDelay(3000));
        }
      });
    };
    $scope.remove = function(ev, id) {
      var confirm;
      confirm = $mdDialog.confirm().title("削除").content("'" + ProjectData.getScreens()[id].name + "' を削除します").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function() {
        return ProjectData.removeScreen(id);
      }, function() {});
    };
    $scope.create = function(ev) {
      return confirmScreenName(ev, "新しい画面を追加", function(name) {
        var result;
        result = ProjectData.addScreen(name);
        if (result) {

        } else {
          return $mdToast.show($mdToast.simple().textContent("エラー：同名の画面がすでに存在します").hideDelay(3000));
        }
      });
    };
    confirmScreenName = function(ev, title, fnc) {
      var confirm;
      confirm = $mdDialog.prompt().title(title).textContent("新しい画面の名前を入力してください").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function(name) {
        return fnc(name);
      }, function() {});
    };
    $scope.openMore = function($mdOpenMenu, ev) {
      return $mdOpenMenu(ev);
    };
    return goScreen = function(id) {
      var $stateParams;
      $stateParams = $injector.get("$stateParams");
      return $state.go("editor.design", {
        projectId: $stateParams.projectId,
        screenId: id
      });
    };
  }
]).controller("EditorController", [
  "$scope", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$interval", "$mdSidenav", "$rootScope", "ScreenElementsManager", "ScreenCards", "Elements", "SelectedElementUUID", "CurrentScreenData", "projectDataRes", function($scope, ElementDatas, $state, $stateParams, $http, ProjectData, $interval, $mdSidenav, $rootScope, ScreenElementsManager, ScreenCards, Elements, SelectedElementUUID, CurrentScreenData, projectDataRes) {
    var changeScreen, projectData, ref, ref1;
    SelectedElementUUID.init();
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
      return $state.go("editor." + name, {
        screenId: CurrentScreenData.id
      });
    };
    $scope.progress = {
      determinateValue: 0,
      isLoading: true
    };
    Elements.set("screen", angular.element("#screen"));
    projectData = projectDataRes.data;
    console.log(projectData);
    ProjectData.init();
    ProjectData.screens = projectData.screens;
    ProjectData.name = projectData.name;
    ProjectData.projectId = projectData.projectId;
    ProjectData.defaultScreen = projectData.defaultScreen;
    ProjectData.parsedStock = (ref = projectData.screens) != null ? (ref1 = ref[projectData.defaultScreen]) != null ? ref1.cards : void 0 : void 0;
    if (projectData.variables) {
      ProjectData.variables = projectData.variables;
    }
    $rootScope.$on("onChangedScreen", function(ev, screenId) {
      var nextScreen;
      console.log(ProjectData, screenId);
      screenId = screenId || ProjectData.defaultScreen;
      nextScreen = ProjectData.getScreens()[screenId];
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
    changeScreen = function(elements, cards) {
      var newScreenElementsManager;
      newScreenElementsManager = new ScreenElementsManager($("#screen"));
      CurrentScreenData.elementsManager = newScreenElementsManager;
      angular.forEach(elements, function(data, uuid) {
        return newScreenElementsManager.addFromDataEditor(data, uuid);
      });
      return ScreenCards.list = cards;
    };
    return $rootScope.$broadcast("onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen);
  }
]).controller("ChildEditorController", [
  "$scope", "$rootScope", "$stateParams", "ProjectData", function($scope, $rootScope, $stateParams, ProjectData) {
    console.log("child", $stateParams.screenId);
    return $rootScope.$broadcast("onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen);
  }
]).controller("ScreenController", [
  "$scope", "$timeout", function($scope, $timeout) {
    var editor, screenDefaultHeight, screenDefaultWidth, screenZone;
    $scope.screenScaleRatio = 1;
    editor = $("#editor");
    screenZone = $("#screen-zone");
    screenDefaultWidth = screenZone.width();
    screenDefaultHeight = screenZone.outerHeight();
    console.log("Original Screen Size", {
      width: screenDefaultWidth,
      height: screenDefaultHeight
    });
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
        "$scope", "$attrs", "CurrentScreenData", "SelectedElementUUID", function($scope, $attrs, CurrentScreenData, SelectedElementUUID) {
          this.onchange = function(value) {
            return CurrentScreenData.elementsManager.set(SelectedElementUUID.get(), $scope.options.result, value);
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
