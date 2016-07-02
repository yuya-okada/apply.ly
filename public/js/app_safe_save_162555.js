var crosetModule;

crosetModule = angular.module("Croset", ["ui.router", "ngAria", "ngMaterial", "ngAnimate", "ngMessages", "ngMdIcons", "ngDragDrop", "mdColorPicker"]);

crosetModule.factory("getUUID", function() {
  return function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };
});

crosetModule.factory("GetDistance", function() {
  return function(p1, p2) {
    var leftD, topD;
    leftD = p1.left - p2.left;
    topD = p1.top - p2.top;
    return Math.sqrt(leftD * leftD + topD * topD);
  };
});

crosetModule.factory("IsInDiv", function() {
  return function(point, div) {
    var bottom, left, right, top;
    div = $(div);
    top = div.offset().top;
    left = div.offset().left;
    bottom = div.offset().top + div.height();
    right = div.offset().left + div.width();
    if (point.top >= top && point.left >= left && point.top <= bottom && point.left <= right) {
      return true;
    } else {
      return false;
    }
  };
});

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
}).value("ColorPallet", {
  mc: "#0F9D58",
  ac: "#E53935"
}).value("GetTextColor", function(bgRgb) {
  var blue, color, green, red;
  red = bgRgb.r;
  green = bgRgb.g;
  blue = bgRgb.b;
  color = 'black';
  if ((red * 0.299 + green * 0.587 + blue * 0.114) < 186) {
    color = 'white';
  }
  return color;
}).value("HexToRgb", function(hex) {
  var result;
  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  } else {
    return null;
  }
}).factory("GenerateElement", [
  "$compile", function($compile) {
    return function(e, scope, appendTo) {
      e = $compile(angular.element(e))(scope);
      if (appendTo) {
        return e.appendTo(appendTo);
      }
    };
  }
]);

crosetModule.config([
  "$stateProvider", "$urlRouterProvider", "$mdThemingProvider", function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.definePalette('myBlue', {
      '50': '526FFF',
      '100': '526FFF',
      '200': '526FFF',
      '300': '526FFF',
      '400': '526FFF',
      '500': '526FFF',
      '600': '526FFF',
      '700': '526FFF',
      '800': '526FFF',
      '900': '526FFF',
      'A100': '526FFF',
      'A200': '526FFF',
      'A400': '526FFF',
      'A700': '526FFF',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': void 0
    });
    $mdThemingProvider.definePalette('myOrange', {
      '50': '#FF5722',
      '100': '#FF5722',
      '200': '#FF5722',
      '300': '#FF5722',
      '400': '#FF5722',
      '500': '#FF5722',
      '600': '#FF5722',
      '700': '#FF5722',
      '800': '#FF5722',
      '900': '#FF5722',
      'A100': '#FF5722',
      'A200': '#FF5722',
      'A400': '#FF5722',
      'A700': '#FF5722',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      'contrastLightColors': void 0,
      'contrastDefaultColor': 'light'
    });
    $mdThemingProvider.theme('default').primaryPalette('myBlue', {
      "default": "500"
    }).accentPalette('myOrange', {
      'default': '500'
    });
    return $stateProvider.state("editor", {
      url: "/editor/:projectname",
      controller: "EditorController",
      templateUrl: "editor.html"
    }).state("editor.design", {
      url: "/design",
      views: {
        left: {
          templateUrl: "hierarchy.html"
        },
        right: {
          templateUrl: "properties.html"
        }
      }
    }).state("editor.program", {
      url: "/program",
      views: {
        right: {
          templateUrl: "program.html"
        }
      }
    });
  }
]);

crosetModule.controller("HeaderController", [
  "$scope", "$mdSidenav", "$injector", function($scope, $mdSidenav, $injector) {
    var ProjectData, ScreenElements, dataStore;
    $scope.toggleSideNav = function() {
      return $mdSidenav("side-menu").toggle().then(function() {});
    };
    dataStore = new Firebase("https://apply-backend.firebaseio.com/");
    ScreenElements = null;
    ProjectData = null;
    return $scope.run = function() {
      var elements, elementsToPush, key, value;
      if (ScreenElements == null) {
        ScreenElements = $injector.get("ScreenElements");
      }
      if (ProjectData == null) {
        ProjectData = $injector.get("ProjectData");
      }
      elements = ScreenElements.get();
      elementsToPush = {};
      for (key in elements) {
        value = elements[key];
        value.top = value.element.css("top");
        value.left = value.element.css("left");
        value.width = value.element.width();
        value.height = value.element.height();
        elementsToPush[key] = value;
      }
      return dataStore.child("projects").child(ProjectData.projectName).update({
        title: "test",
        html: encodeURIComponent(JSON.stringify(elementsToPush)),
        js: encodeURIComponent(window.build()),
        cards: encodeURIComponent(JSON.stringify($injector.get("ScreenCards").get()))
      });
    };
  }
]);

crosetModule.controller("SideMenuController", [
  "$scope", "$injector", "$state", "$mdSidenav", function($scope, $injector, $state, $mdSidenav) {
    $scope.toggleSideNav = function() {
      return $mdSidenav("side-menu").toggle().then(function() {});
    };
    $scope.changeMode = function() {
      var ProjectData;
      ProjectData = $injector.get("ProjectData");
      return $scope.projectname = ProjectData.projectName;
    };
    $scope.navigateTo = function(sref) {
      return $state.go(sref);
    };
    return $scope.sideLinks = (function() {
      var child, i, item, j, len, len1, list, ref, result;
      list = [
        {
          icon: "home",
          text: "ホーム"
        }, {
          icon: "dashboard",
          text: "ダッシュボード",
          children: [
            {
              icon: "edit",
              text: "デザイン",
              sref: "^.design"
            }, {
              icon: "code",
              text: "プログラム",
              sref: "^.program"
            }
          ]
        }
      ];
      result = [];
      for (i = 0, len = list.length; i < len; i++) {
        item = list[i];
        result.push(item);
        if (item.children) {
          ref = item.children;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            child = ref[j];
            child.isChild = true;
            result.push(child);
          }
        }
      }
      return result;
    })();
  }
]);
