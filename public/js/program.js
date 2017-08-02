var crosetModule;

if (!window.CrosetBlock) {
  window.CrosetBlock = {};
}

crosetModule = angular.module("Croset");

crosetModule.service("InitCrosetBlockMethods", [
  "$mdDialog", "CurrentScreenData", function($mdDialog, CurrentScreenData) {
    var SelectElementDialogController, dialogCallback, filterTypes, listFncName;
    dialogCallback = null;
    listFncName = "";
    filterTypes = null;
    SelectElementDialogController = [
      "CurrentScreenData", "ElementDatas", "SelectedElementUUID", "$scope", "$interval", function(CurrentScreenData, ElementDatas, SelectedElementUUID, $scope, $interval) {
        var element, id, screenElements, screenElementsManager;
        screenElementsManager = CurrentScreenData.elementsManager;
        screenElements = $.extend(true, {}, typeof screenElementsManager[listFncName] === "function" ? screenElementsManager[listFncName]() : void 0);
        if (filterTypes) {
          for (id in screenElements) {
            element = screenElements[id];
            if (filterTypes.indexOf(element.type) === -1) {
              delete screenElements[id];
            }
          }
        }
        $scope.screenElements = screenElements;
        $scope.elementDatas = ElementDatas;
        $scope.reverse = false;
        $interval(function() {
          return $scope.reverse = !$scope.reverse;
        });
        return $scope.itemSelected = function(uuid, data) {
          if (typeof dialogCallback === "function") {
            dialogCallback(uuid, data);
          }
          return $mdDialog.hide();
        };
      }
    ];
    return function() {
      var showDialog;
      CrosetBlock.showSelectElementDialog = function(type, fnc) {
        filterTypes = type;
        listFncName = "get";
        return showDialog(fnc, SelectElementDialogController, "templates/select-element-dialog.tmpl.html");
      };
      CrosetBlock.showSelectTemplateDialog = function(type, fnc) {
        filterTypes = type;
        listFncName = "getTemplates";
        return showDialog(fnc, SelectElementDialogController, "templates/select-element-dialog.tmpl.html");
      };
      return showDialog = function(callback, controller, templateUrl) {
        dialogCallback = callback;
        return $mdDialog.show({
          controller: controller,
          templateUrl: templateUrl,
          parent: angular.element(document.body),
          clickOutsideToClose: true
        }).then(function(answer) {}, function() {});
      };
    };
  }
]);

crosetModule.directive("selectElementDialogChildItem", [
  "$compile", function($compile) {
    return {
      restrict: "E",
      link: function(scope, element, attrs) {
        var e;
        if (scope.element.children) {
          e = angular.element("<select-element-dialog-item>");
          e = $compile(e)(scope);
          return e.appendTo(element);
        }
      }
    };
  }
]).directive("selectElementDialogItem", function() {
  return {
    templateUrl: "templates/select-element-dialog-item.tmpl.html"
  };
}).controller("CodeController", [
  "$scope", "$timeout", "ProjectData", "CurrentScreenData", "SelectedElementOrTemplateUUID", "InitCrosetBlockMethods", function($scope, $timeout, ProjectData, CurrentScreenData, SelectedElementOrTemplateUUID, InitCrosetBlockMethods) {
    var blocklyArea, blocklyDiv, blocks, cards, elementBlock, i, j, len, len1, onResize, onScreenChanged, ref, ref1, ref2, ref3, ref4, templateText, type, xml;
    InitCrosetBlockMethods();
    onScreenChanged = function() {
      var id, options, ref, screen;
      options = [];
      ref = ProjectData.screens;
      for (id in ref) {
        screen = ref[id];
        options.push([screen.name, id]);
      }
      CrosetBlock.customBlock.intentBlock.args0[0].options = options;
      Blockly.defineBlocksWithJsonArray([CrosetBlock.customBlock.intentBlock]);
      return CrosetBlock.customBlockGenerator.intentBlockGenerator();
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
    CrosetBlock.setElementBlocks();
    ref = ["_element", "_template"];
    for (i = 0, len = ref.length; i < len; i++) {
      templateText = ref[i];
      ref1 = angular.copy(CrosetBlock.elementBlocks);
      for (type in ref1) {
        blocks = ref1[type];
        for (j = 0, len1 = blocks.length; j < len1; j++) {
          elementBlock = blocks[j];
          elementBlock.type += templateText;
          if ((ref2 = elementBlock.args0) != null) {
            ref2.unshift({
              type: "field" + templateText,
              name: "ELEMENT",
              filter: type
            });
          }
          Blockly.defineBlocksWithJsonArray([elementBlock]);
        }
      }
    }
    cards = (ref3 = ProjectData.screens) != null ? (ref4 = ref3[CurrentScreenData.id]) != null ? ref4.cards : void 0 : void 0;
    if (cards && cards[0]) {
      xml = Blockly.Xml.textToDom(cards);
      Blockly.Xml.domToWorkspace(xml, CurrentScreenData.workspace);
    }
    CurrentScreenData.workspace.registerToolboxCategoryCallback('ELEMENT', function(workspace) {
      var block, blockText, elementsManager, k, len2, ref5, ref6, selectedElement, xmlList;
      if (SelectedElementOrTemplateUUID.get()) {
        elementsManager = CurrentScreenData.getElementsManager();
        if (!SelectedElementOrTemplateUUID.isTemplate()) {
          selectedElement = elementsManager.get(SelectedElementOrTemplateUUID.get());
        } else {
          selectedElement = elementsManager.getTemplate(SelectedElementOrTemplateUUID.get());
        }
        xmlList = [];
        ref5 = angular.copy(CrosetBlock.elementBlocks[selectedElement.type]);
        for (k = 0, len2 = ref5.length; k < len2; k++) {
          elementBlock = ref5[k];
          templateText = SelectedElementOrTemplateUUID.isTemplate() ? "_template" : "_element";
          if ((ref6 = elementBlock.args0) != null) {
            ref6.unshift({
              type: "field" + templateText,
              name: "ELEMENT",
              filter: selectedElement.type,
              defaultId: SelectedElementOrTemplateUUID.get()
            });
          }
          Blockly.defineBlocksWithJsonArray([elementBlock]);
          blockText = '<xml>' + '<block type="' + elementBlock.type + templateText + '">　</block>' + '</xml>';
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
