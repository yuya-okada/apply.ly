crosetModule.directive("repeatFinished", function($timeout) {
  return function(scope, element, attrs) {
    if (scope.$last) {
      return $timeout(function() {
        return scope.$emit("repeatFinishedEventFired", element);
      });
    }
  };
}).controller("DashboardController", [
  "$scope", "$http", "$mdDialog", "$mdSidenav", "$state", "$rootScope", "ScreenElements", "Elements", function($scope, $http, $mdDialog, $mdSidenav, $state, $rootScope, ScreenElements, Elements) {
    var i, len, profile, project, projects;
    $scope.toggleSideNav = function() {
      return $mdSidenav("side-menu").toggle().then(function() {});
    };
    profile = $rootScope.profile;
    console.log("プロフィール：", profile);
    projects = profile.projects;
    $scope.$on('repeatFinishedEventFired', function(ev, element) {
      var data, ref, results, uuid;
      Elements.set("screen", element.find(".project-preview"));
      ref = ev.targetScope.project.elements;
      results = [];
      for (uuid in ref) {
        data = ref[uuid];
        results.push(ScreenElements.addFromData(data, uuid));
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
          _id: project
        }
      }).success(function(data, status, headers, config) {
        return $scope.projects.push(data);
      }).error(function(data, status, headers, config) {
        return console.log("Failed:", data);
      });
    }
    return $scope.newProject = function(ev) {
      var confirm;
      confirm = $mdDialog.prompt().title("プロジェクトを作成").textContent("新しいプロジェクトの名前を入力して下さい").placeholder("プロジェクト名").ariaLabel("Project Name").targetEvent(ev).ok("OK").cancel("キャンセル");
      return $mdDialog.show(confirm).then(function(result) {
        $http({
          url: '/project',
          method: "POST",
          data: {
            name: result
          }
        }).success(function(data, status, headers, config) {
          return $state.go("editor.design", {
            projectId: result
          });
        }).error(function(data) {
          return console.log("Filed: Create Project");
        })["catch"](function(error) {
          return console.log('catch', error);
        });
      }, function() {});
    };
  }
]);
