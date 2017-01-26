var isDebugMode = true;

croset = angular.module('Croset', ["ui.router", "ngAria", "ngMaterial", "ngAnimate", "ngMessages"])

// 引数に関数を渡すとデータファイルを読み込んでその関数にコールバックする
.constant("getDataFile", function(func) {

	document.addEventListener("deviceready", function () {
		window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/data.json",		// データファイル読み込み
			function(fileEntry) {										// 成功
				fileEntry.file(function(file) {

					var reader = new FileReader();
					reader.onloadend = function(e) {

						func(JSON.parse(this.result));

					}
					reader.readAsText(file);
				});
			}, function(e) {
				console.log(e)
			}
		)
	})
})
// config-time dependencies can be injected here at .provider() declaration
.provider('runtimeStates', function runtimeStates($stateProvider) {
  // runtime dependencies for the service can be injected here, at the provider.$get() function.
  this.$get = function($q, $timeout, $state) { // for example
    return {
			getStateProvider: function() {
				return $stateProvider
			},
      addState: function(name, state) {
        $stateProvider.state(name, state);
      }
    }
  }
})
.service("Elements", [function() {
	elements = {
		screen: null
	}
	this.get = function() {
		return elements
	}
	this.set = function (key, value) {
		elements[key] = value
	}
}])

.constant("generateController", function(screen, screenId) {

	return ["$scope", "$state", "ScreenElements", "Elements", "$timeout", function($scope, $state, ScreenElements, Elements, $timeout) {

		Elements.set("screen", angular.element("#screen"));
		angular.forEach(screen.elements, function(element, uuid) {
			ScreenElements.addFromData(element, uuid);
		})


		var func = new Function("$scope", "$state", "$timeout", screen.sourceCode);			// ソースコードを実行
		func($scope, $state, $timeout)



		// 画面のリサイズ
		$scope.screenScaleRatio = 1
		sw = Elements.get()["screen"].width();
		sh = Elements.get()["screen"].height();
		$(window).on("resize", function() {
			$timeout(function() {

				ww = $(window).width();
				wh = $(window).height();

				console.log(ww, wh, sw, sh);

				if (wh / ww > sh / sw) { 		// 画面がscreenより縦長
					console.log("たて", ww, wh, sw, sh);
					$scope.screenScaleRatio = ww / sw;
				} else {
					console.log("横", ww, wh, sw, sh);
					$scope.screenScaleRatio = wh / sh;
				}


				console.log($scope.screenScaleRatio)

			}, 0)
		}).trigger("resize")


	}]
})

.constant("generateState", function($stateProvider, generateController, screenId, screen) {
	$stateProvider.state("screen" + screenId, {
		url: "/screen" + screenId,
		templateUrl: "templates/screen.html",
		controller: generateController(screen, screenId)
	})
})

.config(["$stateProvider", "$urlRouterProvider", "getDataFile", "generateController", "generateState", function($stateProvider, $urlRouterProvider, getDataFile, generateController, generateState) {

	$stateProvider.state("index", {
		url: "/index",
		controller: "IndexController",
		template: '<a ui-sref="screendefault"> goto </a>'
	}).state("debug", {
		url: "/debug",
		controller: "DebugController",
		templateUrl: "debug.html"
	});

	if (isDebugMode) {
		$urlRouterProvider.otherwise("debug")
	} else {
		$urlRouterProvider.otherwise("index")

		getDataFile(function(project) {
			console.log(project)

			screens = project.screens
			angular.forEach(screens, function(screen, screenId) {
				generateState($stateProvider, generateController, screenId, screen)
			})
		})
	}

}])


.controller("IndexController", function() {

	console.log("indexなう")
})

.controller("DebugController", ["$scope", "$http", "$state", "generateState", "generateController","runtimeStates", function($scope, $http, $state, generateState, generateController, runtimeStates) {
	$scope.number = "IDを入力"
	$scope.add = function(i) {
		if ($scope.number == "IDを入力") {
			$scope.number = "";
		}
		$scope.number = $scope.number + i
	}
	$scope.clear = function() {
		$scope.number = "IDを入力"
	}

	$scope.ok = function() {
		window.plugins.spinnerDialog.show("通信中", "データを取得しています");

		$http({
			method: "GET",
			url: "http:apply.ly:3000/project",
			params: {
				projectId: $scope.number
			}
		}).then(function(result) {
			project = result.data;
			console.log(project);
			screens = project.screens;
			angular.forEach(screens, function(screen, screenId) {
				generateState(runtimeStates.getStateProvider(), generateController, screenId, screen)
			})

			window.plugins.spinnerDialog.hide()
			$state.go("screen" + project.defaultScreen)

		}, function(data) {
			console.log(data)
			window.plugins.spinnerDialog.hide()
		})
	}

}])
