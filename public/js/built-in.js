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
          icon: "settings",
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
                    "上揃え": "top",
                    "中央揃え": "middle",
                    "下揃え": "bottom"
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
          icon: "settings",
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
      var list, scopes, screenScope;
      console.log(screenElement);
      screenScope = null;
      list = {};
      scopes = {};
      screenElement.empty();
      this.init = function() {
        screenScope = null;
        return list = {};
      };
      this.get = function() {
        return list;
      };
      this.set = function(uuid, key, value) {
        list[uuid].options[key] = value;
        return scopes[uuid].options[key] = value;
      };
      this.removeAll = function() {
        list = {};
        return screenElement.empty();
      };
      this.add = function(type, uuid) {
        var e, options;
        if (screenScope == null) {
          screenScope = screenElement.scope();
        }
        e = $("<croset-element-" + type + ">").addClass("croset-element").attr("id", uuid).attr("ng-class", "{'croset-element': true}").attr("croset-element-type", type).attr("uuid", uuid).attr("croset-element-editor", true).width(ElementDatas[type].width).height(ElementDatas[type].height);
        e = $compile(e)(screenScope);
        screenElement.append(e);
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
          screenScope = screenElement.scope();
        }
        e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid);
        e.width(data.options.width).height(data.options.height).css({
          top: data.options.top,
          left: data.options.left
        });
        scope = screenScope.$new(true);
        e = $compile(e)(scope);
        scope.options = data.options;
        screenElement.append(e);
        return console.log(e.children().children().html());
      };
      this.addFromDataEditor = function(data, uuid) {
        var e, scope;
        console.log(Elements);
        if (screenScope == null) {
          screenScope = screenElement.scope();
        }
        e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("croset-element-editor", true).attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid);
        console.log(data);
        e.width(data.options.width).height(data.options.height).css({
          top: data.options.top,
          left: data.options.left
        });
        scope = screenScope.$new(true);
        e = $compile(e)(scope);
        screenElement.append(e);
        scopes[uuid] = scope;
        scope.options = data.options;
        data.element = e;
        return list[uuid] = data;
      };
      this["delete"] = function(uuid) {
        var VisiblePropertyCards;
        list[uuid].element.remove();
        VisiblePropertyCards = $injector.get("VisiblePropertyCards");
        VisiblePropertyCards.set([]);
        return delete list[uuid];
      };
      this.initialize = function() {
        list = {};
        scopes = {};
        return screenElement.empty();
      };
    };
  }
]).directive("crosetElement", [
  "$compile", function($compile) {
    return {
      restrict: "C",
      scope: false,
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetElementButton", function() {
  return {
    restrict: "E",
    scope: true,
    templateUrl: "template-button.html",
    link: function(scope, element, attrs) {
      return scope.click = function() {};
    }
  };
}).directive("crosetElementText", function($compile, $interval) {
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
    link: function(scope, element, attrs) {
      return console.log(element, scope, "スクエア");
    }
  };
});
