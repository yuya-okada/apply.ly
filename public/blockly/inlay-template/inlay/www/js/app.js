var isDebugMode = false;

// ログを全て記録する
var capturedLog = [];
(function(){
	var oldLog = console.log;
	console.log = function (message) {
		capturedLog.push({
			type: "log",
			arguments: arguments
		})
		oldLog.apply(console, arguments);
	};

	var oldError = console.error;
	console.error = function (message) {
		capturedLog.push({
			type: "error",
			arguments: arguments
		})
		oldError.apply(console, arguments);
	};

	var oldWarn = console.warn;
	console.warn = function (message) {
		capturedLog.push({
			type: "warn",
			arguments: arguments
		})
		oldWarn.apply(console, arguments);
	};

	// var oldInfo = console.info;
	// console.info = function (message) {
	// 	capturedLog.push({
	// 		type: "info",
	// 		arguments: arguments
	// 	})
	// 	oldInfo.apply(console, arguments);
	// };

})();

// スクロールを無効にする
$(function() {
	$(window).on('touchmove.noScroll', function(e) {
	    e.preventDefault();
	});
})


croset = angular.module('Croset', ["ui.router", "ngAria", "ngMaterial", "ngAnimate", "ngMessages", "ionic", "ngCordova"])

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

.constant("defaultScreen", {
	defaultScreen: null,
	get: function() {
		return this.defaultScreen
	},
	set: function(defaultScreen) {
		console.log(this)
		this.defaultScreen = defaultScreen
	}
})

.constant("generateController", function(screen, screenId, variables) {

	return ["$scope", "$state", "$mdSidenav", "ScreenElementsManager", "Elements", "ElementDatas", "$timeout", "$interval", "$cordovaSpinnerDialog", "RunProject", "ProjectData", function($scope, $state, $mdSidenav, ScreenElementsManager, Elements, ElementDatas, $timeout, $interval, $cordovaSpinnerDialog, RunProject, ProjectData) {
		Elements.set("screen", angular.element("#screen"));
		var screenElementsManager = new ScreenElementsManager(angular.element("#screen"), "public")

		// 画面のスタイルを設定
		$scope.screenStyle = screen.style

		// 要素を画面に追加
		angular.forEach(screen.elements, function(element, uuid) {
			screenElementsManager.addFromData(element, uuid);
		})
		angular.forEach(screen.templates, function (template, uuid) {
			screenElementsManager.addTemplateFromData(template, uuid);
		});

		// 読み込み終了後、ダイアログを閉じる
		$cordovaSpinnerDialog.hide();


		// 画面移動時に全てのintervalを止める
		var intervals = []
		stateGo = function(toState) {
			$state.go(toState);
			angular.forEach(intervals, function(interval) {
			    $interval.cancel(interval);
			});
			intervals = [];
		}

		var properties = {}
		angular.forEach(screen.varProperties, function(boxProperty, uuid) {
			angular.forEach(boxProperty, function(boxName, key) {
				if(!properties[boxName]) {
					properties[boxName] = []
				}

				properties[boxName].push({
					uuid: uuid,
					key: key
				});
				screenElementsManager.set(uuid, key, variables[boxName])
			})
		})

		angular.forEach(properties, function(property, boxName) {
			var value = variables[boxName];
			var omitOption = null;
			Object.defineProperty(variables, boxName, {
				get: function() {
					return value
				},
				set: function (val) {
					value = val
					for (var i = 0; i < property.length; i++) {
						option = property[i]
						if (omitOption && omitOption.key == option.key && omitOption.uuid == option.uuid) {
							omitOption = null
						} else {
							screenElementsManager.set(option.uuid, option.key, val)
						}
					}
				}
			})

			for (var i = 0; i < property.length; i++) {
				option = property[i]
				type = screenElementsManager.get(option.uuid).type
				properties = ElementDatas[type].properties
				angular.forEach(properties, function(obj) {
					angular.forEach(obj.propertyInputs, function(propertyInput) {
						angular.forEach(propertyInput, function(prop) {
							if (prop.sync) {
								var option_ = option
								$scope.$watch(function() {
									return screenElementsManager.get(option_.uuid).options[option_.key]
								}, function(newVal) {
									omitOption = option_
									variables[boxName] = newVal
								})

							}
						})
					})
				})

			}
		})

		var func = new Function("$scope", "$state", "$timeout", "$interval", "variables", "intervals", "stateGo", "screenElementsManager",  screen.sourceCode);			// ソースコードを実行


		try {
			func($scope, $state, $timeout, $interval, variables, intervals, stateGo, screenElementsManager);
		} catch(e) {
			var err = e.constructor('Error in Evaled Script: ' + e.message);
			// +3 because `err` has the line number of the `eval` line plus two.
			err.lineNumber = e.lineNumber - err.lineNumber + 3;
			throw err;
		}



		// 画面のリサイズ
		$scope.screenScaleRatio = 1
		sw = 375;
		sh = 667;
		$(window).on("resize", function() {
			$timeout(function() {

				ww = $(window).width();
				wh = $(window).height();

				console.log("たて", ww, wh, sw, sh);
				$scope.screenScaleRatio = ww / sw;



				// console.log($scope.screenScaleRatio)

			}, 0)
		}).trigger("resize")

		$scope.dial = {}
		// FABメニューのツールボックスを上手いことやる設定
		$scope.$watch('dial.isOpen', function(isOpen) {

			if (isOpen) {
				$timeout(function() {
			  	$scope.tooltipVisible = $scope.dial.isOpen;
				}, 600);
			} else {
				$scope.tooltipVisible = $scope.dial.isOpen;
			}
		});

		$scope.reload = function() {
			RunProject(ProjectData);
		}
		$scope.exit = function() {
			$state.go("debug")
		}
		$scope.showLog = function() {
			$mdSidenav("log-sidenav").toggle()
		}
		$scope.invisibleDial = function() {
			$scope.dial.isInvisible = true;
			$timeout(function() {
				$scope.dial.isInvisible = false;
			}, 5000);
		}

	}]
})

