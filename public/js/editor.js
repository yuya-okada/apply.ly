var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.service("CurrentScreenData", [
  function() {
    var that;
    this.id = "";
    this.elementsManager = null;
    that = this;
    this.workspace = null;
    this.getElementsManager = function() {
      return that.elementsManager;
    };
    this.style = {};
  }
]).service("ProjectData", [
  "$http", "$rootScope", "$stateParams", "$state", "ScreenElementsManager", "getUUID", "CurrentScreenData", function($http, $rootScope, $stateParams, $state, ScreenElementsManager, getUUID, CurrentScreenData) {
    var callbacksVar, saveCurrentScreen, that, triggerCallback;
    this.projectId = null;
    this.name = null;
    this.screens = {};
    this.defaultScreen = "トップ";
    this.variables = {};
    this.config = {};
    this.scripts = {};
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
      return that.variables = {};
    };
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      $state.current = toState;
      if (toState.name.match(/editor/)) {
        if (toParams.projectId === that.projectId + "") {
          return saveCurrentScreen();
        }
      }
    });
    saveCurrentScreen = function() {
      var cards, ref, ref1, ref2, sourceCode, xml;
      if (CurrentScreenData.workspace) {
        xml = Blockly.Xml.workspaceToDom(CurrentScreenData.workspace);
        cards = Blockly.Xml.domToText(xml);
        sourceCode = Blockly.JavaScript.workspaceToCode(CurrentScreenData.workspace);
      } else {
        cards = (ref = that.screens[CurrentScreenData.id]) != null ? ref.cards : void 0;
        sourceCode = (ref1 = that.screens[CurrentScreenData.id]) != null ? ref1.sourceCode : void 0;
      }
      return angular.extend(that.screens[CurrentScreenData.id], {
        elements: CurrentScreenData.elementsManager.get(),
        templates: CurrentScreenData.elementsManager.getTemplates(),
        cards: cards,
        sourceCode: sourceCode,
        varProperties: (ref2 = CurrentScreenData.elementsManager) != null ? ref2.varProperties : void 0,
        style: CurrentScreenData.style
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
        triggerCallback();
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
        triggerCallback();
        return true;
      }
    };
    this.removeScreen = function(id) {
      if (that.screens[id]) {
        delete that.screens[id];
        triggerCallback();
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
    triggerCallback = function() {
      var callback, i, len, ref, results;
      ref = that.callbacks;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        callback = ref[i];
        results.push(callback());
      }
      return results;
    };
    CrosetBlock.addVariable = function(newName) {
      return that.variables[getUUID()] = {
        name: newName
      };
    };
    CrosetBlock.getVariableIdByName = function(name) {
      var id, ref, variable;
      ref = that.variables;
      for (id in ref) {
        variable = ref[id];
        if (that.variables[id].name === name) {
          return id;
        }
      }
      return null;
    };
    CrosetBlock.renameVariable = function(oldName, newName) {
      var id, ref, variable;
      ref = that.variables;
      for (id in ref) {
        variable = ref[id];
        if (that.variables[id].name === oldName) {
          that.variables[id].name = newName;
          break;
        }
      }
      return that.triggerCallbackVar();
    };
    CrosetBlock.deleteVariable = function(name) {
      var id, key, properties, ref, ref1, ref2, ref3, vId, varId, variable;
      vId = "";
      ref = that.variables;
      for (id in ref) {
        variable = ref[id];
        if (that.variables[id].name === name) {
          delete that.variables[id].name;
          varId = id;
        }
      }
      ref2 = (ref1 = CurrentScreenData.elementsManager) != null ? ref1.varProperties : void 0;
      for (id in ref2) {
        properties = ref2[id];
        for (key in properties) {
          varId = properties[key];
          if (varId === vId) {
            if ((ref3 = CurrentScreenData.elementsManager) != null) {
              ref3.removeVarToProperty(id, key);
            }
          }
        }
      }
      return that.triggerCallbackVar();
    };
    callbacksVar = [];
    this.onVariablesChanged = function(fnc) {
      return callbacksVar.push(fnc);
    };
    this.triggerCallbackVar = function() {
      var callback, i, len, results;
      results = [];
      for (i = 0, len = callbacksVar.length; i < len; i++) {
        callback = callbacksVar[i];
        if (CurrentScreenData.workspace) {
          results.push(callback(CurrentScreenData.workspace.variableList));
        } else {
          results.push(callback(that.variables));
        }
      }
      return results;
    };
    this.get = function() {
      var projectData, replacer;
      replacer = function(key, value) {
        if (value instanceof jQuery) {
          return void 0;
        }
        return value;
      };
      saveCurrentScreen();
      projectData = {
        name: this.name,
        projectId: this.projectId,
        screens: this.screens,
        defaultScreen: this.defaultScreen,
        variables: this.variables || {},
        config: this.config,
        scripts: this.scripts
      };
      console.log("Builded", projectData);
      return JSON.parse(JSON.stringify(projectData, replacer));
    };
  }
]).service("SelectedElementOrTemplateUUID", [
  "VisiblePropertyCards", "CurrentScreenData", function(VisiblePropertyCards, CurrentScreenData) {
    var isTemplate, that, uuid;
    uuid = null;
    isTemplate = null;
    that = this;
    this.get = function() {
      return uuid;
    };
    this.set = function(id, isTemplate_) {
      uuid = id;
      return isTemplate = isTemplate_;
    };
    this.isTemplate = function() {
      return isTemplate;
    };
    this.init = function() {
      var screenElements, selectedElement;
      $("#screen-wrapper").removeClass("show-template");
      screenElements = CurrentScreenData.elementsManager;
      if (uuid && screenElements.get(uuid) && !isTemplate) {
        selectedElement = $(screenElements.get(uuid).element);
        if (selectedElement.data("ui-resizable")) {
          selectedElement.resizable("destroy");
        }
      }
      $(".croset-resizable-parent").removeClass("croset-resizable-parent");
      $(".ui-resizable").removeClass("ui-resizable");
      uuid = null;
      isTemplate = null;
      return VisiblePropertyCards.set([]);
    };
  }
]).service("SelectedElementUUID", [
  "SelectedElementOrTemplateUUID", "SetElementProperty", "VisiblePropertyCards", "CurrentScreenData", "$rootScope", function(SelectedElementOrTemplateUUID, SetElementProperty, VisiblePropertyCards, CurrentScreenData, $rootScope) {
    var that, uuid;
    uuid = null;
    that = this;
    this.init = function() {
      uuid = null;
      return VisiblePropertyCards.set([]);
    };
    this.get = function() {
      return uuid;
    };
    this.set = function(val) {
      var click, element, handleRatio, onResizedOrDraged, parentElement, screenElements;
      SelectedElementOrTemplateUUID.init();
      screenElements = CurrentScreenData.elementsManager;
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
      $rootScope.$broadcast("onResizedOrDraged", element);
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
        CurrentScreenData.workspace.toolbox_.refreshSelection();
      }
      return SelectedElementOrTemplateUUID.set(uuid);
    };
  }
]).service("SelectedTemplate", [
  "SelectedElementOrTemplateUUID", "SetElementProperty", "CurrentScreenData", function(SelectedElementOrTemplateUUID, SetElementProperty, CurrentScreenData) {
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
      screenElementsManager.showTemplate(id);
      return SelectedElementOrTemplateUUID.set(id, true);
    };
  }
]).factory("ListItemSelect", [
  "$timeout", function($timeout) {
    return {
      open: function(id) {
        $("#screen-wrapper").addClass("list-item-select-mode");
      },
      close: function(id) {
        $("#screen-wrapper").removeClass("list-item-select-mode");
      }
    };
  }
]).controller("HeaderController", [
  "$scope", "$rootScope", "$http", "$mdDialog", "$mdSidenav", "$timeout", "$interval", "$injector", "$stateParams", "$mdToast", "ProjectData", function($scope, $rootScope, $http, $mdDialog, $mdSidenav, $timeout, $interval, $injector, $stateParams, $mdToast, ProjectData) {
    var cancel, ref, ref1, saveProject, screenId;
    $scope.projectName = null;
    screenId = $stateParams.screenId || "default";
    $scope.screenName = (ref = ProjectData.screens) != null ? (ref1 = ref[screenId]) != null ? ref1.name : void 0 : void 0;
    $rootScope.$on("onChangedScreen", function(ev, screenId) {
      var ref2, ref3;
      return $scope.screenName = (ref2 = ProjectData.screens) != null ? (ref3 = ref2[screenId]) != null ? ref3.name : void 0 : void 0;
    });
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
            win = $window.open("/builded-projects/" + ProjectData.get().projectId + ".zip");
            return stop = $interval(function() {
              if (win.closed) {
                return $http({
                  method: "DELETE",
                  url: "/build",
                  data: ProjectData.get(),
                  headers: {
                    "Content-Type": "application/json;charset=utf-8"
                  }
                }).then(function(result) {
                  return $interval.cancel(stop);
                }, function(result) {
                  return $interval.cancel(stop);
                });
              }
            }, 100);
          };
          return $http({
            method: "GET",
            url: "/build",
            params: ProjectData.get()
          }).then(function(result) {
            var checkBuilded, data;
            data = result.data;
            checkBuilded = function() {
              return $http({
                method: "GET",
                url: "/builded",
                params: {
                  projectId: ProjectData.get().projectId
                }
              }).then(function(result) {
                data = result.data;
                if (data) {
                  return $timeout(function() {
                    return checkBuilded();
                  }, 2000);
                } else {
                  return $scope.done = true;
                }
              }, function(result) {
                data = result.data;
                return console.log("Failed", data);
              });
            };
            return checkBuilded();
          }, function(result) {
            var data;
            data = result;
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
        return $mdToast.show($mdToast.simple().textContent('保存しました').position("right bottom").hideDelay(3000));
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
    $scope.config = function(ev) {
      var ConfigDialogController;
      ConfigDialogController = [
        "$scope", "ProjectData", "$mdDialog", function($scope, ProjectData, $mdDialog) {
          $scope.headings = {
            "server": "サーバー"
          };
          $scope.currentHeading = "server";
          $scope.changeHeading = function(heading) {
            return $scope.currentHeading = heading;
          };
          $scope.config = angular.merge({
            server: {}
          }, ProjectData.config);
          $scope.cancel = function() {
            return $mdDialog.hide();
          };
          return $scope.ok = function() {
            ProjectData.config = $scope.config;
            return $mdDialog.hide();
          };
        }
      ];
      return $mdDialog.show({
        controller: ConfigDialogController,
        templateUrl: 'templates/config-dialog.tmpl.html',
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
      }).then(function(result) {
        var data;
        data = result.data;
        console.log("Saved", data);
        if (fnc) {
          return fnc();
        }
      }, function(result) {
        return console.log("Failed", result);
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
  "$scope", "getUUID", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$timeout", "$interval", "$injector", "$mdToast", "$mdSidenav", "$rootScope", "$mdDialog", "ScreenElementsManager", "Elements", "SelectedElementUUID", "CurrentScreenData", "projectDataRes", function($scope, getUUID, ElementDatas, $state, $stateParams, $http, ProjectData, $timeout, $interval, $injector, $mdToast, $mdSidenav, $rootScope, $mdDialog, ScreenElementsManager, Elements, SelectedElementUUID, CurrentScreenData, projectDataRes) {
    var cancel, changeScreen, projectData;
    $scope.isLoading = true;
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
    $scope.secondModeList = {
      script: {
        icon: "description"
      }
    };
    $scope.changeMode = function(name) {
      var apps, config, init, ref;
      if (name === "server") {
        if ((ref = ProjectData.config) != null ? ref.server : void 0) {
          config = {
            apiKey: ProjectData.config.server.apiKey,
            authDomain: ProjectData.config.server.authDomain,
            databaseURL: ProjectData.config.server.databaseURL,
            projectId: ProjectData.config.server.projectId,
            storageBucket: ProjectData.config.server.storageBucket,
            messagingSenderId: ProjectData.config.server.messagingSenderId
          };
          init = function() {
            var error;
            try {
              firebase.initializeApp(config);
            } catch (_error) {
              error = _error;
              $mdToast.show($mdToast.simple().textContent('firebaseを正しく設定してください').position("right bottom").hideDelay(3000));
              return;
            }
            return $state.go("editor.server", {
              screenId: CurrentScreenData.id
            });
          };
          apps = firebase.apps;
          if (apps.length !== 0) {
            firebase.app()["delete"]().then(init);
          } else {
            init();
          }
        } else {
          $mdToast.show($mdToast.simple().textContent('firebaseを設定してください').position("right bottom").hideDelay(3000));
        }
      } else {

      }
      return $state.go("editor." + name, {
        screenId: CurrentScreenData.id
      });
    };
    Elements.set("screen", angular.element("#screen"));
    projectData = projectDataRes.data;
    console.log("プロジェクト読み込み", projectData);
    ProjectData.init();
    ProjectData.screens = projectData.screens;
    ProjectData.scripts = projectData.scripts;
    ProjectData.name = projectData.name;
    ProjectData.projectId = projectData.projectId;
    ProjectData.defaultScreen = projectData.defaultScreen;
    ProjectData.config = projectData.config;
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
      if (nextScreen.style == null) {
        nextScreen.style = {};
      }
      changeScreen(nextScreen.elements, nextScreen.cards, nextScreen.templates, nextScreen.varProperties, nextScreen.style);
      return $scope.progress.isLoading = false;
    });
    changeScreen = function(elements, cards, templates, varProperties, style) {
      var newScreenElementsManager;
      newScreenElementsManager = new ScreenElementsManager($("#screen"));
      CurrentScreenData.elementsManager = newScreenElementsManager;
      CurrentScreenData.workspace = null;
      CurrentScreenData.style = style;
      angular.forEach(elements, function(data, uuid) {
        return newScreenElementsManager.addFromData(data, uuid);
      });
      angular.forEach(templates, function(data, uuid) {
        return newScreenElementsManager.addTemplateFromData(data, uuid);
      });
      if (varProperties == null) {
        varProperties = {};
      }
      return newScreenElementsManager.varProperties = varProperties;
    };
    $scope.isVarToolbarOpen = false;
    $scope.openVarToolbar = function() {
      if ($state.current.name !== "editor.program") {
        if (cancel) {
          $timeout.cancel(cancel);
        }
        $("#var-fab-toolbar").css("width", "100%");
        $scope.vars = ProjectData.variables;
        return $scope.isVarToolbarOpen = true;
      }
    };
    cancel = null;
    $scope.closeVarToolbar = function() {
      $scope.isVarToolbarOpen = false;
      return cancel = $timeout(function() {
        return $("#var-fab-toolbar").css("width", "");
      }, 1000);
    };
    $scope.$state = $state;
    $scope.addVariable = function(ev) {
      var confirm;
      confirm = $mdDialog.prompt().title('新しいを変数').textContent("新しい変数を追加します。").placeholder('').ariaLabel('名前を入力').targetEvent(ev).ok('OK').cancel('キャンセル');
      return $mdDialog.show(confirm).then(function(result) {
        var ref, varId, varName;
        ref = ProjectData.variables;
        for (varId in ref) {
          varName = ref[varId];
          if (varName === result) {
            $mdToast.show($mdToast.simple().textContent('その名前の変数はすでに存在します').position("right bottom").hideDelay(3000));
            return;
          }
        }
        return ProjectData.variables[getUUID()] = {
          name: result
        };
      }, function() {});
    };
    $scope.onVariableClicked = function(ev, varId) {
      if ($state.current.name === "editor.server") {
        ev.stopPropagation();
        return $mdDialog.show({
          controller: "ServerBindDialogController",
          templateUrl: 'templates/server-bind-dialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            varId: varId
          }
        }).then(function(answer) {}, function() {});
      }
    };
    $stateParams = $injector.get("$stateParams");
    return $rootScope.$broadcast("onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen);
  }
]).controller("ChildEditorController", [
  "$scope", "$rootScope", "$stateParams", "ProjectData", function($scope, $rootScope, $stateParams, ProjectData) {
    return $rootScope.$broadcast("onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen);
  }
]).controller("ScreenController", [
  "$scope", "$timeout", "ListItemSelect", "SelectedElementUUID", "SelectedElementOrTemplateUUID", "CurrentScreenData", "ElementDatas", function($scope, $timeout, ListItemSelect, SelectedElementUUID, SelectedElementOrTemplateUUID, CurrentScreenData, ElementDatas) {
    var editor, screenDefaultHeight, screenDefaultWidth, screenZone;
    $scope.currentScreenData = CurrentScreenData;
    $scope.screenScaleRatio = 1;
    editor = $("#editor");
    screenZone = $("#screen-zone");
    screenDefaultWidth = screenZone.width();
    screenDefaultHeight = screenZone.outerHeight();
    console.log("Original Screen Size", {
      width: screenDefaultWidth,
      height: screenDefaultHeight
    });
    $(window).on("resize", function() {
      return $timeout(function() {
        var handleRatio, height;
        height = editor.height() - 20;
        $scope.screenScaleRatio = height / screenDefaultHeight;
        $scope.marginRight = -1 * (screenDefaultWidth * (1 - $scope.screenScaleRatio));
        handleRatio = 1 / $scope.screenScaleRatio;
        return $(".ui-resizable-handle").css("transform", "scale(" + handleRatio + ")");
      }, 0);
    }).trigger("resize");
    $scope.onclick = function() {
      return SelectedElementOrTemplateUUID.init();
    };
    $scope.elementDatas = ElementDatas;
    $scope.openListItemSelect = function() {
      $scope.selectedElementUUID = SelectedElementUUID.get();
      $scope.screenElements = CurrentScreenData.elementsManager.get();
      $scope.templates = CurrentScreenData.elementsManager.getTemplates();
      return ListItemSelect.open();
    };
    $scope.closeListItemSelect = function() {
      return ListItemSelect.close();
    };
    return $scope.closeTemplatePreview = function() {
      return $("#screen-wrapper").removeClass("show-template");
    };
  }
]).directive("varButton", [
  function() {
    return {
      restrict: "C",
      scope: true,
      link: function(scope) {
        return scope.varButtonDragOptions = {
          helper: "clone",
          appendTo: "body",
          cancel: ""
        };
      }
    };
  }
]).directive("hierarchyItem", [
  function() {
    return {
      restrict: "E",
      templateUrl: "hierarchy-item.html",
      controller: [
        "$attrs", function($attrs) {
          return this.isTemplate = $attrs.istemplate;
        }
      ]
    };
  }
]).directive("crosetElementEditor", function() {
  return {
    restrict: "A",
    scope: false,
    controller: [
      "$scope", "$element", "$attrs", "$compile", "ElementDatas", "SelectedElementUUID", "SelectedTemplate", function($scope, $element, $attrs, $compile, ElementDatas, SelectedElementUUID, SelectedTemplate) {
        var eventCover;
        eventCover = $("<div>").css("position", "absolute").css("top", "-5px").css("left", "-5px").css("bottom", "-5px").css("right", "-5px").css("zIndex", 20000);
        $($element).append(eventCover);
        $element.bind("mousedown", function(e) {
          if (!$scope.isTemplate) {
            SelectedElementUUID.set($attrs.uuid);
          }
          e.stopPropagation();
        });
        if (!$scope.isTemplate) {
          SelectedElementUUID.set($attrs.uuid);
        }
      }
    ]
  };
});
