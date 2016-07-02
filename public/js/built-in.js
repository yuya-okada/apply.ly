var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.service("ScreenElements", [
  "Elements", "ElementDatas", "$compile", "VisiblePropertyCards", function(Elements, ElementDatas, $compile, VisiblePropertyCards) {
    var list, scopes, screenScope;
    screenScope = null;
    list = {};
    this.get = function() {
      return list;
    };
    this.set = function(uuid, key, value) {
      list[uuid].options[key] = value;
      return scopes[uuid].options[key] = value;
    };
    scopes = {};
    this.add = function(type, uuid) {
      var e, options;
      if (screenScope == null) {
        screenScope = Elements.screen.scope();
      }
      e = $("<croset-element-" + type + ">").addClass("croset-element").attr("id", uuid).attr("ng-class", "{'croset-element': true}").attr("croset-element-type", type).attr("uuid", uuid).attr("croset-element-editor", true).width(ElementDatas[type].width).height(ElementDatas[type].height);
      console.log(Elements, "aaaaaaaa");
      e = $compile(e)(screenScope);
      Elements.screen.append(e);
      options = {};
      list[uuid] = {
        type: type,
        name: ElementDatas[type].name,
        element: e,
        options: {}
      };
      scopes[uuid] = e.scope();
      return e.scope().options = {};
    };
    this.addFromData = function(data, uuid) {
      var e, scope;
      if (screenScope == null) {
        screenScope = Elements.screen.scope();
      }
      e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid);
      e.width(data.width).height(data.height).css({
        top: data.top,
        left: data.left
      });
      scope = screenScope.$new(true);
      e = $compile(e)(scope);
      scope.options = data.options;
      return Elements.screen.append(e);
    };
    this.addFromDataEditor = function(data, uuid) {
      var e, scope;
      if (screenScope == null) {
        screenScope = Elements.screen.scope();
      }
      e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("croset-element-editor", true).attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid);
      e.width(data.width).height(data.height).css({
        top: data.top,
        left: data.left
      });
      console.log(data);
      scope = screenScope.$new(true);
      e = $compile(e)(scope);
      Elements.screen.append(e);
      scopes[uuid] = scope;
      scope.options = data.options;
      data.element = e;
      return list[uuid] = data;
    };
    this["delete"] = function(uuid) {
      list[uuid].element.remove();
      VisiblePropertyCards.set([]);
      return delete list[uuid];
    };
    this.initialize = function() {
      list = {};
      scopes = {};
      return Elements.screen.empty();
    };
    window.se = function() {
      return list;
    };
  }
]).directive("crosetElementButton", function() {
  return {
    restrict: "E",
    scope: true,
    templateUrl: "template-button.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementText", function() {
  return {
    restrict: "E",
    scope: true,
    templateUrl: "template-text.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementTextbox", function() {
  return {
    restrict: "E",
    scope: true,
    templateUrl: "template-textbox.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementSquare", function() {
  return {
    restrict: "E",
    scope: true,
    templateUrl: "template-square.html",
    link: function(scope, element, attrs) {}
  };
});
