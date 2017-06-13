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
}).factory("ShowElementDialog", [
  "$mdDialog", function($mdDialog) {
    var ShowElementDialogController;
    ShowElementDialogController = [function() {}];
    return function(fnc) {
      return $mdDialog.show({
        controller: ShowElementDialogController,
        templateUrl: 'templates/icon-select-dialog.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      }).then(function(answer) {}, function() {});
    };
  }
]).controller("CodeController", [
  "$scope", "$timeout", "ProjectData", "CurrentScreenData", "SelectedElementUUID", function($scope, $timeout, ProjectData, CurrentScreenData, SelectedElementUUID) {
    var blocklyArea, blocklyDiv, cards, element, elementBlock, elementBlocks, i, id, len, onResize, onScreenChanged, options, ref, ref1, ref2, ref3, ref4, template, xml;
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
      var block, blocks, dom, i, id, len, results;
      onScreenChanged();
      dom = Blockly.Xml.workspaceToDom(CurrentScreenData.workspace);
      CurrentScreenData.workspace.clear();
      Blockly.Xml.domToWorkspace(dom, CurrentScreenData.workspace);
      blocks = CurrentScreenData.workspace.getAllBlocks();
      results = [];
      for (i = 0, len = blocks.length; i < len; i++) {
        block = blocks[i];
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
    options = [["テンプレートを選択", ""]];
    ref = CurrentScreenData.elementsManager.getTemplates();
    for (id in ref) {
      template = ref[id];
      options.push([template.name, id]);
    }
    CrosetBlock.instantiateBlock.args0[0].options = options;
    Blockly.defineBlocksWithJsonArray([CrosetBlock.instantiateBlock]);
    CrosetBlock.instantiateBlockGenerator();
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
    ref2 = (ref1 = CurrentScreenData.getElementsManager()) != null ? ref1.get() : void 0;
    for (id in ref2) {
      element = ref2[id];
      elementBlocks = angular.copy(CrosetBlock.elementBlocks[element.type]);
      if (elementBlocks) {
        for (i = 0, len = elementBlocks.length; i < len; i++) {
          elementBlock = elementBlocks[i];
          elementBlock.type = elementBlock.type.replace("#id", id);
          elementBlock.message0 = elementBlock.message0.replace("#name", element.name);
          Blockly.defineBlocksWithJsonArray([elementBlock]);
        }
        CrosetBlock.setGenerators(id, element.type);
      }
    }
    cards = (ref3 = ProjectData.screens) != null ? (ref4 = ref3[CurrentScreenData.id]) != null ? ref4.cards : void 0 : void 0;
    if (cards && cards[0]) {
      xml = Blockly.Xml.textToDom(cards);
      Blockly.Xml.domToWorkspace(xml, CurrentScreenData.workspace);
    }
    CurrentScreenData.workspace.registerToolboxCategoryCallback('ELEMENT', function(workspace) {
      var block, blockText, elementsManager, j, len1, ref5, selectedElement, type, xmlList;
      if (SelectedElementUUID.get()) {
        elementsManager = CurrentScreenData.getElementsManager();
        selectedElement = elementsManager.get(SelectedElementUUID.get());
        xmlList = [];
        ref5 = CrosetBlock.elementBlocks[selectedElement.type];
        for (j = 0, len1 = ref5.length; j < len1; j++) {
          elementBlock = ref5[j];
          type = elementBlock.type.replace("#id", SelectedElementUUID.get());
          blockText = '<xml>' + '<block type="' + type + '">　</block>' + '</xml>';
          block = Blockly.Xml.textToDom(blockText).firstChild;
          xmlList.push(block);
        }
        return xmlList;
      } else {
        return [];
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
]);
