crosetModule = angular.module "Croset"

crosetModule

# アカウントごとのサービスの設定
.service "ServiceConfig", [() ->
	config = {
		componentScale: 1							# カードのサイズ
	}

	this.get = () ->
		return config

	this.update = (key, value) ->
		config[key] = value

	return

]

.service "ProjectData", ["$http", "$rootScope", "$stateParams", "$state", "ScreenCards", "ScreenElements", "Build", "ServiceConfig", ($http, $rootScope, $stateParams, $state, ScreenCards, ScreenElements, Build, ServiceConfig) ->
	this.projectId = null
	this.name = null
	this.screens = {}
	this.getScreens = () ->
		return this.screens

	currentScreenName = ""
	$rootScope.$on "onChangedScreen", (ev, screenName) ->		# ChildEditorControllerから呼ばれる
		currentScreenName = screenName

	$rootScope.$on "$stateChangeStart", (event, toState, toParams, fromState, fromParams) ->
		console.log toState
		if toState.name.match(/editor/)
			saveCurrentScreen()

	that = this
	saveCurrentScreen = () ->
		that.screens[currentScreenName] = {
			elements: ScreenElements.get()
			cards: ScreenCards.get()
			sourceCode: Build.compile ScreenCards.get()
		}

	this.get = () ->
		saveCurrentScreen()
		return {
			name: this.name
			projectId: this.projectId
			screens: this.screens
			defaultScreen: "トップ"
			config: ServiceConfig.get()

		}


	return
]



# 現在選択されている要素のUUID
.service "SelectedElementUUID", ["Elements", "SetElementProperty", "ScreenElements", (Elements, SetElementProperty, ScreenElements) ->
	uuid = null
	this.get = () -> return uuid

	this.set = (val) ->
		if val == uuid
			return

		if uuid && ScreenElements.get()[uuid]
			$ ScreenElements.get()[uuid].element							# 今選択されているElementを選択解除
				.resizable "destroy"

		uuid = val
		SetElementProperty val

		element = ScreenElements.get()[uuid].element

		onResizedOrDraged = (ev, ui) ->
			console.log element
			ScreenElements.set uuid, "top", element.css "top"
			ScreenElements.set uuid, "left", element.css "left"
			ScreenElements.set uuid, "width", element.width()
			ScreenElements.set uuid, "height", element.height()

			return

		$ element															# 選択
			.resizable {
				handles: "ne, se, sw, nw"
				minHeight: 3
				minWidth: 3
				stop: onResizedOrDraged
			}
			.draggable {
				cancel: null
				stop: () ->
					console.log "あああああ"
					onResizedOrDraged()
			}


	return
]


.controller "HeaderController", ["$scope", "$http", "$mdDialog", "$mdSidenav", "$timeout", "$interval", "$injector", "$stateParams", "ProjectData", ($scope, $http, $mdDialog, $mdSidenav, $timeout, $interval, $injector, $stateParams, ProjectData) ->

	# プロジェクト名と画面名を設定
	$scope.projectName = null
	$scope.screenName = $stateParams.screenName
	cancel = $interval () ->
		$scope.projectName = ProjectData.name
		if $scope.projectName
		 	console.log $scope.projectName
		 	$interval.cancel cancel
	, 50

	#サイドメニュー切り替え
	$scope.toggleSideNav = () ->
		$mdSidenav "side-menu"
			.toggle()
			.then () ->
				# $log.debug "toggle " + navID + " is done"

	# ビルドしてzipでダウンロード
	$scope.buildDownload = (ev) ->

		# ダイアログのController
		BuildDialogController = ["$scope", "$http", "$timeout", "$interval", "$window", ($scope, $http, $timeout, $interval, $window) ->
			# ビルド成功したプロジェクトをダウンロード
			$scope.download = () ->
				$mdDialog.hide()			# ダイアログを閉じる
				win = $window.open "/builded-projects/" + ProjectData.get().name + ".zip"		# ダウンロード


				stop = $interval () ->				# windowが閉じていることを確認 (TODO:もうすこしスマートな方法がありそう)
					if win.closed							# 閉じていたらサーバからプロジェクトファイルを削除

						$http {
							method : "DELETE"
							url : "/build"
							data: ProjectData.get()
							headers: {"Content-Type": "application/json;charset=utf-8"}
						}
						.success (data, status, headers, config) ->
							console.log "deleted"
							$interval.cancel stop

						.error (data, status, headers, config) ->
							console.log data
							$interval.cancel stop

				, 100

			# ビルド
			$http {
				method : "GET"
				url : "/build"
				params: ProjectData.get()
			}
			.success (data, status, headers, config) ->

				# ビルドが完了しているかを確認
				checkBuilded = () ->
					$http {
						method : "GET"
						url : "/builded"
						params: {
							projectId: ProjectData.get().name
						}
					}
					.success (data, status, headers, config) ->
						console.log data
						if data
							$timeout () ->
								checkBuilded()
							, 2000

						else
							$scope.done = true


					.error (data, status, headers, config) ->
						console.log "Failed", data

				checkBuilded()


			.error (data, status, headers, config) ->
				console.log "Failed", data

		]

		$mdDialog.show {
			controller: BuildDialogController
			templateUrl: 'templates/build-dialog.tmpl.html'
			parent: angular.element document.body
			targetEvent: ev
			clickOutsideToClose: false
		}
		.then (answer) ->
			return
		, () ->
			return


	# 実行
	$scope.run = (ev) ->
		console.log "------------実行結果--------------"
		saveProject()

		RunDialogController = ["$scope", ($scope) ->
			console.log ProjectData.get()
			$scope.projectId = ProjectData.get().projectId

			$scope.close = () ->
				$mdDialog.hide()
		]

		$mdDialog.show {
			controller: RunDialogController
			templateUrl: 'templates/run-dialog.tmpl.html'
			parent: angular.element document.body
			targetEvent: ev
			clickOutsideToClose: false
		}
		.then (answer) ->
			return
		, () ->
			return




	# プロジェクトを保存。関数を渡すと保存時に呼び出す
	saveProject = (fnc)->
		$http {
			method : "PUT"
			url : "/project"
			data: ProjectData.get()
		}
		.success (data, status, headers, config) ->
			console.log "Saved", data
			if fnc
				fnc()

		.error (data, status, headers, config) ->
			console.log "Failed", data

]

