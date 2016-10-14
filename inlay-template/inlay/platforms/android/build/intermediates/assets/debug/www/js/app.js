
angular.module('Croset', ["ui.router", "ngAria", "ngMaterial", "ngAnimate", "ngMessages"])
// .config(function($stateProvider, $urlRouterProvider) {
// 	$stateProvider.state('run', {
// 		url: '/run',
// 		templateUrl: 'run.html',
// 		controller: "RunController"
// 	})
// 	.state('index', {
// 		url: '/',
// 		templateUrl: 'top.html'
// 	})
// 	$urlRouterProvider.otherwise("/");
// })
//

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

.controller("InlayCtrl", ["$scope", "$http", "$timeout", "Elements", "ScreenElements", function($scope, $http, $timeout, Elements, ScreenElements) {

	$scope.projects = []

	document.addEventListener("deviceready", function () {

		alert(cordova)
		html = {}
		js = ""
		window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/data.json",		// データファイル読み込み
			function(fileEntry) {										// 成功
				fileEntry.file(function(file) {

					var reader = new FileReader();
					reader.onloadend = function(e) {

						data = JSON.parse(this.result);

						console.log(data)
						html = data.html
						js = data.js

						// 画面に要素を追加
						angular.forEach(data.elements, function(data, uuid) {
							console.log(data)
							ScreenElements.addFromData(data, uuid);
						});

						console.log(data.sourceCode)
						eval(data.sourceCode)
					}

					reader.readAsText(file);
				});
			}, function(e) {
				console.log(e)
			}
		)


		Elements.set("screen", angular.element("#screen"));

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
	})
}])
