var crosetModule;

crosetModule = angular.module("Croset");

crosetModule;

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
  "VisiblePropertyCards", "ElementDatas", "ScreenElements", function(VisiblePropertyCards, ElementDatas, ScreenElements) {
    return function(uuid) {
      var data, defaultData, i, input, j, k, l, len, len1, len2, m, n, property, ref, result, row;
      VisiblePropertyCards.set([]);
      data = ScreenElements.get()[uuid];
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
]).controller("ScreenController", [
  "$scope", "$timeout", function($scope, $timeout) {
    var editor, screenDefaultHeight, screenDefaultWidth, screenZone;
    $scope.screenScaleRatio = 1;
    editor = $("editor");
    screenZone = $("#screen-zone");
    screenDefaultWidth = screenZone.width();
    screenDefaultHeight = screenZone.height();
    return $(window).on("resize", function() {
      return $timeout(function() {
        var height;
        height = editor.height() - 20;
        $scope.screenScaleRatio = height / screenDefaultHeight;
        console.log(screenDefaultWidth, $scope.screenScaleRatio);
        return $scope.marginRight = -1 * (screenDefaultWidth * (1 - $scope.screenScaleRatio));
      }, 0);
    }).trigger("resize");
  }
]).controller("HierarchyController", [
  "$scope", "ScreenElements", "ElementDatas", "SelectedElementUUID", function($scope, ScreenElements, ElementDatas, SelectedElementUUID) {
    $scope.screenElements = ScreenElements.get();
    $scope.elementDatas = ElementDatas;
    return $scope.$watch(SelectedElementUUID.get, function(newVal, oldVal) {
      return $scope.selectedElementUUID = newVal;
    });
  }
]).directive("crosetHierarchyItem", [
  "$mdDialog", "ElementDatas", "SelectedElementUUID", "ScreenElements", function($mdDialog, ElementDatas, SelectedElementUUID, ScreenElements) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        scope.onclick = function(data) {
          SelectedElementUUID.set(scope.uuid);
        };
        return scope.showConfirmDelete = function(ev) {
          var confirm;
          confirm = $mdDialog.confirm().title("削除").content("'" + ScreenElements.get()[scope.uuid].name + "' を削除します").targetEvent(ev).ok("OK").cancel("キャンセル");
          return $mdDialog.show(confirm).then(function() {
            return ScreenElements["delete"](scope.uuid);
          }, function() {});
        };
      }
    };
  }
]).directive("addElementCard", [
  "ScreenElements", "$compile", "getUUID", function(ScreenElements, $compile, getUUID) {
    return {
      scope: true,
      link: function(scope, element, attrs) {
        return scope.onclick = function() {
          ScreenElements.add(element.attr("add-element-card"), getUUID());
        };
      }
    };
  }
]).controller("PropertyController", [
  "$scope", "ScreenElements", "SelectedElementUUID", "VisiblePropertyCards", "$timeout", function($scope, ScreenElements, SelectedElementUUID, VisiblePropertyCards, $timeout) {
    $scope.visiblePropertyCards = [];
    $scope.elementName = null;
    VisiblePropertyCards.onchange(function(value) {
      return $timeout(function() {
        $scope.visiblePropertyCards = value;
        if (ScreenElements.get()[SelectedElementUUID.get()]) {
          return $scope.elementName = ScreenElements.get()[SelectedElementUUID.get()].name;
        } else {
          return $scope.elementName = null;
        }
      }, 0);
    });
    return $scope.onChangeName = function() {
      return $scope.elementName = ScreenElements.get()[SelectedElementUUID.get()].name = $scope.elementName;
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
