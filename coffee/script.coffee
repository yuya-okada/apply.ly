angular.module "Croset"

.controller "ScriptController", ["$scope", "ProjectData", "CurrentScreenData", "$mdDialog", "$mdToast", ($scope, ProjectData, CurrentScreenData, $mdDialog, $mdToast) ->
  ProjectData.scripts ?= {}
  $scope.scripts = ProjectData.scripts
  $scope.currentScriptName = null
  $scope.currentScript = null
  
  $scope.aceLoaded = (editor) ->
    $scope.loadScript = (scriptName) ->
      script = ProjectData.scripts[scriptName]
      
      if script.type != "block"
        $scope.currentScriptName = scriptName
        $scope.currentScript = script
        editor.setValue script.sourceCode
        editor.focus()
        
      else
        $scope.currentScriptName = scriptName
        $scope.currentScript = script
        $scope.workspaceXML = Blockly.Xml.textToDom script.cards
        

    
    $scope.addJsScript = (ev) ->
      confirm = $mdDialog.prompt()
        .title "新しいJSスクリプト"
        .textContent "スクリプトの名前を入力"
        .placeholder "スクリプト名"
        .ariaLabel ""
        .targetEvent ev
        .ok "OK"
        .cancel "キャンセル"

      $mdDialog.show(confirm).then (result) ->
        
        if Object.keys(result).indexOf(result) == -1
          
          ProjectData.scripts[result] = {
            sourceCode: ""
            type: "javascript"
          }

          $scope.loadScript(result)
        
        else
          $mdToast.show $mdToast.simple().textContent "すでに存在する名前です"
      
    $scope.addBlockScript = (ev) ->
      confirm = $mdDialog.prompt()
        .title "新しいブロックスクリプト"
        .textContent "スクリプトの名前を入力"
        .placeholder "スクリプト名"
        .ariaLabel ""
        .targetEvent ev
        .ok "OK"
        .cancel "キャンセル"

      $mdDialog.show(confirm).then (result) ->
        
        if Object.keys(result).indexOf(result) == -1
          
          ProjectData.scripts[result] = {
            text: ""
            type: "block"
            cards: ""
          }

          $scope.loadScript(result)
        
        else
          $mdToast.show $mdToast.simple().textContent "すでに存在する名前です"
     
  
  
  
  $scope.aceChanged = (e) ->
    editor = e[1]
    if $scope.currentScriptName
      $scope.currentScript.sourceCode = editor.getValue()
      ProjectData.scripts[$scope.currentScriptName] = $scope.currentScript
  
  $scope.onWorkspaceChanged = (workspace) ->
    
    xml = Blockly.Xml.workspaceToDom workspace
    $scope.currentScript.cards = Blockly.Xml.domToText xml
    $scope.currentScript.sourceCode = Blockly.JavaScript.workspaceToCode workspace
    
  
]






