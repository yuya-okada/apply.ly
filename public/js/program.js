var crosetModule;

if (!window.CrosetBlock) {
  window.CrosetBlock = {};
}

crosetModule = angular.module("Croset");

crosetModule.service("InitCrosetBlockMethods", [
  "$mdDialog", "CurrentScreenData", function($mdDialog, CurrentScreenData) {
    var SelectElementAndTemplateDialogController, SelectElementDialogController, dialogCallback, filterTypes, listFncName;
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
    SelectElementAndTemplateDialogController = [
      "CurrentScreenData", "ElementDatas", "SelectedElementUUID", "$scope", "$interval", function(CurrentScreenData, ElementDatas, SelectedElementUUID, $scope, $interval) {
        var elements, screenElementsManager, templates;
        screenElementsManager = CurrentScreenData.elementsManager;
        elements = $.extend(true, {}, screenElementsManager.get());
        templates = $.extend(true, {}, screenElementsManager.getTemplates());
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
      CrosetBlock.showSelectElementAndTemplateDialog = function(fnc) {
        return showDialog(fnc, SelectElementAndTemplateDialogController, "templates/select-element-and-template-dialog.tmpl.html");
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
  "$scope", "CurrentScreenData", "ProjectData", "$timeout", function($scope, CurrentScreenData, ProjectData, $timeout) {
    var blocklyArea, blocklyDiv, onResize, ref, ref1;
    $scope.cards = (ref = ProjectData.screens) != null ? (ref1 = ref[CurrentScreenData.id]) != null ? ref1.cards : void 0 : void 0;
    $scope.workspace = null;
    $scope.onWorkspaceChanged = function(workspace) {
      $scope.workspace = workspace;
      return CurrentScreenData.workspace = workspace;
    };
    blocklyArea = $("#program-zone");
    blocklyDiv = $("#program-code")[0];
    onResize = function(e) {
      blocklyDiv.style.left = blocklyArea.offset().left + 'px';
      blocklyDiv.style.top = blocklyArea.offset().right + 'px';
      blocklyDiv.style.width = blocklyArea.width() + 'px';
      blocklyDiv.style.height = blocklyArea.height() + 'px';
      console.log(blocklyArea.width(), blocklyArea.height());
      if ($scope.workspace) {
        return Blockly.svgResize($scope.workspace);
      }
    };
    window.addEventListener('resize', onResize, false);
    onResize();
    return $timeout(onResize, 1000);
  }
]).directive("workspace", [
  "$timeout", "ProjectData", "CurrentScreenData", "SelectedElementOrTemplateUUID", "SelectedElementUUID", "SelectedTemplate", "InitCrosetBlockMethods", function($timeout, ProjectData, CurrentScreenData, SelectedElementOrTemplateUUID, SelectedElementUUID, SelectedTemplate, InitCrosetBlockMethods) {
    return {
      restrict: "A",
      scope: {
        onWorkspaceChanged: "=workspaceChanged",
        defaultXML: "=workspace"
      },
      link: function(scope, el, attr) {
        var blocklyDiv, cards, onScreenChanged, ref, varId, variable, variables, workspace, xml;
        InitCrosetBlockMethods();
        workspace = null;
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
          dom = Blockly.Xml.workspaceToDom(workspace);
          workspace.clear();
          Blockly.Xml.domToWorkspace(dom, workspace);
          blocks = workspace.getAllBlocks();
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
        blocklyDiv = el[0];
        workspace = Blockly.inject(blocklyDiv, {
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
        workspace.addChangeListener(function() {
          return scope.onWorkspaceChanged(workspace);
        });
        scope.onWorkspaceChanged(workspace);
        variables = [];
        ref = ProjectData.variables;
        for (varId in ref) {
          variable = ref[varId];
          variables.push(variable.name);
        }
        workspace.variableList = variables;
        CrosetBlock.setElementBlocks();
        cards = scope.defaultXML;
        if (cards && cards[0]) {
          xml = Blockly.Xml.textToDom(cards);
          Blockly.Xml.domToWorkspace(xml, workspace);
        }
        workspace.registerToolboxCategoryCallback('ELEMENT', function(workspace) {
          var block, blockText, button, elementBlock, elementsManager, i, len, ref1, selectedElement, templateText, xmlList;
          xmlList = [];
          button = goog.dom.createDom("button");
          button.setAttribute("text", "要素を選択");
          button.setAttribute("callbackKey", 'SELECT_ELEMENT');
          xmlList.push(button);
          if (SelectedElementOrTemplateUUID.get()) {
            elementsManager = CurrentScreenData.getElementsManager();
            if (!SelectedElementOrTemplateUUID.isTemplate()) {
              selectedElement = elementsManager.get(SelectedElementOrTemplateUUID.get());
            } else {
              selectedElement = elementsManager.getTemplate(SelectedElementOrTemplateUUID.get());
            }
            ref1 = angular.copy(CrosetBlock.elementBlocks[selectedElement.type]);
            for (i = 0, len = ref1.length; i < len; i++) {
              elementBlock = ref1[i];
              templateText = SelectedElementOrTemplateUUID.isTemplate() ? "_template" : "_element";
              blockText = '<xml>' + '<block type="' + elementBlock.type + templateText + '"> <field name="ELEMENT">' + SelectedElementOrTemplateUUID.get() + '</field> </block>' + '</xml>';
              block = Blockly.Xml.textToDom(blockText).firstChild;
              xmlList.push(block);
            }
          }
          return xmlList;
        });
        return workspace.registerButtonCallback('SELECT_ELEMENT', function(workspace) {
          return CrosetBlock.showSelectElementAndTemplateDialog(null, function(uuid, data, isTemplate) {
            var lastNode;
            if (!isTemplate) {
              SelectedElementUUID.set(uuid);
            } else {
              SelectedTemplate.set(uuid);
            }
            lastNode = workspace.toolbox_.tree_.getSelectedItem();
            workspace.toolbox_.tree_.setSelectedItem(null);
            return workspace.toolbox_.tree_.setSelectedItem(lastNode);
          });
        });
      }
    };
  }
]);
