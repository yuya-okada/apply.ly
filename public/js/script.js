angular.module("Croset").controller("ScriptController", [
  "$scope", "ProjectData", "CurrentScreenData", "$mdDialog", "$mdToast", function($scope, ProjectData, CurrentScreenData, $mdDialog, $mdToast) {
    if (ProjectData.scripts == null) {
      ProjectData.scripts = {};
    }
    $scope.scripts = ProjectData.scripts;
    $scope.currentScriptName = null;
    $scope.currentScript = null;
    $scope.aceLoaded = function(editor) {
      $scope.loadScript = function(scriptName) {
        var script;
        script = ProjectData.scripts[scriptName];
        if (script.type !== "block") {
          $scope.currentScriptName = scriptName;
          $scope.currentScript = script;
          editor.setValue(script.sourceCode);
          return editor.focus();
        } else {
          $scope.currentScriptName = scriptName;
          $scope.currentScript = script;
          return $scope.workspaceXML = Blockly.Xml.textToDom(script.cards);
        }
      };
      $scope.addJsScript = function(ev) {
        var confirm;
        confirm = $mdDialog.prompt().title("新しいJSスクリプト").textContent("スクリプトの名前を入力").placeholder("スクリプト名").ariaLabel("").targetEvent(ev).ok("OK").cancel("キャンセル");
        return $mdDialog.show(confirm).then(function(result) {
          if (Object.keys(result).indexOf(result) === -1) {
            ProjectData.scripts[result] = {
              sourceCode: "",
              type: "javascript"
            };
            return $scope.loadScript(result);
          } else {
            return $mdToast.show($mdToast.simple().textContent("すでに存在する名前です"));
          }
        });
      };
      return $scope.addBlockScript = function(ev) {
        var confirm;
        confirm = $mdDialog.prompt().title("新しいブロックスクリプト").textContent("スクリプトの名前を入力").placeholder("スクリプト名").ariaLabel("").targetEvent(ev).ok("OK").cancel("キャンセル");
        return $mdDialog.show(confirm).then(function(result) {
          if (Object.keys(result).indexOf(result) === -1) {
            ProjectData.scripts[result] = {
              text: "",
              type: "block",
              cards: ""
            };
            return $scope.loadScript(result);
          } else {
            return $mdToast.show($mdToast.simple().textContent("すでに存在する名前です"));
          }
        });
      };
    };
    $scope.aceChanged = function(e) {
      var editor;
      editor = e[1];
      if ($scope.currentScriptName) {
        $scope.currentScript.sourceCode = editor.getValue();
        return ProjectData.scripts[$scope.currentScriptName] = $scope.currentScript;
      }
    };
    return $scope.onWorkspaceChanged = function(workspace) {
      var xml;
      xml = Blockly.Xml.workspaceToDom(workspace);
      $scope.currentScript.cards = Blockly.Xml.domToText(xml);
      return $scope.currentScript.sourceCode = Blockly.JavaScript.workspaceToCode(workspace);
    };
  }
]);
