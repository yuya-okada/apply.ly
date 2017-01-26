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
      screenElementsManager = new ScreenElementsManager(element.find(".project-preview"));
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
      }).success(function(data, status, headers, config) {
        console.log("データ", data);
        return $scope.projects.push(data);
      }).error(function(data, status, headers, config) {
        return console.log("Failed:", data);
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
        }).success(function(data, status, headers, config) {
          return $state.go("editor.design", {
            projectId: data.projectId
          });
        }).error(function(data) {
          return console.log("Filed: Create Project");
        })["catch"](function(error) {
          return console.log('catch', error);
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
        }).success(function(data, status, headers, config) {
          console.log("成功");
          return $state.reload();
        }).error(function(data) {
          return console.log("Filed: Rename");
        })["catch"](function(error) {
          return console.log('catch', error);
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
        }).success(function(data, status, headers, config) {
          return location.reload();
        }).error(function(data) {
          return console.log("Filed: Deleting");
        })["catch"](function(error) {
          return console.log('catch', error);
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