.factory("generateState", ["generateController", function(generateController) {

	return function($stateProvider, screenId, screen, $state, variables) {
		if($state && $state.get("screen" + screenId)) {
				$state.get("screen" + screenId).controller = generateController(screen, screenId, variables);
		} else {
			$stateProvider.state("screen" + screenId, {
				url: "/screen" + screenId,
				templateUrl: "templates/screen.html",
				controller: generateController(screen, screenId, variables)
			})
		}
	}
}])

.value("ProjectData", {})


.factory("RunProject", ["$state", "runtimeStates", "generateState", "ProjectData", function($state, runtimeStates, generateState, ProjectData) {
	return function(project) {

		console.log(project);

		// ProjectDataに展開
		for (var property in ProjectData) {
			delete ProjectData[property]
		}
		ProjectData = {}
		Object.assign(ProjectData, project);

		screens = project.screens;

		// 全画面共通の変数を初期化する
		project.variables = project.variables || {}
		var variables = {}
		for(var variable in project.variables) {
			variables[variable] = null
		}

		angular.forEach(screens, function(screen, screenId) {
			generateState(runtimeStates.getStateProvider(), screenId, screen, $state, variables)
		})
		window.plugins.spinnerDialog.hide()

		$state.go("screen" + project.defaultScreen)
	}
}])

.config(["$stateProvider", "$urlRouterProvider", "getDataFile", "generateController", function($stateProvider, $urlRouterProvider, getDataFile, generateController) {

	$stateProvider.state("index", {
		url: "/",
		controller: "IndexController",
		templateUrl: "logo.html"
	}).state("debug", {
		url: "/debug",
		controller: "DebugController",
		templateUrl: "debug.html"
	});

	if (isDebugMode) {
		$urlRouterProvider.otherwise("/debug")
	} else {
		$urlRouterProvider.otherwise("/")

		//
		// getDataFile(function(project) {
		// 	console.log(project)
		//
		// 	Object.assign(ProjectData, project); // 結果をProjectDataに展開
		//
		// 	var variables = {}
		//
		//
		// 	defaultScreen.set("screen" + project.defaultScreen)
		// 	screens = project.screens
		// 	angular.forEach(screens, function(screen, screenId) {
		// 		generateState($stateProvider, generateController, screenId, screen, variables)
		// 	})
		// })


	}

}])


.controller("IndexController", ["$scope", "$state", "$timeout", "getDataFile", "RunProject", function($scope, $state, $timeout, getDataFile, RunProject) {
	var loadedFiles = null;
	var isTimeouted = false;

	getDataFile(function(project) {
		if (isTimeouted) {
			RunProject(project);
		} else {
			loadedFiles = project;
		}
	})

	$timeout(function() {
		if (loadedFiles) {
			RunProject(loadedFiles);
		} else {
			isTimeouted = true;
		}
	}, 4000)
	// console.log("indexなう")
}])


.controller("LogDialogController", ["$scope", function($scope) {
	$scope.logs = capturedLog
}])

.controller("DebugController", ["$scope", "$http", "$cordovaSpinnerDialog", "$ionicViewSwitcher", "RunProject", function($scope, $http, $cordovaSpinnerDialog, $ionicViewSwitcher, RunProject) {
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
	$ionicViewSwitcher.nextDirection('forward');
	$scope.ok = function() {
		$cordovaSpinnerDialog.show("通信中", "データを取得しています");

		$http({
			method: "GET",
			url: "http:apply.ly:3000/project",
			params: {
				projectId: $scope.number
			}
		}).then(function(result) {

			project = result.data;
			if (project) {
				RunProject(project);
			} else {
				window.plugins.spinnerDialog.hide()
			}

		}, function(data) {
			console.log(data)
			window.plugins.spinnerDialog.hide()
		})
	}

}])