.controller "SelectScreenController", ["$scope", "$mdSidenav", "ProjectData", ($scope, $mdSidenav, ProjectData) ->
	$scope.screens = {}
	$scope.$on "onSelectScreen", () ->		# EditorController内でトリガー
		$scope.screens = ProjectData.getScreens()

	$scope.close = ()	->
		$mdSidenav("select-screen").close()
]

# エディタ画面のコントローラー
# projectDataResはresolveからinjectされる
.controller "EditorController", ["$scope", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$interval", "$mdSidenav", "$rootScope", "ScreenElements", "ScreenCards", "Elements",　"projectDataRes",
($scope, ElementDatas, $state, $stateParams, $http, ProjectData, $interval, $mdSidenav, $rootScope, ScreenElements, ScreenCards, Elements, projectDataRes) ->

	$scope.settings = {
		elementDatas: ElementDatas
	}

	$scope.mode = ""

	$scope.designMode = () -> $scope.mode = "design"
	$scope.programMode = () -> $scope.mode = "program"

	# スクリーン選択画面を開く時
	$scope.changeScreen = () ->
		console.log "toggle"
		$rootScope.$broadcast("onSelectScreen");		# SelectScreenController内で受け取り
		$mdSidenav "select-screen"
			.toggle()
			.then () ->
				console.log "toggled"

	# Mode Change
	$scope.modeList = {
		design:
			icon: "create"
		program:
			icon: "code"
	}

	$scope.changeMode = (name) ->
		console.log name
		$state.go "editor." + name

	# Progress bar
	$scope.progress = {
		determinateValue: 0
		isLoading: true
	}

	Elements.set "screen", angular.element "#screen"

	projectData = projectDataRes.data

	console.log projectData
	ProjectData.screens = projectData.screens
	ProjectData.name = projectData.name
	ProjectData.projectId = projectData.projectId
	ProjectData.defaultScreen = projectData.defaultScreen

	# 子stateが読み込まれたらプロジェクトをロード
	$rootScope.$on "onChangedScreen", (ev, screenName) ->		# ChildEditorControllerから呼ばれる
		console.log ProjectData, screenName
		nextScreen = ProjectData.getScreens()[screenName]
		nextScreen.elements ?= {}
		nextScreen.card ?= []
		changeScreen nextScreen.elements, nextScreen.cards

		# 読み込みのプログレスバー削除
		$scope.progress.isLoading = false
		$scope.progress.determinateValue += 100


	# 表示されている画面を変更
	changeScreen = (elements, cards) ->
		angular.forEach elements, (data, uuid) ->
			ScreenElements.addFromDataEditor data, uuid

		ScreenCards.list = cards


]

.controller "ChildEditorController", ["$scope", "$rootScope", "$stateParams", ($scope, $rootScope, $stateParams) ->
	console.log "child"
	$rootScope.$broadcast "onChangedScreen", $stateParams.screenName

]


