var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.value("GeneralComponents", {
  "onload": {
    type: "mat",
    appearance: [
      {
        type: "text",
        options: {
          text: "この画面は始まった時"
        }
      }, {
        type: "mat",
        result: "mat"
      }
    ],
    compile: "$events.onload(function({ ${mat} })) "
  },
  "intentTo": {
    type: "function",
    appearance: [
      {
        type: "text",
        options: {
          text: "画面を移動"
        }
      }, {
        type: "screen",
        defaultValue: "",
        result: "screen"
      }
    ],
    compile: "$state.go('screen' + ${screen})"
  },
  "variable": {
    type: "variable",
    compile: "${val}"
  },
  "hensu": {
    type: "property",
    text: "変数",
    compile: "val"
  },
  "exp": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        defaultValue: "式",
        result: "exp"
      }
    ],
    compile: "${exp}"
  },
  "text": {
    type: "function",
    appearance: [
      {
        type: "textbox",
        defaultValue: "文字",
        result: "text"
      }
    ],
    compile: "${text}"
  },
  "equal": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        defaultValue: "式",
        result: "exp1"
      }, {
        type: "text",
        options: {
          text: "="
        }
      }, {
        type: "expbox",
        defaultValue: "式",
        result: "exp2"
      }
    ],
    compile: "(${exp1} == ${exp2})"
  },
  "plus": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        defaultValue: "式",
        result: "exp1"
      }, {
        type: "text",
        options: {
          text: "+"
        }
      }, {
        type: "expbox",
        defaultValue: "式",
        result: "exp2"
      }
    ],
    compile: "(${exp1} + ${exp2})"
  },
  "minus": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        defaultValue: "式",
        result: "exp1"
      }, {
        type: "text",
        options: {
          text: "-"
        }
      }, {
        type: "expbox",
        defaultValue: "式",
        result: "exp2"
      }
    ],
    compile: "(${exp1} - ${exp2})"
  },
  "times": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        defaultValue: "式",
        result: "exp1"
      }, {
        type: "text",
        options: {
          text: "✕"
        }
      }, {
        type: "expbox",
        defaultValue: "式",
        result: "exp2"
      }
    ],
    compile: "(${exp1} * ${exp2})"
  },
  "devide": {
    type: "function",
    appearance: [
      {
        type: "expbox",
        defaultValue: "式",
        result: "exp1"
      }, {
        type: "text",
        options: {
          text: "÷"
        }
      }, {
        type: "expbox",
        defaultValue: "式",
        result: "exp2"
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
        defaultValue: "メッセージ",
        result: "message"
      }
    ],
    compile: "alert(${message})"
  },
  "toint": {
    type: "function",
    appearance: [
      {
        type: "text",
        options: {
          text: "数字に変換"
        }
      }, {
        type: "textbox",
        defaultValue: "条件",
        result: "text"
      }
    ],
    compile: "parseInt(${text})"
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
        defaultValue: "条件",
        result: "exp"
      }, {
        type: "text",
        options: {
          text: "なら"
        }
      }, {
        type: "mat",
        result: "mat"
      }
    ],
    compile: "if(${exp}) { ${mat} }"
  },
  "ifelse": {
    type: "mat",
    appearance: [
      {
        type: "text",
        options: {
          text: "もし"
        }
      }, {
        type: "expbox",
        defaultValue: "条件",
        result: "exp"
      }, {
        type: "mat",
        result: "mat"
      }, {
        type: "text",
        options: {
          text: "でなければ"
        }
      }, {
        type: "mat",
        result: "mat2"
      }
    ],
    compile: "if(${exp}) { ${mat} } else { ${mat2} }"
  },
  "interval": {
    type: "mat",
    appearance: [
      {
        type: "expbox",
        defaultValue: "1",
        result: "exp"
      }, {
        type: "text",
        options: {
          text: "秒ごとに繰り返す"
        }
      }, {
        type: "mat",
        result: "mat"
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
        }, {
          type: "mat",
          result: "mat"
        }
      ],
      compile: "${options}.click = function() { $timeout(function() { ${mat} });  }"
    },
    "text": {
      type: "property",
      text: "のテキスト",
      compile: "${options}.text"
    }
  },
  "text": {
    "text": {
      type: "property",
      text: "のテキスト",
      compile: "${options}.text"
    }
  },
  "textbox": {
    "text": {
      type: "property",
      text: "のテキスト",
      compile: "${options}.value"
    }
  }
}).service("ScreenCards", [
  "$interval", function($interval) {
    this.get = function() {
      return this.list;
    };
    this.set = function(li) {
      return this.list = li;
    };
    this.getParsed = function() {
      return this.parsedCards;
    };
    this.list = [];
    this.parsedCards = [];
  }
]).factory("GetCardTemplate", [
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
]).factory("AddDraggableEvent", [
  "IsInDiv", "GetDistance", "ServiceConfig", "Build", "ScreenCards", "CurrentScreenData", "SelectedElementUUID", "GenerateElement", function(IsInDiv, GetDistance, ServiceConfig, Build, ScreenCards, CurrentScreenData, SelectedElementUUID, GenerateElement) {
    return function(scope, element, helperId) {
      var bodyBottomLeftPoints, bottomBorder, component, helper, inputTopLeftPoints, isDragged, modifyIcon, programCode, propertyTopRightPoints, targetInput;
      bodyBottomLeftPoints = [];
      propertyTopRightPoints = [];
      inputTopLeftPoints = [];
      bottomBorder = null;
      modifyIcon = null;
      targetInput = null;
      isDragged = false;
      component = $(element).children("croset-component");
      helper = "origin";
      if (helperId) {
        helper = "clone";
      }
      programCode = $("#program-code");
      return $(component).draggable({
        appendTo: "body",
        cancel: ".croset-mat-resizer, input",
        helper: helper,
        start: function(ev, ui) {
          bodyBottomLeftPoints = [];
          propertyTopRightPoints = [];
          inputTopLeftPoints = [];
          isDragged = false;
          console.log(component, "イベント");
          return $(".croset-component-body").each(function(i, e) {
            var icon, inputs, matInputs;
            if (!$(e).closest(element)[0]) {
              bodyBottomLeftPoints.push({
                left: $(e).offset().left,
                top: $(e).offset().top + $(e).height(),
                element: $(e)
              });
              if (e.tagName === "CROSET-COMPONENT-PROPERTY" || e.tagName === "CROSET-COMPONENT-VARIABLE") {
                icon = $(e).children("croset-component-property-modify-icon");
                propertyTopRightPoints.push({
                  left: icon.offset().left + icon.width(),
                  top: icon.offset().top,
                  element: $(e)
                });
              }
              if (e.tagName === "CROSET-COMPONENT-MAT") {
                e = $(e).children()[0];
              }
              inputs = $(e).children("croset-component-input");
              matInputs = $(e).children(".croset-mat-flex").children("croset-component-input");
              return inputs.add(matInputs).each(function(i, input) {
                if (!$(input).children("croset-component-input-text")[0]) {
                  return inputTopLeftPoints.push({
                    left: $(input).offset().left,
                    top: $(input).offset().top,
                    element: $(input)
                  });
                }
              });
            }
          });
        },
        drag: function(ev, ui) {
          var bodyBottomLeftPoint, inputTopLeftPoint, j, k, l, len, len1, len2, pos, propertyTopRightPoint, snapDistance;
          isDragged = true;
          snapDistance = 20 * ServiceConfig.get().componentScale;
          pos = component.offset();
          if (bottomBorder != null) {
            bottomBorder.removeClass("bottom-border");
          }
          bottomBorder = null;
          for (j = 0, len = bodyBottomLeftPoints.length; j < len; j++) {
            bodyBottomLeftPoint = bodyBottomLeftPoints[j];
            if (snapDistance > GetDistance(pos, bodyBottomLeftPoint)) {
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
            if (snapDistance > GetDistance(pos, propertyTopRightPoint)) {
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
            if (snapDistance > GetDistance(pos, inputTopLeftPoint)) {
              targetInput = inputTopLeftPoint.element;
            }
          }
          return targetInput != null ? targetInput.addClass("target-input") : void 0;
        },
        stop: function(ev, ui) {
          var card, firstChild, mat, mats, newScope, offset;
          if (helper === "clone") {
            card = {
              offset: {
                top: $(ui.helper).offset().top - $("#program-code").offset().top,
                left: $(ui.helper).offset().left - $("#program-code").offset().left
              },
              blockId: helperId
            };
            if (scope.elementData) {
              card.elementId = SelectedElementUUID.get();
              card.type = scope.elementData.type;
            }
            newScope = scope.$new(true);
            newScope.card = card;
            GenerateElement("<croset-component-in-code>", newScope, $("#program-code"));
          }
          if (isDragged) {
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
              firstChild = targetInput.children()[0];
              element.prependTo(targetInput);
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
            ScreenCards.list = Build.parse();
            scope.$apply();
            return component.css({
              width: "",
              height: ""
            });
          }
        }
      });
    };
  }
]).service("Build", [
  "GeneralComponents", "ElementComponents", "CurrentScreenData", "ScreenCards", function(GeneralComponents, ElementComponents, CurrentScreenData, ScreenCards) {
    this.build = function() {
      return this.compile(this.parse());
    };
    this.parse = function() {
      var program;
      program = [];
      $("#program-code").children().each(function(i, e) {
        var childScope;
        childScope = angular.element(e).scope();
        return program.push(childScope.parse());
      });
      console.log(program);
      ScreenCards.parsedCards = program;
      return program;
    };
    this.compile = function(source) {
      var block, compileBlock, compileMat, compiled, j, len;
      compileBlock = function(block) {
        var blockData, compileFunction, compiledBlock, elementData, matContent, matName, ref;
        compileFunction = function() {
          var cardOptionValue, compiledFunction, optionName, optionValue, ref, ref1;
          compiledFunction = blockData.compile;
          ref = block.options;
          for (optionName in ref) {
            optionValue = ref[optionName];
            cardOptionValue = (ref1 = block.cardOptions) != null ? ref1[optionName] : void 0;
            if (cardOptionValue) {
              optionValue = compileBlock(cardOptionValue);
            }
            compiledFunction = compiledFunction.replace("${" + optionName + "}", optionValue);
          }
          if (block.elementId) {
            compiledFunction = compiledFunction.replace("${jquery}", "$('#" + block.elementId + "')");
            compiledFunction = compiledFunction.replace("${options}", "$scope.list['" + block.elementId + "'].options");
          }
          return compiledFunction;
        };
        compiledBlock = "";
        if (block.elementId) {
          elementData = CurrentScreenData.elementsManager.get()[block.elementId];
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
            ref = block.matContents;
            for (matName in ref) {
              matContent = ref[matName];
              compiledBlock = compiledBlock.replace("${" + matName + "}", "\n" + compileMat(matContent) + "\n");
            }
            break;
          case "property":
            compiledBlock = blockData.compile;
            if (block.elementId) {
              compiledBlock = compiledBlock.replace("${jquery}", "$('#" + block.elementId + "')");
              compiledBlock = compiledBlock.replace("${options}", "$scope.list['" + block.elementId + "'].options");
            }
            if (block.propertyChild) {
              compiledBlock += " = " + (compileBlock(block.propertyChild));
            }
            break;
          case "variable":
            compiledBlock = "variables['" + block.variableName + "']";
            if (block.propertyChild) {
              compiledBlock += " = " + (compileBlock(block.propertyChild));
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
          compiledMat += ";\n";
        }
        return compiledMat;
      };
      compiled = "";
      for (j = 0, len = source.length; j < len; j++) {
        block = source[j];
        compiled += compileBlock(block);
        compiled += ";\n";
      }
      console.log(compiled);
      return compiled;
    };
  }
]).controller("ComponentListController", [
  "$scope", "GeneralComponents", "CurrentScreenData", "SelectedElementUUID", "ElementComponents", "ScreenCards", function($scope, GeneralComponents, CurrentScreenData, SelectedElementUUID, ElementComponents, ScreenCards) {
    var screenElementsManager;
    $scope.generalComponents = GeneralComponents;
    screenElementsManager = CurrentScreenData.getElementsManager();
    return $scope.$watch(function() {
      return SelectedElementUUID.get();
    }, function(newVal, oldVal) {
      var ref;
      return $scope.elementComponents = ElementComponents[(ref = screenElementsManager.get()[newVal]) != null ? ref.type : void 0];
    });
  }
]).directive("addComponentButton", [
  "ScreenCards", "SelectedElementUUID", "CurrentScreenData", "AddDraggableEvent", function(ScreenCards, SelectedElementUUID, CurrentScreenData, AddDraggableEvent) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        AddDraggableEvent(scope, element, scope.componentId);
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
            blockId: id,
            type: CurrentScreenData.elementsManager.get()[SelectedElementUUID.get()].type
          });
        };
      }
    };
  }
]).controller("CodeController", [
  "$scope", "$timeout", "ProjectData", "CurrentScreenData", "SelectedElementUUID", function($scope, $timeout, ProjectData, CurrentScreenData, SelectedElementUUID) {
    var blocklyArea, blocklyDiv, cards, element, elementBlock, elementBlocks, id, j, len, onResize, onScreenChanged, ref, ref1, ref2, ref3, xml;
    onScreenChanged = function() {
      var id, options, ref, screen;
      options = [];
      ref = ProjectData.screens;
      for (id in ref) {
        screen = ref[id];
        options.push([screen.name, id]);
      }
      CrosetBlock.intentBlock.args0[0].options = options;
      Blockly.defineBlocksWithJsonArray([CrosetBlock.intentBlock]);
      return CrosetBlock.intentBlockGenerator();
    };
    ProjectData.setScreenCallback(function() {
      var block, blocks, dom, id, j, len, results;
      onScreenChanged();
      dom = Blockly.Xml.workspaceToDom(CurrentScreenData.workspace);
      CurrentScreenData.workspace.clear();
      Blockly.Xml.domToWorkspace(dom, CurrentScreenData.workspace);
      blocks = CurrentScreenData.workspace.getAllBlocks();
      results = [];
      for (j = 0, len = blocks.length; j < len; j++) {
        block = blocks[j];
        if (block.type === "intent") {
          id = block.getFieldValue("ID");
          console.log(id, Object.keys(ProjectData.screens)[0]);
          if (!ProjectData.screens[id]) {
            results.push(block.setFieldValue(Object.keys(ProjectData.screens)[0], "ID"));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    onScreenChanged();
    blocklyDiv = document.getElementById("program-code");
    CurrentScreenData.workspace = Blockly.inject(blocklyDiv, {
      toolbox: document.getElementById('toolbox'),
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      trashcan: false,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });
    CurrentScreenData.workspace.variableList = ProjectData.variables;
    ref1 = (ref = CurrentScreenData.getElementsManager()) != null ? ref.get() : void 0;
    for (id in ref1) {
      element = ref1[id];
      elementBlocks = angular.copy(CrosetBlock.elementBlocks[element.type]);
      if (elementBlocks) {
        for (j = 0, len = elementBlocks.length; j < len; j++) {
          elementBlock = elementBlocks[j];
          elementBlock.type = elementBlock.type.replace("#id", id);
          elementBlock.message0 = elementBlock.message0.replace("#name", element.name);
          Blockly.defineBlocksWithJsonArray([elementBlock]);
        }
        CrosetBlock.setGenerators(id, element.type);
      }
    }
    cards = (ref2 = ProjectData.screens) != null ? (ref3 = ref2[CurrentScreenData.id]) != null ? ref3.cards : void 0 : void 0;
    if (cards && cards[0]) {
      xml = Blockly.Xml.textToDom(cards);
      Blockly.Xml.domToWorkspace(xml, CurrentScreenData.workspace);
    }
    CurrentScreenData.workspace.registerToolboxCategoryCallback('ELEMENT', function(workspace) {
      var block, blockText, elementsManager, k, len1, ref4, ref5, selectedElement, type, xmlList;
      if (SelectedElementUUID.get()) {
        elementsManager = CurrentScreenData.getElementsManager();
        selectedElement = (ref4 = elementsManager.get()) != null ? ref4[SelectedElementUUID.get()] : void 0;
        xmlList = [];
        ref5 = CrosetBlock.elementBlocks[selectedElement.type];
        for (k = 0, len1 = ref5.length; k < len1; k++) {
          elementBlock = ref5[k];
          type = elementBlock.type.replace("#id", SelectedElementUUID.get());
          blockText = '<xml>' + '<block type="' + type + '">　</block>' + '</xml>';
          block = Blockly.Xml.textToDom(blockText).firstChild;
          xmlList.push(block);
        }
        return xmlList;
      }
    });
    blocklyArea = $("#program-zone");
    onResize = function(e) {
      blocklyDiv.style.left = blocklyArea.offset().left + 'px';
      blocklyDiv.style.top = blocklyArea.offset().right + 'px';
      blocklyDiv.style.width = blocklyArea.width() + 'px';
      blocklyDiv.style.height = blocklyArea.height() + 'px';
      console.log(blocklyArea.width(), blocklyArea.height());
      return Blockly.svgResize(CurrentScreenData.workspace);
    };
    window.addEventListener('resize', onResize, false);
    onResize();
    return $timeout(onResize, 1000);
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
  "$compile", "CurrentScreenData", "GeneralComponents", "GetCardTemplate", "ElementComponents", "ScreenCards", "Build", "GenerateElement", "AddDraggableEvent", function($compile, CurrentScreenData, GeneralComponents, GetCardTemplate, ElementComponents, ScreenCards, Build, GenerateElement, AddDraggableEvent) {
    return {
      restrict: "E",
      scope: true,
      link: function(scope, element, attrs) {
        var screenElementsManager, type;
        scope.elementName = "";
        screenElementsManager = CurrentScreenData.elementsManager;
        if (scope.card.elementId) {
          type = screenElementsManager.get()[scope.card.elementId].type;
          scope.data = ElementComponents[type][scope.card.blockId];
          scope.$watch(function() {
            return screenElementsManager.get()[scope.card.elementId].name;
          }, function(newVal, oldVal) {
            return scope.elementName = newVal;
          }, true);
        } else {
          scope.data = GeneralComponents[scope.card.blockId];
        }
        GetCardTemplate(function(template) {
          element.empty();
          GenerateElement(template, scope, element);
          return AddDraggableEvent(scope, element);
        });
        return scope._contextmenu = {
          "delete": function() {
            element.remove();
            ScreenCards.list = Build.parse();
          }
        };
      }
    };
  }
]).directive("crosetElementComponentInList", [
  "CurrentScreenData", "SelectedElementUUID", function(CurrentScreenData, SelectedElementUUID) {
    return {
      link: function(scope) {
        return scope.elementData = CurrentScreenData.elementsManager.get()[SelectedElementUUID.get()];
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
          var cardOptions, data, inputOptions, inputs, mats, options, propertyChild, variable, variableChild;
          data = {
            offset: {
              top: element.css("top"),
              left: element.css("left")
            },
            blockId: scope.card.blockId,
            elementId: scope.card.elementId
          };
          cardOptions = {};
          options = {};
          inputOptions = {};
          inputs = $(element).children(".croset-component-body").children("croset-component-input");
          if (!inputs[0]) {
            inputs = $(element).children(".croset-component-body").children().children(".croset-mat-flex").children("croset-component-input");
          }
          inputs.each(function(i, e) {
            var inputCard, inputScope, key;
            inputCard = $(e).children("croset-component-in-code");
            inputScope = $(e).scope();
            key = inputScope.input.result;
            if (key) {
              options[key] = inputScope.value;
              inputOptions[key] = inputScope.inputValue;
              if (inputCard[0]) {
                return cardOptions[key] = inputCard.scope().parse();
              }
            }
          });
          data.cardOptions = cardOptions;
          data.options = options;
          data.inputOptions = inputOptions;
          childScope = angular.element($(element).children("croset-component-in-code")).scope();
          if (childScope) {
            data.child = childScope.parse();
          }
          mats = $(element).children("croset-component-mat").children().children(".mat-wrapper").children(".croset-component-input-mat-card");
          data.matContents = {};
          mats.each(function(i, e) {
            var matResult, matScope;
            matScope = angular.element(e).scope();
            matResult = [];
            $(e).children().each(function(i, e) {
              return matResult.push(angular.element(e).scope().parse());
            });
            data.matContents[matScope.matName] = matResult;
            return data.matSize = scope.card.matSize;
          });
          propertyChild = $(element).children("croset-component-property").children("croset-component-property-modified").children("croset-component-in-code");
          if (propertyChild[0]) {
            data.propertyChild = angular.element(propertyChild).scope().parse();
          }
          variableChild = $(element).children("croset-component-variable").children("croset-component-property-modified").children("croset-component-in-code");
          if (variableChild[0]) {
            data.propertyChild = angular.element(variableChild).scope().parse();
          }
          variable = $(element).children("croset-component-variable");
          if (variable[0]) {
            data.variableName = angular.element(variable).scope().variableName;
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
  "Build", function(Build) {
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-mat.html",
      link: function(scope, element, attrs) {
        var lastMatIndex, mousePosition, resizing;
        scope.mats = {};
        lastMatIndex = 0;
        angular.forEach(scope.data.appearance, function(e, i) {
          if (e.type === "mat") {
            scope.mats[e.result] = scope.data.appearance.slice(lastMatIndex, i);
            return lastMatIndex = i + 1;
          }
        });
        if (scope.card) {
          resizing = false;
          return mousePosition = {};
        }
      }
    };
  }
]).directive("matWrapper", [
  function() {
    return {
      restrict: "C",
      scope: false,
      link: function(scope, element) {
        var card;
        card = scope.$parent.$parent.$parent.card;
        if (card) {
          if (card.matSize == null) {
            card.matSize = {
              height: {},
              width: null
            };
          }
          element.parent().parent().width(card.matSize.width);
          if (card.matSize.height) {
            return element.height(card.matSize.height[scope.matName]);
          }
        }
      }
    };
  }
]).directive("crosetMatResizer", [
  "Build", function(Build) {
    return {
      restrict: "C",
      scope: {
        direction: "@"
      },
      link: function(scope, element, attrs) {
        var target;
        target = element.parent();
        $(element).mousedown(function($event) {
          var currentMatHeight, currentMatWidth, mousePosition, resizing;
          resizing = true;
          mousePosition = {
            x: $event.pageX,
            y: $event.pageY
          };
          currentMatWidth = target.width();
          currentMatHeight = target.height();
          $(document).mousemove(function(e) {
            switch (scope.direction) {
              case "right":
                scope.$parent.card.matSize.width = currentMatWidth + e.pageX - mousePosition.x;
                target.width(scope.$parent.card.matSize.width);
                break;
              case "bottom":
                scope.$parent.$parent.card.matSize.height[scope.$parent.matName] = currentMatHeight + e.pageY - mousePosition.y;
                target.height(currentMatHeight + e.pageY - mousePosition.y);
                scope.$parent.$parent.card.matSize;
            }
            mousePosition = {
              x: $event.pageX,
              y: $event.pageY
            };
            return scope.$apply();
          });
        });
        return $(document).mouseup(function() {
          $(document).unbind("mousemove");
          return Build.parse();
        });
      }
    };
  }
]).directive("crosetComponentProperty", [
  function() {
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-property.html",
      link: function(scope, element, attrs) {}
    };
  }
]).directive("crosetComponentVariable", [
  "ProjectData", "$mdDialog", "$mdToast", function(ProjectData, $mdDialog, $mdToast) {
    return {
      restrict: "E",
      scope: false,
      templateUrl: "component-variable.html",
      link: function(scope, element, attrs) {
        if (scope.card) {
          scope.variables = ProjectData.variables;
          scope.variableName = scope.card.variableName;
          scope.onchange = function() {};
          scope["new"] = function(ev) {
            var confirm;
            confirm = $mdDialog.prompt().title("新しい変数").textContent("").targetEvent(ev).ok("OK").cancel("キャンセル");
            return $mdDialog.show(confirm).then(function(name) {
              var result;
              result = ProjectData.addvariable(name);
              if (!result) {
                return $mdToast.show($mdToast.simple().textContent('その名前の変数はすでに存在します').position("right bottom").hideDelay(3000));
              }
            });
          };
          return ProjectData.onChangevariables(function(variables) {
            return scope.variables = variables;
          });
        }
      }
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
        var cardData, cardScope, e, inputValue, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, value;
        element.empty();
        cardData = (ref = scope.$parent.card) != null ? (ref1 = ref.cardOptions) != null ? ref1[(ref2 = scope.input) != null ? ref2.result : void 0] : void 0 : void 0;
        if (cardData != null ? cardData.blockId : void 0) {
          e = $("<croset-component-in-code>");
          cardScope = scope.$new();
          cardScope.card = cardData;
          e = $compile(e)(cardScope);
          element.append(e);
        }
        e = angular.element("<croset-component-input-" + scope.input.type + ">");
        e = $compile(e)(scope);
        e.appendTo(element);
        value = (ref3 = scope.$parent.card) != null ? (ref4 = ref3.options) != null ? ref4[(ref5 = scope.input) != null ? ref5.result : void 0] : void 0 : void 0;
        inputValue = (ref6 = scope.$parent.card) != null ? (ref7 = ref6.inputOptions) != null ? ref7[(ref8 = scope.input) != null ? ref8.result : void 0] : void 0 : void 0;
        return scope.inputValue = inputValue || ((ref9 = scope.input) != null ? ref9.defaultValue : void 0);
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
  "$timeout", "Build", "ScreenCards", function($timeout, Build, ScreenCards) {
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
        scope.onblur = function() {
          scope.value = "'" + scope.inputValue + "'";
          ScreenCards.list = Build.parse();
        };
        scope.onchange = function() {
          var width;
          width = element.children("span")[0].offsetWidth;
          element.find("input").css("width", calculateWidth(width));
        };
        return $timeout(function() {
          return scope.onchange();
        });
      }
    };
  }
]).directive("crosetComponentInputExpbox", [
  "$timeout", "Build", "ScreenCards", function($timeout, Build, ScreenCards) {
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
        scope.onblur = function() {
          scope.value = scope.inputValue;
          ScreenCards.list = Build.parse();
        };
        scope.onchange = function() {
          var width;
          width = element.children("span")[0].offsetWidth;
          element.find("input").css("width", calculateWidth(width));
        };
        return $timeout(function() {
          return scope.onchange();
        });
      }
    };
  }
]).directive("crosetComponentInputScreen", [
  "$timeout", "Build", "ScreenCards", "ProjectData", function($timeout, Build, ScreenCards, ProjectData) {
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
      templateUrl: "component-input-screen.html",
      link: function(scope, element, attrs) {
        scope.screens = ProjectData.screens;
        ProjectData.setCallback(function() {
          return scope.screens = ProjectData.getScreens();
        });
        scope.onchange = function() {
          scope.value = "'" + scope.inputValue + "'";
        };
        return $timeout(function() {
          return scope.onchange();
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
]).directive("componentMenu", [
  function() {
    return {
      scope: true
    };
  }
]);
