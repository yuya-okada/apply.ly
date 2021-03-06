var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.value("GeneralComponents", {
  "exp": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp"
        }
      }
    ],
    compile: "${exp}"
  },
  "text": {
    type: "function",
    appearance: [
      {
        type: "textbox",
        options: {
          defaultValue: "文字",
          result: "text"
        }
      }
    ],
    compile: "${text}"
  },
  "equal": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp1"
        }
      }, {
        type: "text",
        options: {
          text: "="
        }
      }, {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp2"
        }
      }
    ],
    compile: "(${exp1} == ${exp2})"
  },
  "plus": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp1"
        }
      }, {
        type: "text",
        options: {
          text: "+"
        }
      }, {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp2"
        }
      }
    ],
    compile: "(${exp1} + ${exp2})"
  },
  "minus": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp1"
        }
      }, {
        type: "text",
        options: {
          text: "-"
        }
      }, {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp2"
        }
      }
    ],
    compile: "(${exp1} - ${exp2})"
  },
  "times": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp1"
        }
      }, {
        type: "text",
        options: {
          text: "✕"
        }
      }, {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp2"
        }
      }
    ],
    compile: "(${exp1} * ${exp2})"
  },
  "devide": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp1"
        }
      }, {
        type: "text",
        options: {
          text: "÷"
        }
      }, {
        type: "expbox",
        options: {
          defaultValue: "式",
          result: "exp2"
        }
      }
    ],
    compile: "(${exp1} / ${exp2})"
  },
  "メッセージを表示": {
    type: "function",
    appearance: [
      {
        type: "text",
        options: {
          text: "メッセージを表示"
        }
      }, {
        type: "textbox",
        options: {
          defaultValue: "メッセージ",
          result: "message"
        }
      }
    ],
    compile: "alert(${message})"
  },
  "if": {
    type: "mat",
    appearance: [
      {
        type: "text",
        options: {
          text: "もし"
        }
      }, {
        type: "expbox",
        options: {
          defaultValue: "条件",
          result: "exp"
        }
      }, {
        type: "text",
        options: {
          text: "なら"
        }
      }
    ],
    compile: "if(${exp}) { ${mat} }"
  },
  "interval": {
    type: "mat",
    appearance: [
      {
        type: "expbox",
        options: {
          defaultValue: "1",
          result: "exp"
        }
      }, {
        type: "text",
        options: {
          text: "秒ごとに繰り返す"
        }
      }
    ],
    compile: "$interval(function() { ${mat} }, ${exp} * 1000)"
  }
}).value("ElementComponents", {
  "button": {
    "click": {
      type: "mat",
      appearance: [
        {
          type: "text",
          options: {
            text: "がクリックされたとき、"
          }
        }
      ],
      compile: "${jquery}.click(function() { $timeout(function() { ${mat} });  })"
    },
    "text": {
      type: "property",
      text: "のテキスト",
      compile: "${scope}.options.text"
    }
  }
}).factory("ScreenCards", function() {
  return {
    get: function() {
      return this.list;
    },
    list: []
  };
}).factory("GetCardTemplate", [
  "$http", function($http) {
    var fncs, template;
    fncs = [];
    template = null;
    $http({
      method: "GET",
      url: "croset-component-in-code.html"
    }).success(function(data, status, headers, config) {
      var fnc, j, len;
      template = data;
      for (j = 0, len = fncs.length; j < len; j++) {
        fnc = fncs[j];
        fnc(template);
      }
      return fncs = null;
    }).error(function(data, status, headers, config) {});
    return function(fnc) {
      if (template) {
        return fnc(template);
      } else {
        return fncs.push(fnc);
      }
    };
  }
]).service("Build", [
  "GeneralComponents", "ElementComponents", "ScreenElements", function(GeneralComponents, ElementComponents, ScreenElements) {
    window.build = (function(_this) {
      return function() {
        return _this.compile(_this.parse());
      };
    })(this);
    this.parse = function() {
      var program;
      program = [];
      $("#program-code").children().each(function(i, e) {
        var childScope;
        childScope = angular.element(e).scope();
        console.log(e);
        return program.push(childScope.parse());
      });
      console.log(program);
      return program;
    };
    this.compile = function(source) {
      var block, compileBlock, compileMat, compiled, j, len;
      compileBlock = function(block) {
        var blockData, compileFunction, compiledBlock, elementData;
        compileFunction = function() {
          var compiledFunction, optionName, optionValue, ref;
          if (!block.options) {
            return "";
          }
          compiledFunction = blockData.compile;
          ref = block.options;
          for (optionName in ref) {
            optionValue = ref[optionName];
            console.log(optionValue);
            if (optionValue.blockId) {
              optionValue = compileBlock(optionValue);
            }
            compiledFunction = compiledFunction.replace("${" + optionName + "}", optionValue);
          }
          if (block.elementId) {
            compiledFunction = compiledFunction.replace("${jquery}", "$('#" + block.elementId + "')");
            compiledFunction = compiledFunction.replace("${uuid}", "'" + block.elementId + "'");
          }
          return compiledFunction;
        };
        compiledBlock = "";
        if (block.elementId) {
          elementData = ScreenElements.get()[block.elementId];
          blockData = ElementComponents[elementData.type][block.blockId];
        } else {
          blockData = GeneralComponents[block.blockId];
        }
        switch (blockData.type) {
          case "function":
            compiledBlock = compileFunction();
            break;
          case "mat":
            compiledBlock = compileFunction();
            compiledBlock = compiledBlock.replace("${mat}", "\n" + compileMat(block.matContents) + "\n");
            break;
          case "property":
            compiledBlock = blockData.compile;
            if (block.elementId) {
              compiledBlock = compiledBlock.replace("${jquery}", "$('#" + block.elementId + "')");
              compiledBlock = compiledBlock.replace("${scope}", "angular.element('#" + block.elementId + "').scope()");
            }
            if (block.propertyChild) {
              compiledBlock += " = " + compileBlock(block.propertyChild);
            }
        }
        if (block.child) {
          compiledBlock += ";\n" + compileBlock(block.child);
        }
        return compiledBlock;
      };
      compileMat = function(mat) {
        var block, compiledMat, j, len;
        if (!mat) {
          return "";
        }
        compiledMat = "";
        for (j = 0, len = mat.length; j < len; j++) {
          block = mat[j];
          compiledMat += compileBlock(block);
        }
        return compiledMat;
      };
      compiled = "";
      for (j = 0, len = source.length; j < len; j++) {
        block = source[j];
        compiled += compileBlock(block);
      }
      console.log(compiled);
      return compiled;
    };
  }
]).controller("ComponentListController", [
  "$scope", "GeneralComponents", "ScreenElements", "SelectedElementUUID", "ElementComponents", "ScreenCards", function($scope, GeneralComponents, ScreenElements, SelectedElementUUID, ElementComponents, ScreenCards) {
    $scope.generalComponents = GeneralComponents;
    return $scope.$watch(function() {
      return SelectedElementUUID.get();
    }, function(newVal, oldVal) {
      var ref;
      return $scope.elementComponents = ElementComponents[(ref = ScreenElements.get()[newVal]) != null ? ref.type : void 0];
    });
  }
]).directive("addComponentButton", [
  "ScreenCards", "SelectedElementUUID", function(ScreenCards, SelectedElementUUID) {
    return {
      restrict: "A",
      link: function(scope) {
        scope.addComponent = function(id) {
          return ScreenCards.list.push({
            offset: {
              top: 200,
              left: 200
            },
            blockId: id
          });
        };
        return scope.addElementComponent = function(id) {
          return ScreenCards.list.push({
            offset: {
              top: 200,
              left: 200
            },
            elementId: SelectedElementUUID.get(),
            blockId: id
          });
        };
      }
    };
  }
]).controller("CodeController", [
  "$scope", "$element", "$compile", "ScreenCards", "ProjectData", "GenerateElement", function($scope, $element, $compile, ScreenCards, ProjectData, GenerateElement) {
    var ref;
    if ((ref = ProjectData.projectData) != null ? ref.cards : void 0) {
      ScreenCards.list = JSON.parse(decodeURIComponent(ProjectData.projectData.cards));
    }
    console.log(ScreenCards.list);
    window.a = function() {
      return ScreenCards;
    };
    return $scope.$watch(function() {
      return ScreenCards.get();
    }, function(newVal, oldVal) {
      var card, j, len, ref1, results, scope;
      $scope.cards = ScreenCards.get();
      $($element).empty();
      ref1 = ScreenCards.get();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        card = ref1[j];
        scope = $scope.$new(true);
        scope.card = card;
        results.push(GenerateElement("<croset-component-in-code>", scope, $element));
      }
      return results;
    }, true);
  }
]).directive("crosetComponentInputMatCard", [
  function() {
    return {
      restrict: "C",
      link: function(scope, element, attrs) {
        scope.cardData = scope.card;
        return scope.card = null;
      }
    };
  }
]).directive("crosetComponentPropertyModified", [
  function() {
    return {
      priority: 700,
      scope: true,
      link: function(scope, element, attrs) {
        if (!scope.card) {
          return;
        } else if (!scope.card.propertyChild) {
          element.empty();
        }
        scope.cardData = scope.card;
        return scope.card = scope.cardData.propertyChild;
      }
    };
  }
]).directive("crosetComponentInCode", [
  "$compile", "ScreenElements", "GeneralComponents", "GetCardTemplate", "ElementComponents", "GetDistance", "IsInDiv", "ScreenCards", "Build", "GenerateElement", function($compile, ScreenElements, GeneralComponents, GetCardTemplate, ElementComponents, GetDistance, IsInDiv, ScreenCards, Build, GenerateElement) {
    return {
      restrict: "E",
      scope: true,
      link: function(scope, element, attrs) {
        if (scope.card.elementId) {
          scope.data = ElementComponents[scope.card.type][scope.card.blockId];
        } else {
          scope.data = GeneralComponents[scope.card.blockId];
        }
        element.on("contextmenu", function(e) {
          return scope.$apply(function() {
            element.remove();
            return e.stopPropagation();
          });
        });
        return GetCardTemplate(function(template) {
          var bodyBottomLeftPoints, bottomBorder, component, inputTopLeftPoints, modifyIcon, propertyTopRightPoints, targetInput;
          element.empty();
          GenerateElement(template, scope, element);
          bodyBottomLeftPoints = [];
          propertyTopRightPoints = [];
          inputTopLeftPoints = [];
          bottomBorder = null;
          modifyIcon = null;
          targetInput = null;
          component = $(element).children("croset-component");
          return $(component).draggable({
            appendTo: "body",
            start: function(ev, ui) {
              var o, parent;
              parent = element.parent();
              o = component.offset();
              console.log("before", o);
              element.appendTo("body");
              component.offset({
                top: 0,
                left: 0
              });
              console.log("after", component.offset(), o);
              if (parent[0].tagName === "CROSET-COMPONENT-INPUT") {
                parent.scope().inputDragStart();
              }
              return $(".croset-component-body").each(function(i, e) {
                var icon;
                if (!$(e).closest(element)[0]) {
                  bodyBottomLeftPoints.push({
                    left: $(e).offset().left,
                    top: $(e).offset().top + $(e).height(),
                    element: $(e)
                  });
                  if (e.tagName === "CROSET-COMPONENT-PROPERTY") {
                    icon = $(e).children("croset-component-property-modify-icon");
                    propertyTopRightPoints.push({
                      left: icon.offset().left + icon.width(),
                      top: icon.offset().top,
                      element: $(e)
                    });
                  }
                  return $(e).children("croset-component-input").each(function(i, input) {
                    return inputTopLeftPoints.push({
                      left: $(input).offset().left,
                      top: $(input).offset().top,
                      element: $(input)
                    });
                  });
                }
              });
            },
            drag: function(ev, ui) {
              var bodyBottomLeftPoint, inputTopLeftPoint, j, k, l, len, len1, len2, pos, propertyTopRightPoint;
              pos = component.offset();
              if (bottomBorder != null) {
                bottomBorder.removeClass("bottom-border");
              }
              bottomBorder = null;
              for (j = 0, len = bodyBottomLeftPoints.length; j < len; j++) {
                bodyBottomLeftPoint = bodyBottomLeftPoints[j];
                if (20 > GetDistance(pos, bodyBottomLeftPoint)) {
                  bodyBottomLeftPoint.element.addClass("bottom-border");
                  bottomBorder = bodyBottomLeftPoint.element;
                }
              }
              if (modifyIcon != null) {
                modifyIcon.removeClass("selected-modify-icon");
              }
              modifyIcon = null;
              for (k = 0, len1 = propertyTopRightPoints.length; k < len1; k++) {
                propertyTopRightPoint = propertyTopRightPoints[k];
                if (20 > GetDistance(pos, propertyTopRightPoint)) {
                  propertyTopRightPoint.element.addClass("selected-modify-icon");
                  modifyIcon = propertyTopRightPoint.element;
                }
              }
              if (targetInput != null) {
                targetInput.removeClass("target-input");
              }
              targetInput = null;
              for (l = 0, len2 = inputTopLeftPoints.length; l < len2; l++) {
                inputTopLeftPoint = inputTopLeftPoints[l];
                if (20 > GetDistance(pos, inputTopLeftPoint)) {
                  targetInput = inputTopLeftPoint.element;
                }
              }
              return targetInput != null ? targetInput.addClass("target-input") : void 0;
            },
            stop: function(ev, ui) {
              var mat, mats, offset;
              if (bottomBorder) {
                element.appendTo(bottomBorder.closest("croset-component"));
                component.css({
                  top: 0,
                  left: 0
                });
              } else if (modifyIcon) {
                element.appendTo(modifyIcon.children("croset-component-property-modified"));
                component.css({
                  top: 0,
                  left: 0
                });
              } else if (targetInput) {
                targetInput.empty();
                element.appendTo(targetInput);
                component.css({
                  top: 0,
                  left: 0
                });
                targetInput.removeClass("target-input");
              } else {
                offset = component.offset();
                mats = $(".mat-wrapper");
                mats = mats.filter(function(i) {
                  return IsInDiv(component.offset(), this);
                });
                mat = mats.last();
                element.appendTo(mat.children(".croset-mat"));
                component.offset(offset);
              }
              console.log(Build);
              return ScreenCards.list = Build.parse();
            }
          });
        });
      }
    };
  }
]).directive("crosetElementComponentInList", [
  "ScreenElements", "SelectedElementUUID", function(ScreenElements, SelectedElementUUID) {
    return {
      link: function(scope) {
        return scope.elementData = ScreenElements.get()[SelectedElementUUID.get()];
      }
    };
  }
]).directive("crosetComponent", [
  "$compile", "GetDistance", "GetCardTemplate", function($compile, GetDistance, GetCardTemplate) {
    return {
      restrict: "E",
      scope: false,
      link: function(scope, element, attrs) {
        var body, child, childData, childScope, ref;
        body = $("<croset-component-" + scope.data.type + ">");
        body = $compile(body)(scope);
        body.addClass("croset-component-body").appendTo(element);
        childData = (ref = scope.$parent.card) != null ? ref.child : void 0;
        if (childData) {
          child = $("<croset-component-in-code>");
          childScope = scope.$new();
          childScope.card = childData;
          child = $compile(child)(childScope);
          element.append(child);
        }
        return scope.parse = function() {
          var data, matChildren, propertyChild;
          data = {
            offset: element.position(),
            blockId: scope.card.blockId,
            elementId: scope.card.elementId,
            options: (function() {
              var inputs, options;
              options = {};
              inputs = $(element).children(".croset-component-body").children("croset-component-input");
              if (!inputs[0]) {
                inputs = $(element).children(".croset-component-body").children(".croset-mat-flex").children("croset-component-input");
              }
              inputs.each(function(i, e) {
                var inputCard, inputScope, key, ref1;
                inputCard = $(e).children("croset-component-in-code");
                inputScope = $(e).scope();
                key = (ref1 = inputScope.input.options) != null ? ref1.result : void 0;
                if (!inputCard[0]) {
                  if (key) {
                    return options[key] = inputScope.value;
                  }
                } else {
                  return options[key] = inputCard.scope().parse();
                }
              });
              return options;
            })()
          };
          childScope = angular.element($(element).children("croset-component-in-code")).scope();
          if (childScope) {
            data.child = childScope.parse();
          }
          matChildren = $(element).children("croset-component-mat").children(".mat-wrapper").children(".croset-component-input-mat-card").children("croset-component-in-code");
          if (matChildren[0]) {
            data.matContents = [];
            matChildren.each(function(i, e) {
              var matChildScope;
              matChildScope = angular.element(e).scope();
              return data.matContents.push(matChildScope.parse());
            });
          }
          propertyChild = $(element).children("croset-component-property").children("croset-component-property-modified").children("croset-component-in-code");
          if (propertyChild[0]) {
            data.propertyChild = angular.element(propertyChild).scope().parse();
          }
          return data;
        };
      }
    };
  }
]).directive("crosetComponentFunction", [
  function() {
    return {
      restrict: "E",
      scope: true,
      templateUrl: "component-function.html",
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetComponentMat", [
  function() {
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-mat.html",
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetComponentProperty", [
  "$compile", function($compile) {
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-property.html",
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetComponentLiteral", [
  function() {
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-literal.html",
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetComponentInput", [
  "$compile", function($compile) {
    return {
      restrict: "E",
      scope: true,
      link: function(scope, element, attrs) {
        var cardData, cardScope, e, initialValue, ref, ref1, ref2, ref3, ref4, ref5;
        element.empty();
        cardData = (ref = scope.$parent.card) != null ? (ref1 = ref.options) != null ? ref1[(ref2 = scope.input) != null ? (ref3 = ref2.options) != null ? ref3.result : void 0 : void 0] : void 0 : void 0;
        if (!(cardData != null ? cardData.blockId : void 0)) {
          e = angular.element("<croset-component-input-" + scope.input.type + ">");
          e = $compile(e)(scope);
          e.appendTo(element);
        } else {
          e = $("<croset-component-in-code>");
          cardScope = scope.$new();
          cardScope.card = cardData;
          e = $compile(e)(cardScope);
          element.append(e);
        }
        initialValue = (ref4 = scope.card) != null ? (ref5 = ref4.options) != null ? ref5[scope.input.options.result] : void 0 : void 0;
        scope.inputValue = initialValue || scope.input.options.defaultValue;
        scope.value = "";
        return scope.inputDragStart = function() {
          if (scope.input.type === "mat") {
            return;
          }
          e = angular.element("<croset-component-input-" + scope.input.type + ">");
          e = $compile(e)(scope);
          return e.appendTo(element);
        };
      }
    };
  }
]).directive("crosetComponentInputText", [
  function() {
    return {
      restrict: "E",
      scope: true,
      templateUrl: "component-input-text.html",
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetComponentInputTextbox", [
  function() {
    var calculateWidth;
    calculateWidth = function(stringWidth) {
      var minWidth, padding;
      minWidth = 50;
      padding = 10;
      if (stringWidth + padding < minWidth) {
        return minWidth;
      } else {
        return stringWidth + padding;
      }
    };
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-input-textbox.html",
      link: function(scope, element, attrs) {
        scope.value = "'" + scope.inputValue + "'";
        return scope.$watch("inputValue", function(newVal, oldVal) {
          var width;
          width = element.find("span")[0].offsetWidth;
          element.find("input").css("width", calculateWidth(width));
          scope.value = "'" + newVal + "'";
        });
      }
    };
  }
]).directive("crosetComponentInputExpbox", [
  function() {
    var calculateWidth;
    calculateWidth = function(stringWidth) {
      var minWidth, padding;
      minWidth = 50;
      padding = 10;
      if (stringWidth + padding < minWidth) {
        return minWidth;
      } else {
        return stringWidth + padding;
      }
    };
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-input-expbox.html",
      link: function(scope, element, attrs) {
        scope.value = scope.inputValue;
        return scope.$watch("inputValue", function(newVal, oldVal) {
          var width;
          width = element.find("span")[0].offsetWidth;
          element.find("input").css("width", calculateWidth(width));
          scope.value = scope.inputValue;
        });
      }
    };
  }
]).directive("matWrapper", [
  function() {
    return {
      restrict: "C",
      scope: true,
      link: function(scope, element, attrs) {}
    };
  }
]);
