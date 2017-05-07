var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.factory("ElementDatas", function() {
  return {
    text: {
      name: "テキスト",
      icon: "title",
      width: 160,
      height: 60,
      properties: [
        {
          title: "テキスト",
          icon: "title",
          propertyInputs: [
            [
              {
                type: "textarea",
                size: 100,
                options: {
                  label: "テキスト（改行可）",
                  defaultValue: "テキストを\n入力",
                  result: "text"
                }
              }
            ], [
              {
                type: "color-icon",
                size: 30,
                options: {
                  icon: "text_format",
                  defaultValue: "#000000",
                  result: "textColor"
                }
              }, {
                type: "toggle-icon",
                size: 30,
                options: {
                  icon: "format_bold",
                  result: "formatBold"
                }
              }, {
                type: "toggle-icon",
                size: 30,
                options: {
                  icon: "format_italic",
                  result: "formatItalic"
                }
              }
            ], [
              {
                type: "number",
                size: 100,
                options: {
                  defaultValue: 14,
                  label: "フォントサイズ",
                  step: 2,
                  result: "fontSize"
                }
              }
            ], [
              {
                type: "select",
                size: 50,
                options: {
                  defaultValue: "left",
                  label: "文字揃え",
                  items: {
                    "左揃え": "left",
                    "中央揃え": "center",
                    "右揃え": "right"
                  },
                  result: "textAlign"
                }
              }, {
                type: "select",
                size: 50,
                options: {
                  defaultValue: "top",
                  label: "文字揃え(縦)",
                  items: {
                    "上揃え": "flex-start",
                    "中央揃え": "center",
                    "下揃え": "flex-end"
                  },
                  result: "verticalAlign"
                }
              }
            ]
          ]
        }
      ]
    },
    button: {
      name: "ボタン",
      icon: "touch_app",
      width: 120,
      height: 40,
      properties: [
        {
          title: "テキスト",
          icon: "title",
          propertyInputs: [
            [
              {
                type: "textbox",
                size: 100,
                options: {
                  label: "テキスト",
                  defaultValue: "ボタン",
                  result: "text"
                }
              }
            ], [
              {
                type: "color-icon",
                size: 30,
                options: {
                  icon: "text_format",
                  defaultValue: "#000000",
                  result: "textColor"
                }
              }, {
                type: "toggle-icon",
                size: 30,
                options: {
                  icon: "format_italic",
                  result: "formatItalic"
                }
              }
            ], [
              {
                type: "number",
                size: 100,
                options: {
                  defaultValue: 14,
                  label: "フォントサイズ",
                  step: 2,
                  result: "fontSize"
                }
              }
            ]
          ]
        }, {
          title: "図形",
          icon: "border_all",
          propertyInputs: [
            [
              {
                type: "color_icon",
                size: 30,
                options: {
                  icon: "format_color_fill",
                  defaultValue: "#ffffff",
                  result: "bgColor"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "角丸"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 3,
                  min: 0,
                  max: 150,
                  step: 1,
                  result: "borderRadius"
                }
              }
            ], [
              {
                type: "headline",
                size: 100,
                options: {
                  text: "影",
                  marginTop: 15
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "透明度"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 74,
                  min: 0,
                  max: 99,
                  step: 1,
                  result: "shadowOpacity"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "位置(横)"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 0,
                  min: -20,
                  max: 20,
                  step: 1,
                  result: "shadowX"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "位置(縦)"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 2,
                  min: -20,
                  max: 20,
                  step: 1,
                  result: "shadowY"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "ぼかし"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 5,
                  min: 0,
                  max: 80,
                  step: 1,
                  result: "shadowGradation"
                }
              }
            ], [
              {
                type: "headline",
                size: 100,
                options: {
                  text: "枠線",
                  marginTop: 15
                }
              }
            ], [
              {
                type: "color_icon",
                size: 30,
                options: {
                  icon: "format_color_fill",
                  defaultValue: "#000000",
                  result: "borderColor"
                }
              }
            ], [
              {
                type: "slider",
                size: 100,
                options: {
                  defaultValue: 0,
                  min: 0,
                  max: 20,
                  step: 1,
                  result: "borderWidth"
                }
              }
            ]
          ]
        }
      ]
    },
    square: {
      name: "四角系",
      icon: "crop_square",
      width: 150,
      height: 150,
      properties: [
        {
          title: "図形",
          icon: "border_all",
          propertyInputs: [
            [
              {
                type: "color_icon",
                size: 30,
                options: {
                  icon: "format_color_fill",
                  defaultValue: "#ffffff",
                  result: "bgColor"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "角丸"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 3,
                  min: 0,
                  max: 150,
                  step: 1,
                  result: "borderRadius"
                }
              }
            ], [
              {
                type: "headline",
                size: 100,
                options: {
                  text: "影",
                  marginTop: 15
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "透明度"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 74,
                  min: 0,
                  max: 99,
                  step: 1,
                  result: "shadowOpacity"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "位置(横)"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 0,
                  min: -20,
                  max: 20,
                  step: 1,
                  result: "shadowX"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "位置(縦)"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 1,
                  min: -20,
                  max: 20,
                  step: 1,
                  result: "shadowY"
                }
              }
            ], [
              {
                type: "text",
                size: 20,
                options: {
                  text: "ぼかし"
                }
              }, {
                type: "slider",
                size: 80,
                options: {
                  defaultValue: 5,
                  min: 0,
                  max: 80,
                  step: 1,
                  result: "shadowGradation"
                }
              }
            ], [
              {
                type: "headline",
                size: 100,
                options: {
                  text: "枠線",
                  marginTop: 15
                }
              }
            ], [
              {
                type: "color_icon",
                size: 30,
                options: {
                  icon: "format_color_fill",
                  defaultValue: "#000000",
                  result: "borderColor"
                }
              }
            ], [
              {
                type: "slider",
                size: 100,
                options: {
                  defaultValue: 0,
                  min: 0,
                  max: 20,
                  step: 1,
                  result: "borderWidth"
                }
              }
            ]
          ]
        }
      ]
    },
    textbox: {
      name: "入力ボックス",
      icon: "create",
      width: 150,
      properties: [
        {
          title: "入力",
          icon: "mode_edit",
          propertyInputs: [
            [
              {
                type: "textbox",
                size: 100,
                options: {
                  defaultValue: "入力ボックス",
                  result: "default"
                }
              }
            ], [
              {
                type: "number",
                size: 100,
                options: {
                  label: "フォントサイズ",
                  defaultValue: 14,
                  result: "fontSize"
                }
              }
            ]
          ]
        }
      ]
    },
    checkbox: {
      name: "チェック",
      icon: "check_box"
    },
    "switch": {
      name: "スイッチ",
      icon: "swap_horizon"
    }
  };
}).factory("ScreenElementsManager", [
  "Elements", "ElementDatas", "$compile", "$injector", function(Elements, ElementDatas, $compile, $injector) {
    return function(screenElement) {
      var initScope, screenScope;
      screenScope = null;
      screenElement.empty();
      initScope = function() {
        screenScope = screenElement.scope();
        return screenScope.list = {};
      };
      this.init = function() {
        screenScope = null;
        return screenScope.list = {};
      };
      this.get = function() {
        return screenScope != null ? screenScope.list : void 0;
      };
      this.set = function(uuid, key, value) {
        return screenScope.list[uuid].options[key] = value;
      };
      this.rename = function(uuid, name) {
        return screenScope.list[uuid].name = name;
      };
      this.removeAll = function() {
        screenScope.list = {};
        return screenElement.empty();
      };
      this.add = function(type, uuid) {
        var e, options, scope;
        if (!screenScope) {
          initScope();
        }
        e = $("<croset-element-" + type + ">").addClass("croset-element").attr("id", uuid).attr("ng-class", "{'croset-element': true}").attr("croset-element-type", type).attr("uuid", uuid).attr("croset-element-editor", true).width(ElementDatas[type].width).height(ElementDatas[type].height);
        scope = screenScope.$new(true);
        scope.uuid = uuid;
        scope.s = screenScope;
        e = $compile(e)(scope);
        screenElement.append(e);
        options = {};
        return screenScope.list[uuid] = {
          type: type,
          name: ElementDatas[type].name,
          element: e,
          options: {}
        };
      };
      this.addFromData = function(data, uuid) {
        var e, scope;
        if (!screenScope) {
          initScope();
        }
        e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid);
        e.width(data.options.width).height(data.options.height).css({
          top: data.options.top,
          left: data.options.left
        });
        scope = screenScope.$new(true);
        scope.uuid = uuid;
        scope.s = screenScope;
        e = $compile(e)(scope);
        screenElement.append(e);
        data.element = e;
        return screenScope.list[uuid] = data;
      };
      this.addFromDataEditor = function(data, uuid) {
        var e, scope;
        if (!screenScope) {
          initScope();
        }
        e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("croset-element-editor", true).attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid);
        e.width(data.options.width).height(data.options.height).css({
          top: data.options.top,
          left: data.options.left
        });
        scope = screenScope.$new(true);
        scope.uuid = uuid;
        scope.s = screenScope;
        e = $compile(e)(scope);
        screenElement.append(e);
        data.element = e;
        return screenScope.list[uuid] = data;
      };
      this["delete"] = function(uuid) {
        var VisiblePropertyCards;
        screenScope.list[uuid].element.remove();
        VisiblePropertyCards = $injector.get("VisiblePropertyCards");
        VisiblePropertyCards.set([]);
        return delete screenScope.list[uuid];
      };
      this.initialize = function() {
        screenScope.list = {};
        return screenElement.empty();
      };
    };
  }
]).directive("crosetElement", [
  "$interval", function($interval) {
    return {
      restrict: "C",
      scope: false,
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetElementButton", function() {
  return {
    restrict: "E",
    templateUrl: "template-button.html",
    link: function(scope, element, attrs) {
      return scope.click = function() {
        var fnc;
        fnc = scope.s.list[scope.uuid].options.click;
        if (fnc) {
          return fnc();
        }
      };
    }
  };
}).directive("crosetElementText", function() {
  return {
    restrict: "E",
    templateUrl: "template-text.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementTextbox", function() {
  return {
    restrict: "E",
    templateUrl: "template-textbox.html",
    link: function(scope, element, attrs) {
      console.log(scope, "suko-pu");
      return scope.s.list[scope.uuid].options.text = options["default"];
    }
  };
}).directive("crosetElementSquare", function() {
  return {
    restrict: "E",
    templateUrl: "template-square.html",
    link: function(scope, element, attrs) {}
  };
});