# 画面
.controller "ScreenController", ["$scope", "$timeout", ($scope, $timeout) ->

	$scope.screenScaleRatio = 1
	editor = $ "#editor"
	screenZone = $  "#screen-zone"
	screenDefaultWidth = screenZone.width()
	screenDefaultHeight = screenZone.outerHeight()
	$(window).on("resize", () ->
		$timeout () ->
			height = editor.height() - 20
			$scope.screenScaleRatio = height / screenDefaultHeight
			$scope.marginRight = -1 * (screenDefaultWidth * (1 - $scope.screenScaleRatio))
			console.log $scope.screenScale
		, 0
	).trigger("resize")

]


# エディタ環境でのみ使u
.directive "crosetElementEditor", ()->
	return {
		restrict: "A"
		scope: false

		controller: ["$scope", "$element", "$attrs", "$compile", "ElementDatas", "SelectedElementUUID",
		($scope, $element, $attrs, $compile, ElementDatas, SelectedElementUUID) ->

			# クリック時
			$element.bind "mousedown", (e) ->
				SelectedElementUUID.set $attrs.uuid
				return

			SelectedElementUUID.set $attrs.uuid						# 追加した要素を選択された状態


		]

	}


# tag属性に書いてある値をタグとする空要素を作ってコンパイルする
.directive "crosetDynamicInput", ["$compile", ($compile) ->
	return {
		restrict: "E"
		scope: {
			tag: "="
			options: "="     # それぞれのインプットのデータ
		}
		compile: (element, attributes) ->
			return {
				pre: (scope, el, attrs) ->
					# make a new element having given tag name
					newEl = angular.element("<#{scope.tag}>").attr "options", angular.toJson scope.options
					# compile
					compiled = $compile(newEl[0]) scope
					el.append compiled
			}
		controller: ["$scope", "$attrs", "ScreenElements", "SelectedElementUUID"
		($scope, $attrs, ScreenElements, SelectedElementUUID) ->

			this.onchange = (value) ->
				ScreenElements.set SelectedElementUUID.get(), $scope.options.result, value

			this.onchange $scope.options.defaultValue
			return
		]
	}
]

.directive "crosetText", () ->
	return {
		restirct: "E"
		scope: {
			options: "="
		}
		templateUrl: "input-text.html"
	}

.directive "crosetHeadline", () ->
	return {
		restirct: "E"
		scope: {
			options: "="
		}
		templateUrl: "input-headline.html"
	}

.directive("crosetColorIcon", ["showColorPicker", "GetTextColor", "HexToRgb", (showColorPicker, GetTextColor, HexToRgb) ->
	return {
		restrict: "E"
		scope: {
			options: "="
		}
		require: "^crosetDynamicInput"
		templateUrl: "input-color-icon.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.onclick = ()->
				showColorPicker.showColorPicker (value)->
					setColor value
				, scope.color

			setColor = (value)->
				scope.color = value
				scope.textColor = GetTextColor HexToRgb value

				dynamicInput.onchange scope.color


			setColor(scope.options.defaultValue)

	}
])

.directive("crosetToggleIcon", ["ColorPallet", (ColorPallet) ->
	return {
		restrict: "E"
		scope: {
			options: "="
		}
		require: "^crosetDynamicInput"
		templateUrl: "input-toggle-icon.html"
		link: (scope, element, attrs, dynamicInput) ->

			getColor = () ->
				if scope.disabled
					return "#888"
				else
					return ColorPallet.mc

			if angular.isUndefined scope.options.disabled
				scope.disabled = true
			else
				scope.disabled = scope.options.disabled

			scope.color = getColor()

			scope.onclick = ()->
				scope.disabled = !scope.disabled
				scope.color = getColor()
				dynamicInput.onchange(!scope.disabled)				# 変更イベントを呼び出し

	}
])

.directive "crosetTextbox", ()->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-textbox.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value
	}

.directive "crosetTextarea", ()->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-textarea.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value
	}



.directive "crosetNumber", ()->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-number.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value
	}

.directive "crosetSlider", ["getUUID", (getUUID)->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-slider.html"

		link: (scope, element, attrs, dynamicInput) ->
			scope.id = getUUID()
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				console.log scope.value
				dynamicInput.onchange scope.value
	}
]

.directive "crosetSelect", ["getUUID", (getUUID)->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-select.html"

		link: (scope, element, attrs, dynamicInput) ->
			scope.id = getUUID()
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value

	}
]



.directive "resizer", [() ->
	return {
		restrict: "E"
		templateUrl: "resizer.html"
		link: (scope, element, attrs) ->

	}

]
