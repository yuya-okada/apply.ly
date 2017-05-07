var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.service("VisiblePropertyCards", function() {
  var callback, callbacks, list;
  list = [];
  callbacks = [];
  this.onchange = function(func) {
    return callbacks.push(func);
  };
  this.get = function() {
    return list;
  };
  this.set = function(ls) {
    list = ls;
    return callback();
  };
  this.push = function(val) {
    list.push(val);
    return callback();
  };
  callback = function() {
    var func, l, len, results;
    results = [];
    for (l = 0, len = callbacks.length; l < len; l++) {
      func = callbacks[l];
      results.push(func(list));
    }
    return results;
  };
}).service("SetElementProperty", [
  "VisiblePropertyCards", "ElementDatas", "CurrentScreenData", function(VisiblePropertyCards, ElementDatas, CurrentScreenData) {
    return function(uuid) {
      var data, defaultData, i, input, j, k, l, len, len1, len2, m, n, property, ref, result, row;
      VisiblePropertyCards.set([]);
      data = CurrentScreenData.elementsManager.get()[uuid];
      defaultData = [].concat(ElementDatas[data.type].properties);
      for (i = l = 0, len = defaultData.length; l < len; i = ++l) {
        property = defaultData[i];
        ref = property.propertyInputs;
        for (j = m = 0, len1 = ref.length; m < len1; j = ++m) {
          row = ref[j];
          for (k = n = 0, len2 = row.length; n < len2; k = ++n) {
            input = row[k];
            result = input.options.result;
            if (result && data.options[result]) {
              defaultData[i].propertyInputs[j][k].options.defaultValue = data.options[result];
            }
          }
        }
      }
      return VisiblePropertyCards.set(defaultData);
    };
  }
]).controller("HierarchyController", [
  "$scope", "CurrentScreenData", "ElementDatas", "SelectedElementUUID", function($scope, CurrentScreenData, ElementDatas, SelectedElementUUID) {
    var screenElementsManager;
    screenElementsManager = CurrentScreenData.elementsManager;
    $scope.screenElements = screenElementsManager.get();
    $scope.elementDatas = ElementDatas;
    return $scope.$watch(SelectedElementUUID.get, function(newVal, oldVal) {
      if (newVal) {
        $scope.selectedElementUUID = newVal;
        $scope.screenElements = screenElementsManager.get();
        return console.log(screenElementsManager);
      }
    });
  }
]).directive("crosetHierarchyItem", [
  "$mdDialog", "ElementDatas", "SelectedElementUUID", "CurrentScreenData", function($mdDialog, ElementDatas, SelectedElementUUID, CurrentScreenData) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var screenElementsManager;
        screenElementsManager = CurrentScreenData.elementsManager;
        scope.onclick = function(data) {
          SelectedElementUUID.set(scope.uuid);
        };
        scope.showPromptRename = function(ev) {
          var confirm;
          confirm = $mdDialog.prompt().title('名前を変更').textContent("の名前を変更します。").placeholder('').ariaLabel('新しい名前を入力').targetEvent(ev).ok('OK!').cancel('キャンセル');
          return $mdDialog.show(confirm).then(function(result) {
            return screenElementsManager.rename(scope.uuid, result);
          }, function() {});
        };
        return scope.showConfirmDelete = function(ev) {
          var confirm;
          confirm = $mdDialog.confirm().title("削除").content("'" + screenElementsManager.get()[scope.uuid].name + "' を削除します").targetEvent(ev).ok("OK").cancel("キャンセル");
          return $mdDialog.show(confirm).then(function() {
            return screenElementsManager["delete"](scope.uuid);
          }, function() {});
        };
      }
    };
  }
]).directive("addElementCard", [
  "CurrentScreenData", "$compile", "getUUID", function(CurrentScreenData, $compile, getUUID) {
    return {
      scope: true,
      link: function(scope, element, attrs) {
        return scope.onclick = function() {
          CurrentScreenData.elementsManager.add(element.attr("add-element-card"), getUUID());
        };
      }
    };
  }
]).controller("PropertyController", [
  "$scope", "CurrentScreenData", "SelectedElementUUID", "VisiblePropertyCards", "$timeout", "$interval", "$rootScope", function($scope, CurrentScreenData, SelectedElementUUID, VisiblePropertyCards, $timeout, $interval, $rootScope) {
    var resizing, screenElementsManager;
    $scope.visiblePropertyCards = [];
    $scope.elementName = null;
    $scope.isVisibleOffsetProperty = "none";
    screenElementsManager = CurrentScreenData.elementsManager;
    VisiblePropertyCards.onchange(function(value) {
      return $timeout(function() {
        $scope.visiblePropertyCards = value;
        $scope.isVisibleOffsetProperty = "block";
        if (screenElementsManager.get()[SelectedElementUUID.get()]) {
          return $scope.elementName = screenElementsManager.get()[SelectedElementUUID.get()].name;
        } else {
          return $scope.elementName = null;
        }
      }, 0);
    });
    $scope.onChangeName = function() {
      return $scope.elementName = screenElementsManager.get()[SelectedElementUUID.get()].name = $scope.elementName;
    };
    resizing = false;
    $rootScope.$on("onResizedOrDragging", function(ev, element) {
      resizing = true;
      return $timeout(function() {
        $scope.top = parseInt(element.css("top"), 10);
        $scope.left = parseInt(element.css("left"), 10);
        $scope.width = element.width();
        return $scope.height = element.height();
      });
    });
    $rootScope.$on("onResizedOrDraged", function(ev) {
      return resizing = false;
    });
    $scope.onChangeTop = function() {
      var ref;
      if (!resizing) {
        if ((ref = screenElementsManager.get()[SelectedElementUUID.get()]) != null) {
          ref.element.css("top", $scope.top);
        }
        return screenElementsManager.set(SelectedElementUUID.get(), "top", $scope.top);
      }
    };
    $scope.onChangeLeft = function() {
      var ref;
      if (!resizing) {
        if ((ref = screenElementsManager.get()[SelectedElementUUID.get()]) != null) {
          ref.element.css("left", $scope.left);
        }
        return screenElementsManager.set(SelectedElementUUID.get(), "left", $scope.left);
      }
    };
    $scope.onChangeWidth = function() {
      var ref;
      if (!resizing) {
        if ((ref = screenElementsManager.get()[SelectedElementUUID.get()]) != null) {
          ref.element.width($scope.width);
        }
        return screenElementsManager.set(SelectedElementUUID.get(), "width", $scope.width);
      }
    };
    return $scope.onChangeHeight = function() {
      var ref;
      if (!resizing) {
        if ((ref = screenElementsManager.get()[SelectedElementUUID.get()]) != null) {
          ref.element.height($scope.height);
        }
        return screenElementsManager.set(SelectedElementUUID.get(), "height", $scope.height);
      }
    };
  }
]).directive("propertyCard", function() {
  return {
    restrict: "C",
    controller: [
      "$scope", "$element", function($scope, $element) {
        return $scope.cardToggle = false;
      }
    ]
  };
});
