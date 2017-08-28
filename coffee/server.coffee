crosetModule

.service "CrosetTable", ["$mdToast", "CurrentScreenData", "$state", ($mdToast, CurrentScreenData, $state) ->
      
  constructor = (tableName) ->
    
    that = this
    this.setTableName = (tableName) ->
      try 
        that.tableRef = firebase.database().ref "/" + tableName
        that.fieldsRef = that.tableRef.child "fields"
        that.recordsRef = that.tableRef.child "records"

      catch
        $mdToast.show(
          $mdToast.simple()
          .textContent 'firebaseを正しく設定してください'
          .position "right bottom"
          .hideDelay 3000
        )
        $state.go "editor.design", {screenId: CurrentScreenData.id}

      finally
        constructor.instance = that
    
    
    if tableName
      this.setTableName tableName
    
    if typeof constructor.instance == "object"
      return constructor.instance
    
    return this
     
  return constructor
  
  
]

.controller "DatabaseController", ["$scope", "$timeout", "$mdToast", "CrosetTable", "getUUID", "$mdDialog", "$mdBottomSheet", ($scope, $timeout, $mdToast, CrosetTable, getUUID, $mdDialog, $mdBottomSheet) ->
  table = new CrosetTable "default"
  
  $scope.tables = []
  firebase.database().ref("/").on "child_added", (childSnapshot, prevChildKey) ->
    $timeout () ->
      $scope.tables.push childSnapshot.key 
      if !$scope.currentTable
        $scope.currentTable = childSnapshot.key
        $scope.onTableChanged childSnapshot.key
    
  setEvents = () ->  
    $scope.records = {}
    table.recordsRef.on "child_added", (childSnapshot, prevChildKey) ->
      $timeout () ->
        $scope.records[childSnapshot.key] = childSnapshot.val()
      

    table.recordsRef.on "child_removed", (childSnapshot) ->
      delete $scope.records[childSnapshot.key]
      $scope

    $scope.fields = {}
    table.fieldsRef.on "child_added", (childSnapshot, prevChildKey) ->
      $timeout () ->
        $scope.fields[childSnapshot.key] = childSnapshot.val()    
      


    table.fieldsRef.on "child_removed", (childSnapshot) ->
      $timeout () ->
        delete $scope.fields[childSnapshot.key]
      
      
      
  setEvents()
  
  $scope.onTableChanged = (newTable) ->
    table.fieldsRef.off "child_added"
    table.fieldsRef.off "child_removed"
    table.recordsRef.off "child_added"
    table.recordsRef.off "child_removed"
    
    table = new CrosetTable newTable
    setEvents()
    
  $scope.onTableChanged  
  
  $scope.onFieldChanged = (id, newVal) ->
    table.fieldsRef.child(id).set newVal
    
  $scope.onRecordChanged = (id, fieldId, newVal) ->
    table.recordsRef.child(id).child(fieldId).set newVal  
    
  $scope.addTable = (ev) ->
    confirm = $mdDialog.prompt()
      .title "新しいテーブル"
      .textContent "テーブルの名前を入力してください"
      .ariaLabel "テーブル名"
      .targetEvent ev
      .ok "OK"
      .cancel "キャンセル"
    $mdDialog.show(confirm).then　(result) ->
      firebase.database().ref("/" + result).child("exist").set "true"
    
  $scope.addField = (ev) ->
    confirm = $mdDialog.prompt()
      .title "新しいフィールド"
      .textContent "フィールドの名前を入力してください"
      .ariaLabel "フィールド名"
      .targetEvent ev
      .ok "OK"
      .cancel "キャンセル"
    $mdDialog.show(confirm).then　(result) ->
      table.fieldsRef.child(getUUID()).set result
      
  $scope.addColumn = (ev) ->
    $mdDialog.show {
      controller: AddColumnController
      templateUrl: 'templates/add-column-dialog.tmpl.html'
      parent: angular.element document.body
      targetEvent: ev
      clickOutsideToClose: false
    }
  
  $scope.removeTable = (ev, id) ->
    if $scope.tables.length == 1
      alert = $mdDialog.alert()
        .title "テーブルの削除"
        .content "全てのテーブルを削除することはできません"
        .targetEvent ev
        .ok "OK"
    
    else
      showConfirmDialog "テーブルの削除", "このテーブルを削除します", ev, () ->
        table.tableRef.remove()
        idx = $scope.tables.indexOf $scope.currentTable
        if idx >= 0
         $scope.tables.splice(idx, 1);
        
        $scope.onTableChanged $scope.tables[0]
        $scope.currentTable = $scope.tables[0]
    
  
  $scope.removeField = (ev) ->
    confirm = $mdDialog.prompt()
      .title "フィールドを削除"
      .textContent "削除するフィールドの名前を入力してください"
      .ariaLabel "フィールド名"
      .targetEvent ev
      .ok "OK"
      .cancel "キャンセル"
    $mdDialog.show(confirm).then　(result) ->
      for key, value of $scope.fields
        if value == result
          table.fieldsRef.child(key).remove()
          return
      
      toast = $mdToast.simple()
        .textContent "存在しないフィールドです"
        .position "bottom right"
        .hideDelay 3000  

      $mdToast.show toast
        
  $scope.removeRecord = (ev, id) ->
      
    showConfirmDialog "行の削除", "この行を削除します", ev, () ->
      table.recordsRef.child(id).remove()
    
  showConfirmDialog = (title, content, ev, callback) ->
    confirm = $mdDialog.confirm()
        .title title
        .content content 
        .targetEvent ev
        .ok "OK"
        .cancel "キャンセル"

    $mdDialog.show(confirm).then callback

  
  AddColumnController = ["$scope", ($scope_) ->
    $scope_.fields = $scope.fields
    $scope_.record = {}
    $scope_.cancel = $mdDialog.hide
    $scope_.ok = () ->
      table.recordsRef.child(getUUID()).set $scope_.record
      $mdDialog.hide()
  ]
  
  
]





