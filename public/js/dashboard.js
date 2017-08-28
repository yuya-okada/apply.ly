crosetModule.controller("DashboardController", [
  "$scope", "$http", "$mdDialog", "$mdSidenav", "$state", "$rootScope", "ScreenElementsManager", "Elements", "getUUID", function($scope, $http, $mdDialog, $mdSidenav, $state, $rootScope, ScreenElementsManager, Elements, getUUID) {
    var confirmProjectName, i, len, profile, project, projects;
    $scope.toggleSideNav = function() {
      return $mdSidenav("side-menu").toggle().then(function() {});
    };
    profile = $rootScope.profile;
    console.log("プロフィール：", profile);
    projects = profile.projects;
    $scope.$on('repeatFinishedEventFired', function(ev, element) {
      var data, project, ref, ref1, results, screenElementsManager, uuid;
      project = ev.targetScope.project;
      screenElementsManager = new ScreenElementsManager(element.find(".project-preview"), true);
      ref1 = (ref = project.screens[project.defaultScreen]) != null ? ref.elements : void 0;
      results = [];
      for (uuid in ref1) {
        data = ref1[uuid];
        results.push(screenElementsManager.addFromData(data, uuid));
      }
      return results;
    });
    $scope.projects = [];
    for (i = 0, len = projects.length; i < len; i++) {
      project = projects[i];
      console.log(project, "プロジェクトID");
      $http({
        method: "GET",
        url: "/project",
        params: {
          projectId: project
        }
      }).then(function(result) {
        var data;
        data = result.data;
        console.log("データ", data);
        return $scope.projects.push(data);
      }, function(result) {
        return console.log("Failed:", result);
      });
    }
    $scope.newProject = function(ev) {
      return confirmProjectName(ev, "プロジェクトを作成", function(name) {
        $http({
          url: '/project',
          method: "POST",
          data: {
            name: name
          }
        }).then(function(result) {
          var data;
          data = result.data;
          return $state.go("editor.design", {
            projectId: data.projectId
          });
        }, function(result) {
          return console.log("Filed: Create Project");
        });
      }, function() {});
    };
    $scope.rename = function(ev, project) {
      return confirmProjectName(ev, "画面の名前を変更", function(newName) {
        console.log("called");
        project.name = newName;
        return $http({
          url: '/project',
          method: "PUT",
          data: project
        }).then(function(result) {
          var data;
          data = result;
          console.log("成功");
          return $state.reload();
        }, function(result) {
          return console.log("Filed: Rename");
        });
      });
    };
    $scope.remove = function(ev, projectId) {
      var confirm;
      confirm = $mdDialog.confirm().title("削除").content("プロジェクトの削除").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function() {
        console.log(projectId);
        return $http({
          url: '/project',
          method: "DELETE",
          data: {
            projectId: projectId
          },
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          }
        }).then(function(result) {
          return location.reload();
        }, function(result) {
          return console.log("Filed: Deleting");
        });
      }, function() {});
    };
    confirmProjectName = function(ev, title, fnc) {
      var confirm;
      confirm = $mdDialog.prompt().title(title).textContent("新しいプロジェクトの名前を入力してください").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function(name) {
        return fnc(name);
      }, function() {});
    };
    return $scope.openMore = function($mdOpenMenu, ev) {
      return $mdOpenMenu(ev);
    };
  }
]);
