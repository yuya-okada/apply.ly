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


.service "CurrentScreenData", [() ->
	this.id = ""
	this.elementsManager = null
	that = this
	this.getElementsManager = () ->
		return that.elementsManager

	return
]


.service "ProjectData", ["$http", "$rootScope", "$stateParams", "$state", "ScreenCards", "ScreenElementsManager", "Build", "ServiceConfig", "getUUID", "CurrentScreenData", ($http, $rootScope, $stateParams, $state, ScreenCards, ScreenElementsManager, Build, ServiceConfig, getUUID, CurrentScreenData) ->


	this.projectId = null
	this.name = null
	this.screens = {}
	this.defaultScreen = "トップ"
	this.valiables = []
	this.getScreens = () ->
		return this.screens

	CurrentScreenData.id = this.defaultScreen

	# ChildEditorControllerから呼ばれる。画面が変更された時、それを適応するイベント
	$rootScope.$on "onChangedScreen", (ev, screenId) ->
		CurrentScreenData.id = screenId

	that = this

	this.init = () ->
		that.callback = []
		that.projectId = null
		that.name = null
		that.screens = {}
		that.defaultScreen = "トップ"
		that.valiables = []

	# プロジェクトは変えずに別の画面に移動した時、自動的に遷移前の画面を保存する
	$rootScope.$on "$stateChangeStart", (event, toState, toParams, fromState, fromParams) ->
		if toState.name.match(/editor/) && toParams.projectId == that.projectId + ""
			saveCurrentScreen()


	# 現在の画面を保存する関数
	saveCurrentScreen = () ->

		angular.extend that.screens[CurrentScreenData.id], {
			elements: CurrentScreenData.elementsManager.get()
			cards: Build.parse()
			sourceCode: Build.build()
		}

	# 当たらな画面を追加する。
	# 同名画面がすでにある場合falseを返し処理を中断し、成功した場合trueを返す
	this.addScreen = (name) ->

		if that.getScreenByName name
			return false
		else
			this.screens[getUUID()] = {
				elements: {}
				cards: []
				sourceCode: ""
				name: name
			}

			trigerCallback()					# 画面の変更イベントをトリガー
			return true


	this.renameScreen = (id, newName) ->
		if that.getScreenByName newName
			return false
		else
			that.screens[id]?.name = newName
			trigerCallback()					# 画面の変更イベントをトリガー
			return true

	this.removeScreen = (id) ->
		if that.screens[id]
			delete that.screens[id]
			trigerCallback()					# 画面の変更イベントをトリガー
			return true
		else
			return false

	# 与えられた名前をもつ画面のidを検索
	this.getScreenByName = (name) ->
		for id, screen of that.screens
			console.log screen, name
			if screen.name == name
				return id

		return null

	# 関数を渡しておくと、画面名や画面数が変更される時に呼び出す
	that.callbacks = []
	this.setCallback = (fnc) ->
		that.callbacks.push fnc
	# 全てのコールバックを呼び出し
	trigerCallback = () ->
		for callback in that.callbacks
			callback()

	# 新しい変数を追加
	this.addValiable = (name) ->
		if that.valiables.indexOf(name) == -1
			that.valiables.push name
			that.trigetCallbackVal()
			return true
		else
			return false

	# 関数を渡しておくと、変数名や変数数が変更されるたびに呼び出す
	callbacksVal = []
	this.onChangeValiables = (fnc) ->
		callbacksVal.push fnc
	# 全てのコールバックを呼び出し
	this.trigetCallbackVal = () ->
		for callback in callbacksVal
			callback(that.valiables)

	this.get = () ->
		saveCurrentScreen()
		return {
			name: this.name
			projectId: this.projectId
			screens: this.screens
			defaultScreen: this.defaultScreen
			config: ServiceConfig.get()
			valiables: this.valiables

		}


	return
]