.controller	"ServerBindDialogController", ["$scope", "$timeout", "$mdDialog", "ProjectData", "CrosetTable", "varId", ($scope, $timeout, $mdDialog, ProjectData, CrosetTable, varId) ->
 
  $scope.result = ProjectData.variables[varId]?.bindServer || {fields: {}}
  $scope.table = $scope.result.table
  
  tableRef = null
  $scope.tables = []
  firebase.database().ref("/").once "child_added", (childSnapshot) ->
    $timeout () ->
      $scope.tables.push childSnapshot.key 
      if !$scope.table
        $scope.table = childSnapshot.key
      if !tableRef
        onTableLoaded()
        
  
  onTableChanged = () ->
    $scope.result = {fields: {}}
    onTableChanged()

  onTableLoaded = () ->
    tableRef = firebase.database().ref "/" + $scope.table
    tableRef.child("fields").once "value", (dataSnapshot) ->
      $timeout () ->
        $scope.fields = dataSnapshot.toJSON()
        for fieldId, fieldName of $scope.fields
          $scope.result.fields[fieldId] ?= {}
          $scope.result.fields[fieldId].type = "number"
          
          
  $scope.operators = [
    {text: "＝", compile: "="},
    {text: "＞", compile: ">"},
    {text: "＜", compile: "<"},
    {text: "≧", compile: ">="},
    {text: "≦", compile: "<="}
  ]
  $scope.variables = ProjectData.variables
  $scope.types = [
    {text: "テキスト", value: "text"},
    {text: "変数", value: "variable"}
  ]

  $scope.ok = () ->
    $scope.result.table = $scope.table
    ProjectData.variables[varId]?.bindServer = $scope.result
    console.log $scope.result
    $mdDialog.hide()

  $scope.cancel = () ->
    $mdDialog.hide()

]









