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
    this.workspace = null;
    this.getElementsManager = function() {
      return that.elementsManager;
    };
  }
]).service("ProjectData", [
  "$http", "$rootScope", "$stateParams", "$state", "ScreenElementsManager", "ServiceConfig", "getUUID", "CurrentScreenData", function($http, $rootScope, $stateParams, $state, ScreenElementsManager, ServiceConfig, getUUID, CurrentScreenData) {
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
      console.log("チェンジスタート");
      if (toState.name.match(/editor/)) {
        if (toParams.projectId === that.projectId + "") {
          saveCurrentScreen();
          return CurrentScreenData.workspace = null;
        }
      }
    });
    saveCurrentScreen = function() {
      var cards, ref, ref1, sourceCode, xml;
      if (CurrentScreenData.workspace) {
        xml = Blockly.Xml.workspaceToDom(CurrentScreenData.workspace);
        cards = Blockly.Xml.domToText(xml);
        sourceCode = Blockly.JavaScript.workspaceToCode(CurrentScreenData.workspace);
        that.variables = CurrentScreenData.workspace.variableList;
      } else {
        cards = (ref = that.screens[CurrentScreenData.id]) != null ? ref.cards : void 0;
        sourceCode = (ref1 = that.screens[CurrentScreenData.id]) != null ? ref1.sourceCode : void 0;
      }
      return angular.extend(that.screens[CurrentScreenData.id], {
        elements: CurrentScreenData.elementsManager.get(),
        templates: CurrentScreenData.elementsManager.getTemplates(),
        cards: cards,
        sourceCode: sourceCode
      });
    };
    this.addScreen = function(name) {
      if (that.getScreenByName(name)) {
        return false;
      } else {
        this.screens[getUUID()] = {
          elements: {},
          cards: "",
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
        if (screen.name === name) {
          return id;
        }
      }
      return null;
    };
    this.callbacks = [];
    this.setScreenCallback = function(fnc) {
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
      var projectData;
      saveCurrentScreen();
      projectData = {
        name: this.name,
        projectId: this.projectId,
        screens: this.screens,
        defaultScreen: this.defaultScreen,
        config: ServiceConfig.get(),
        variables: this.variables
      };
      console.log("Builded", projectData);
      return projectData;
    };
  }
]).service("SelectedElementUUID", [
  "SetElementProperty", "CurrentScreenData", "$rootScope", function(SetElementProperty, CurrentScreenData, $rootScope) {
    var uuid;
    uuid = null;
    this.init = function() {
      return uuid = null;
    };
    this.get = function() {
      return uuid;
    };
    this.set = function(val) {
      var click, element, handleRatio, onResizedOrDraged, parentElement, screenElements, selectedElement;
      $("#screen-wrapper").removeClass("show-template");
      screenElements = CurrentScreenData.elementsManager;
      if (uuid && screenElements.get(uuid)) {
        selectedElement = $(screenElements.get(uuid).element);
        if (selectedElement.data("ui-resizable")) {
          selectedElement.resizable("destroy");
        }
      }
      $(".croset-resizable-parent").removeClass("croset-resizable-parent");
      $(".ui-resizable").removeClass("ui-resizable");
      uuid = val;
      SetElementProperty(val);
      element = screenElements.get(uuid).element;
      onResizedOrDraged = function(ev, ui) {
        var ref;
        screenElements.set(uuid, "top", element.css("top"));
        screenElements.set(uuid, "left", element.css("left"));
        if (((ref = screenElements.get(uuid)) != null ? ref.unresizable : void 0) !== "xy") {
          screenElements.set(uuid, "width", element.width());
          screenElements.set(uuid, "height", element.height());
        }
      };
      $rootScope.$broadcast("onResizedOrDragging", element);
      click = {
        x: 0,
        y: 0
      };
      $(element).draggable({
        cancel: null,
        start: function(ev) {
          click.x = ev.clientX;
          return click.y = ev.clientY;
        },
        drag: function(ev, ui) {
          var original, screenScaleRatio;
          $rootScope.$broadcast("onResizedOrDragging", element);
          screenScaleRatio = angular.element("#screen").scope().screenScaleRatio;
          original = ui.originalPosition;
          return ui.position = {
            left: (ev.clientX - click.x + original.left) / screenScaleRatio,
            top: (ev.clientY - click.y + original.top) / screenScaleRatio
          };
        },
        stop: function() {
          var ref;
          onResizedOrDraged();
          $rootScope.$broadcast("onResizedOrDraged", element);
          if (((ref = screenElements.get(uuid)) != null ? ref.unresizable : void 0) === "xy") {
            $(element).css("width", "");
            return $(element).css("height", "");
          }
        }
      });
      if (screenElements.get(uuid).unresizable === "xy") {
        element.addClass("ui-resizable");
      } else {
        $(element).resizable({
          handles: "ne, se, sw, nw",
          minHeight: 3,
          minWidth: 3,
          resize: function() {
            return $rootScope.$broadcast("onResizedOrDragging", element);
          },
          stop: function() {
            onResizedOrDraged();
            return $rootScope.$broadcast("onResizedOrDraged", element);
          }
        });
        handleRatio = 1 / $("#screen").scope().screenScaleRatio;
        $(".ui-resizable-handle").css("transform", "scale(" + handleRatio + ")");
      }
      parentElement = $(element).parent();
      if (parentElement.hasClass("croset-element-group-div")) {
        parentElement.addClass("croset-resizable-parent");
      }
      if (CurrentScreenData.workspace) {
        return CurrentScreenData.workspace.toolbox_.refreshSelection();
      }
    };
  }
]).service("SelectedTemplate", [
  "SetElementProperty", "CurrentScreenData", function(SetElementProperty, CurrentScreenData) {
    var uuid;
    uuid = "";
    this.get = function() {
      return uuid;
    };
    this.set = function(id) {
      var screenElementsManager;
      uuid = id;
      $("#screen-wrapper").addClass("show-template");
      screenElementsManager = CurrentScreenData.elementsManager;
      SetElementProperty(id, true);
      return screenElementsManager.showTemplate(id);
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
                  return $interval.cancel(stop);
                }).error(function(data, status, headers, config) {
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
  "$scope", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$interval", "$mdSidenav", "$rootScope", "ScreenElementsManager", "Elements", "SelectedElementUUID", "CurrentScreenData", "projectDataRes", function($scope, ElementDatas, $state, $stateParams, $http, ProjectData, $interval, $mdSidenav, $rootScope, ScreenElementsManager, Elements, SelectedElementUUID, CurrentScreenData, projectDataRes) {
    var changeScreen, projectData;
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
      $rootScope.$broadcast("onSelectScreen");
      return $mdSidenav("select-screen").toggle().then(function() {});
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
    console.log("プロジェクト読み込み", projectData);
    ProjectData.init();
    ProjectData.screens = projectData.screens;
    ProjectData.name = projectData.name;
    ProjectData.projectId = projectData.projectId;
    ProjectData.defaultScreen = projectData.defaultScreen;
    if (projectData.variables) {
      ProjectData.variables = projectData.variables;
    }
    $rootScope.$on("onChangedScreen", function(ev, screenId) {
      var nextScreen;
      screenId = screenId || ProjectData.defaultScreen;
      nextScreen = ProjectData.getScreens()[screenId];
      if (nextScreen.elements == null) {
        nextScreen.elements = {};
      }
      if (nextScreen.card == null) {
        nextScreen.card = "";
      }
      if (nextScreen.templates == null) {
        nextScreen.templates = {};
      }
      changeScreen(nextScreen.elements, nextScreen.cards, nextScreen.templates);
      $scope.progress.isLoading = false;
      return $scope.progress.determinateValue += 100;
    });
    changeScreen = function(elements, cards, templates) {
      var newScreenElementsManager;
      newScreenElementsManager = new ScreenElementsManager($("#screen"));
      CurrentScreenData.elementsManager = newScreenElementsManager;
      angular.forEach(elements, function(data, uuid) {
        return newScreenElementsManager.addFromData(data, uuid);
      });
      return angular.forEach(templates, function(data, uuid) {
        return newScreenElementsManager.addTemplateFromData(data, uuid);
      });
    };
    return $rootScope.$broadcast("onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen);
  }
]).controller("ChildEditorController", [
  "$scope", "$rootScope", "$stateParams", "ProjectData", function($scope, $rootScope, $stateParams, ProjectData) {
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
        var handleRatio, height;
        height = editor.height() - 20;
        $scope.screenScaleRatio = height / screenDefaultHeight;
        $scope.marginRight = -1 * (screenDefaultWidth * (1 - $scope.screenScaleRatio));
        handleRatio = 1 / $scope.screenScaleRatio;
        return $(".ui-resizable-handle").css("transform", "scale(" + handleRatio + ")");
      }, 0);
    }).trigger("resize");
  }
]).directive("crosetElementEditor", function() {
  return {
    restrict: "A",
    scope: false,
    controller: [
      "$scope", "$element", "$attrs", "$compile", "ElementDatas", "SelectedElementUUID", "SelectedTemplate", function($scope, $element, $attrs, $compile, ElementDatas, SelectedElementUUID, SelectedTemplate) {
        $element.bind("mousedown", function(e) {
          if (!$scope.isTemplate) {
            SelectedElementUUID.set($attrs.uuid);
          } else {
            SelectedTemplate.set($attrs.uuid);
          }
          e.stopPropagation();
        });
        if (!$scope.isTemplate) {
          return SelectedElementUUID.set($attrs.uuid);
        } else {
          return SelectedTemplate.set($attrs.uuid);
        }
      }
    ]
  };
});