# 現在選択されている要素のUUID
.service "SelectedElementUUID", ["Elements", "SetElementProperty", "CurrentScreenData", (Elements, SetElementProperty, CurrentScreenData) ->

	uuid = null

	this.init = ()->
		uuid = null

	this.get = () -> return uuid

	this.set = (val) ->
		screenElements = CurrentScreenData.elementsManager
		if uuid && screenElements.get()[uuid]
			console.log screenElements.get()[uuid].element

			selectedElement = $(screenElements.get()[uuid].element)
			console.log(selectedElement, "トェっっっっっっっっっw")
			if selectedElement.data("ui-resizable")							# 今選択されているElementのリサイザブルを削除
				console.log("aaaa")
				selectedElement.resizable "destroy"

		uuid = val
		SetElementProperty val

		element = screenElements.get()[uuid].element

		onResizedOrDraged = (ev, ui) ->
			console.log element
			screenElements.set uuid, "top", element.css "top"
			screenElements.set uuid, "left", element.css "left"
			screenElements.set uuid, "width", element.width()
			screenElements.set uuid, "height", element.height()

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
					onResizedOrDraged()
			}


	return
]


.controller "HeaderController", ["$scope", "$http", "$mdDialog", "$mdSidenav", "$timeout", "$interval", "$injector", "$stateParams", "$mdToast", "ProjectData", ($scope, $http, $mdDialog, $mdSidenav, $timeout, $interval, $injector, $stateParams, $mdToast, ProjectData) ->

	# プロジェクト名と画面名を設定
	$scope.projectName = null
	$scope.screenId = $stateParams.screenId
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
	$scope.save = (ev) ->
		saveProject ()->
			$mdToast.show(
				$mdToast.simple()
				.textContent '保存しました'
				.position "right top"
				.hideDelay 3000
			)


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

.controller "SelectScreenController", ["$scope", "$mdSidenav", "$injector", "$state", "$mdDialog", "$mdToast", "ProjectData", "ScreenElementsManager", ($scope, $mdSidenav, $injector, $state, $mdDialog, $mdToast, ProjectData, ScreenElementsManager) ->

	$scope.projectId = $injector.get("$stateParams").projectId
	$scope.defaultScreen = ProjectData.defaultScreen
	$scope.screens = {}
	$scope.$on "onSelectScreen", () ->		# EditorController内でトリガー
		$scope.screens = ProjectData.getScreens()
		# for id, screen of $scope.screens
		# 	ScreenElementsManager.init()
		# 	for uuid, data of screen.elements
		# 		ScreenElementsManager.addFromData data, uuid, element.find ""


	$scope.$on 'repeatFinishedEventFired', (ev, element) ->
		screen = ev.targetScope.screen
		console.log screen, ev.target
		screenElementsManager = new ScreenElementsManager(element.find ".select-screen-preview")
		for uuid, data of screen.elements
			screenElementsManager.addFromData data, uuid


	$scope.onclick = (id) ->
		goScreen id
		$scope.close()

	$scope.close = ()	->
		$mdSidenav("select-screen").close()

	# 画面をトップ画面に設定する
	$scope.setAsTop = (id) ->
		ProjectData.defaultScreen = id
		$scope.defaultScreen = ProjectData.defaultScreen

	# 画面の名前を変更
	$scope.rename = (ev, id) ->
		confirmScreenName ev, "画面の名前を変更", (newName) ->
			result = ProjectData.renameScreen id, newName
			console.result
			if result
				$scope.screens = ProjectData.getScreens()

			else
				$mdToast.show(
						$mdToast.simple()
						.textContent　"その名前の画面はすでに存在します"
						.hideDelay 3000
				)

	$scope.remove = (ev, id) ->
		confirm = $mdDialog.confirm()
			.title "削除"
			.content "'" + ProjectData.getScreens()[id].name + "' を削除します"
			# .ariaLabel 'Lucky day'
			.targetEvent ev
			.ok "OK"
			.cancel "キャンセル"

		$mdDialog.show(confirm).then () ->
			ProjectData.removeScreen id
		, () ->

	# 画面を追加
	$scope.create = (ev) ->
		confirmScreenName ev, "新しい画面を追加", (name) ->
			result = ProjectData.addScreen name
			if result		# 成功した場合
			else		# 同名画面がすでにある場合
				$mdToast.show(
						$mdToast.simple()
						.textContent　"エラー：同名の画面がすでに存在します"
						.hideDelay 3000
				)

	# 画面の名前を訪ねるダイアログを表示
	confirmScreenName = (ev, title, fnc) ->
		confirm = $mdDialog.prompt()
			.title title
			.textContent "新しい画面の名前を入力してください"
			.targetEvent ev
			.ok "OK"
			.cancel "キャンセル"

		$mdDialog.show(confirm).then (name) ->
			fnc(name)

		, () ->



	$scope.openMore = ($mdOpenMenu, ev) ->
		$mdOpenMenu ev


	# 与えられた名前の画面へ遷移
	goScreen = (id) ->
		$stateParams = $injector.get "$stateParams"
		$state.go "editor.design", {projectId: $stateParams.projectId , screenId: id}

]

# エディタ画面のコントローラー
# projectDataResはresolveからinjectされる
.controller "EditorController", ["$scope", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$interval", "$mdSidenav", "$rootScope", "ScreenElementsManager", "ScreenCards", "Elements", "SelectedElementUUID", "CurrentScreenData", "projectDataRes",
($scope, ElementDatas, $state, $stateParams, $http, ProjectData, $interval, $mdSidenav, $rootScope, ScreenElementsManager, ScreenCards, Elements, SelectedElementUUID, CurrentScreenData, projectDataRes) ->

	SelectedElementUUID.init()

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
		$state.go "editor." + name, {screenId: CurrentScreenData.id}

	# Progress bar
	$scope.progress = {
		determinateValue: 0
		isLoading: true
	}

	Elements.set "screen", angular.element "#screen"

	projectData = projectDataRes.data

	console.log projectData
	ProjectData.init()
	ProjectData.screens = projectData.screens
	ProjectData.name = projectData.name
	ProjectData.projectId = projectData.projectId
	ProjectData.defaultScreen = projectData.defaultScreen
	ProjectData.valiables = projectData.valiables

	# 子stateが読み込まれたらプロジェクトをロード
	$rootScope.$on "onChangedScreen", (ev, screenId) ->		# ChildEditorControllerから呼ばれる
		console.log ProjectData, screenId
		screenId = screenId || ProjectData.defaultScreen
		nextScreen = ProjectData.getScreens()[screenId]
		nextScreen.elements ?= {}
		nextScreen.card ?= []
		changeScreen nextScreen.elements, nextScreen.cards

		# 読み込みのプログレスバー削除
		$scope.progress.isLoading = false
		$scope.progress.determinateValue += 100


	# 表示されている画面を変更
	changeScreen = (elements, cards) ->
		newScreenElementsManager = new ScreenElementsManager($("#screen"))
		CurrentScreenData.elementsManager = newScreenElementsManager
		angular.forEach elements, (data, uuid) ->
			newScreenElementsManager.addFromDataEditor data, uuid

		ScreenCards.list = cards


	$rootScope.$broadcast "onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen
]

.controller "ChildEditorController", ["$scope", "$rootScope", "$stateParams", "ProjectData", ($scope, $rootScope, $stateParams, ProjectData) ->
	console.log "child", $stateParams.screenId
	$rootScope.$broadcast "onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen

]


# 画面
.controller "ScreenController", ["$scope", "$timeout", ($scope, $timeout) ->

	$scope.screenScaleRatio = 1
	editor = $ "#editor"
	screenZone = $  "#screen-zone"
	screenDefaultWidth = screenZone.width()
	screenDefaultHeight = screenZone.outerHeight()
	console.log "Original Screen Size", {
		width: screenDefaultWidth
		height: screenDefaultHeight
	}

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
		controller: ["$scope", "$attrs", "CurrentScreenData", "SelectedElementUUID"
		($scope, $attrs, CurrentScreenData, SelectedElementUUID) ->

			this.onchange = (value) ->
				CurrentScreenData.elementsManager.set SelectedElementUUID.get(), $scope.options.result, value

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
