crosetModule.service("CrosetTable", [
  "$mdToast", "CurrentScreenData", "$state", function($mdToast, CurrentScreenData, $state) {
    var constructor;
    constructor = function(tableName) {
      var that;
      that = this;
      this.setTableName = function(tableName) {
        try {
          that.tableRef = firebase.database().ref("/" + tableName);
          that.fieldsRef = that.tableRef.child("fields");
          return that.recordsRef = that.tableRef.child("records");
        } catch (_error) {
          $mdToast.show($mdToast.simple().textContent('firebaseを正しく設定してください').position("right bottom").hideDelay(3000));
          return $state.go("editor.design", {
            screenId: CurrentScreenData.id
          });
        } finally {
          constructor.instance = that;
        }
      };
      if (tableName) {
        this.setTableName(tableName);
      }
      if (typeof constructor.instance === "object") {
        return constructor.instance;
      }
      return this;
    };
    return constructor;
  }
]).controller("DatabaseController", [
  "$scope", "$timeout", "$mdToast", "CrosetTable", "getUUID", "$mdDialog", "$mdBottomSheet", function($scope, $timeout, $mdToast, CrosetTable, getUUID, $mdDialog, $mdBottomSheet) {
    var AddColumnController, setEvents, showConfirmDialog, table;
    table = new CrosetTable("default");
    $scope.tables = [];
    firebase.database().ref("/").on("child_added", function(childSnapshot, prevChildKey) {
      return $timeout(function() {
        $scope.tables.push(childSnapshot.key);
        if (!$scope.currentTable) {
          $scope.currentTable = childSnapshot.key;
          return $scope.onTableChanged(childSnapshot.key);
        }
      });
    });
    setEvents = function() {
      $scope.records = {};
      table.recordsRef.on("child_added", function(childSnapshot, prevChildKey) {
        return $timeout(function() {
          return $scope.records[childSnapshot.key] = childSnapshot.val();
        });
      });
      table.recordsRef.on("child_removed", function(childSnapshot) {
        delete $scope.records[childSnapshot.key];
        return $scope;
      });
      $scope.fields = {};
      table.fieldsRef.on("child_added", function(childSnapshot, prevChildKey) {
        return $timeout(function() {
          return $scope.fields[childSnapshot.key] = childSnapshot.val();
        });
      });
      return table.fieldsRef.on("child_removed", function(childSnapshot) {
        return $timeout(function() {
          return delete $scope.fields[childSnapshot.key];
        });
      });
    };
    setEvents();
    $scope.onTableChanged = function(newTable) {
      table.fieldsRef.off("child_added");
      table.fieldsRef.off("child_removed");
      table.recordsRef.off("child_added");
      table.recordsRef.off("child_removed");
      table = new CrosetTable(newTable);
      return setEvents();
    };
    $scope.onTableChanged;
    $scope.onFieldChanged = function(id, newVal) {
      return table.fieldsRef.child(id).set(newVal);
    };
    $scope.onRecordChanged = function(id, fieldId, newVal) {
      return table.recordsRef.child(id).child(fieldId).set(newVal);
    };
    $scope.addTable = function(ev) {
      var confirm;
      confirm = $mdDialog.prompt().title("新しいテーブル").textContent("テーブルの名前を入力してください").ariaLabel("テーブル名").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function(result) {
        return firebase.database().ref("/" + result).child("exist").set("true");
      });
    };
    $scope.addField = function(ev) {
      var confirm;
      confirm = $mdDialog.prompt().title("新しいフィールド").textContent("フィールドの名前を入力してください").ariaLabel("フィールド名").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function(result) {
        return table.fieldsRef.child(getUUID()).set(result);
      });
    };
    $scope.addColumn = function(ev) {
      return $mdDialog.show({
        controller: AddColumnController,
        templateUrl: 'templates/add-column-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    };
    $scope.removeTable = function(ev, id) {
      var alert;
      if ($scope.tables.length === 1) {
        return alert = $mdDialog.alert().title("テーブルの削除").content("全てのテーブルを削除することはできません").targetEvent(ev).ok("OK");
      } else {
        return showConfirmDialog("テーブルの削除", "このテーブルを削除します", ev, function() {
          var idx;
          table.tableRef.remove();
          idx = $scope.tables.indexOf($scope.currentTable);
          if (idx >= 0) {
            $scope.tables.splice(idx, 1);
          }
          $scope.onTableChanged($scope.tables[0]);
          return $scope.currentTable = $scope.tables[0];
        });
      }
    };
    $scope.removeField = function(ev) {
      var confirm;
      confirm = $mdDialog.prompt().title("フィールドを削除").textContent("削除するフィールドの名前を入力してください").ariaLabel("フィールド名").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function(result) {
        var key, ref, toast, value;
        ref = $scope.fields;
        for (key in ref) {
          value = ref[key];
          if (value === result) {
            table.fieldsRef.child(key).remove();
            return;
          }
        }
        toast = $mdToast.simple().textContent("存在しないフィールドです").position("bottom right").hideDelay(3000);
        return $mdToast.show(toast);
      });
    };
    $scope.removeRecord = function(ev, id) {
      return showConfirmDialog("行の削除", "この行を削除します", ev, function() {
        return table.recordsRef.child(id).remove();
      });
    };
    showConfirmDialog = function(title, content, ev, callback) {
      var confirm;
      confirm = $mdDialog.confirm().title(title).content(content).targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(callback);
    };
    return AddColumnController = [
      "$scope", function($scope_) {
        $scope_.fields = $scope.fields;
        $scope_.record = {};
        $scope_.cancel = $mdDialog.hide;
        return $scope_.ok = function() {
          table.recordsRef.child(getUUID()).set($scope_.record);
          return $mdDialog.hide();
        };
      }
    ];
  }
]).controller("ServerBindDialogController", [
  "$scope", "$timeout", "$mdDialog", "ProjectData", "CrosetTable", "varId", function($scope, $timeout, $mdDialog, ProjectData, CrosetTable, varId) {
    var onTableChanged, onTableLoaded, ref, tableRef;
    $scope.result = ((ref = ProjectData.variables[varId]) != null ? ref.bindServer : void 0) || {
      fields: {}
    };
    $scope.table = $scope.result.table;
    tableRef = null;
    $scope.tables = [];
    firebase.database().ref("/").once("child_added", function(childSnapshot) {
      return $timeout(function() {
        $scope.tables.push(childSnapshot.key);
        if (!$scope.table) {
          $scope.table = childSnapshot.key;
        }
        if (!tableRef) {
          return onTableLoaded();
        }
      });
    });
    onTableChanged = function() {
      $scope.result = {
        fields: {}
      };
      return onTableChanged();
    };
    onTableLoaded = function() {
      tableRef = firebase.database().ref("/" + $scope.table);
      return tableRef.child("fields").once("value", function(dataSnapshot) {
        return $timeout(function() {
          var base, fieldId, fieldName, ref1, results;
          $scope.fields = dataSnapshot.toJSON();
          ref1 = $scope.fields;
          results = [];
          for (fieldId in ref1) {
            fieldName = ref1[fieldId];
            if ((base = $scope.result.fields)[fieldId] == null) {
              base[fieldId] = {};
            }
            results.push($scope.result.fields[fieldId].type = "number");
          }
          return results;
        });
      });
    };
    $scope.operators = [
      {
        text: "＝",
        compile: "="
      }, {
        text: "＞",
        compile: ">"
      }, {
        text: "＜",
        compile: "<"
      }, {
        text: "≧",
        compile: ">="
      }, {
        text: "≦",
        compile: "<="
      }
    ];
    $scope.variables = ProjectData.variables;
    $scope.types = [
      {
        text: "テキスト",
        value: "text"
      }, {
        text: "変数",
        value: "variable"
      }
    ];
    $scope.ok = function() {
      var ref1;
      $scope.result.table = $scope.table;
      if ((ref1 = ProjectData.variables[varId]) != null) {
        ref1.bindServer = $scope.result;
      }
      console.log($scope.result);
      return $mdDialog.hide();
    };
    return $scope.cancel = function() {
      return $mdDialog.hide();
    };
  }
]);
