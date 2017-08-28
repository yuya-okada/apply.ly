crosetModule = angular.module "Croset"

crosetModule



.service "CurrentScreenData", [() ->
	this.id = ""
	this.elementsManager = null
	that = this
	this.workspace = null
	this.getElementsManager = () ->
		return that.elementsManager
	
	this.style = {}
	
	return
]


.service "ProjectData", ["$http", "$rootScope", "$stateParams", "$state", "ScreenElementsManager", "getUUID", "CurrentScreenData", ($http, $rootScope, $stateParams, $state, ScreenElementsManager, getUUID, CurrentScreenData) ->


	this.projectId = null
	this.name = null
	this.screens = {}
	this.defaultScreen = "トップ"
	this.variables = {}
	this.config = {}
	this.scripts = {}
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
		that.variables = {}

	$rootScope.$on "$stateChangeStart", (event, toState, toParams, fromState, fromParams) ->
		$state.current = toState
		# if fromState.name.match(/program/)
		# 	# プロジェクトは変えずに別の画面に移動した時、自動的に遷移前の画面を保存する
		# 	that.screens[CurrentScreenData.id]?.card = Blockly.Xml.domToText Blockly.Xml.workspaceToDom CurrentScreenData.workspace
		# 	that.screens[CurrentScreenData.id]?.sourceCode = Blockly.JavaScript.workspaceToCode CurrentScreenData.workspace
		if toState.name.match(/editor/)
			# プロジェクトは変えずに別の画面に移動した時、自動的に遷移前の画面を保存する
			if toParams.projectId == that.projectId + ""
				saveCurrentScreen()
			

	
		
	# 現在の画面を保存する関数
	saveCurrentScreen = () ->
	
		if CurrentScreenData.workspace
			xml = Blockly.Xml.workspaceToDom CurrentScreenData.workspace
			cards = Blockly.Xml.domToText xml
			sourceCode = Blockly.JavaScript.workspaceToCode CurrentScreenData.workspace
			

		else
			cards = that.screens[CurrentScreenData.id]?.cards
			sourceCode = that.screens[CurrentScreenData.id]?.sourceCode
		
		
		angular.extend that.screens[CurrentScreenData.id], {
			elements: CurrentScreenData.elementsManager.get()
			templates: CurrentScreenData.elementsManager.getTemplates()
			cards: cards
			sourceCode: sourceCode
			varProperties: CurrentScreenData.elementsManager?.varProperties
			style: CurrentScreenData.style
		}

	# 当たらな画面を追加する。
	# 同名画面がすでにある場合falseを返し処理を中断し、成功した場合trueを返す
	this.addScreen = (name) ->

		if that.getScreenByName name
			return false
		else
			this.screens[getUUID()] = {
				elements: {}
				cards: ""
				sourceCode: ""
				name: name
			}

			triggerCallback()					# 画面の変更イベントをトリガー
			return true
			
			
	this.renameScreen = (id, newName) ->
		if that.getScreenByName newName
			return false
		else
			that.screens[id]?.name = newName
			triggerCallback()					# 画面の変更イベントをトリガー
			return true

	this.removeScreen = (id) ->
		if that.screens[id]
			delete that.screens[id]
			triggerCallback()					# 画面の変更イベントをトリガー
			return true
		else
			return false

	# 与えられた名前をもつ画面のidを検索
	this.getScreenByName = (name) ->
		for id, screen of that.screens
			if screen.name == name
				return id

		return null

	# 関数を渡しておくと、画面名や画面数が変更される時に呼び出す
	this.callbacks = []
	this.setScreenCallback = (fnc) ->
		that.callbacks.push fnc

	# 全てのコールバックを呼び出し
	triggerCallback = () ->
		for callback in that.callbacks
			callback()
	
	
	CrosetBlock.addVariable = (newName) ->
		that.variables[getUUID()] = {
			name: newName
		}
	# blockly/core/workspace.jsから
	CrosetBlock.renameVariable = (oldName, newName) ->
		for id, name of that.variables
			if that.variables[id].name == oldName
				that.variables[id].name = newName
				break
					
		that.triggerCallbackVar()
		
		
	# blockly/core/workspace.jsから
	CrosetBlock.deleteVariable = (name) ->
		vId = ""
		for id, name of that.variables
			if that.variables[id].name == name
				delete that.variables[id].name
				varId = id
				
		for id, properties of	CurrentScreenData.elementsManager?.varProperties
			for key, varId of properties
				if varId == vId
					CurrentScreenData.elementsManager?.removeVarToProperty id, key
		
		
		that.triggerCallbackVar()

	# 関数を渡しておくと、変数名や変数数が変更されるたびに呼び出す
	callbacksVar = []
	this.onVariablesChanged = (fnc) ->
		callbacksVar.push fnc
	# 全てのコールバックを呼び出し
	this.triggerCallbackVar = () ->
		for callback in callbacksVar
			if CurrentScreenData.workspace
				callback CurrentScreenData.workspace.variableList
			else
				callback(that.variables)

			
			
	this.get = () ->
		saveCurrentScreen()
		projectData = {
			name: this.name
			projectId: this.projectId
			screens: this.screens
			defaultScreen: this.defaultScreen
			variables: this.variables
			config: this.config
			scripts: this.scripts
		}
		console.log "Builded", projectData
		return projectData


	return
]


.service "SelectedElementOrTemplateUUID", ["VisiblePropertyCards", "CurrentScreenData", (VisiblePropertyCards, CurrentScreenData) ->
	uuid = null
	isTemplate = null
	that = this

	this.get = () ->
		return uuid
	
	this.set = (id, isTemplate_) ->
		uuid = id
		isTemplate = isTemplate_
		
	this.isTemplate = () ->
		return isTemplate
	
	this.init = () ->
		
		
		$("#screen-wrapper").removeClass "show-template"

		screenElements = CurrentScreenData.elementsManager
		if uuid && screenElements.get(uuid) && !isTemplate

			selectedElement = $(screenElements.get(uuid).element)
			if selectedElement.data("ui-resizable")							# 今選択されているElementのリサイザブルを削除
				selectedElement.resizable "destroy"

		$(".croset-resizable-parent").removeClass "croset-resizable-parent"
		$(".ui-resizable").removeClass "ui-resizable"
		
		uuid = null
		isTemplate = null
		VisiblePropertyCards.set([]);
	return 
		
]

# 現在選択されている要素のUUID
.service "SelectedElementUUID", ["SelectedElementOrTemplateUUID", "SetElementProperty", "VisiblePropertyCards", "CurrentScreenData", "$rootScope", (SelectedElementOrTemplateUUID, SetElementProperty, VisiblePropertyCards, CurrentScreenData, $rootScope) ->

	uuid = null
	that = this

	this.init = ()->
		uuid = null
		VisiblePropertyCards.set([]);

	this.get = () -> return uuid

	this.set = (val) ->
	
		SelectedElementOrTemplateUUID.init()
		
		screenElements = CurrentScreenData.elementsManager
		uuid = val
		SetElementProperty val

		element = screenElements.get(uuid).element

		onResizedOrDraged = (ev, ui) ->
			screenElements.set uuid, "top", element.css "top"
			screenElements.set uuid, "left", element.css "left"
			if screenElements.get(uuid)?.unresizable != "xy"
				screenElements.set uuid, "width", element.width()
				screenElements.set uuid, "height", element.height()


			return


		# design.jsのPropertyController内で受け取り
		$rootScope.$broadcast "onResizedOrDragging", element
		click = {
			x: 0
			y: 0
		}

		$ element															# 選択
			.draggable {
				cancel: null
				start: (ev) ->
					click.x = ev.clientX
					click.y = ev.clientY

				drag: (ev, ui)->
						# design.jsのPropertyController内で受け取り
					$rootScope.$broadcast "onResizedOrDragging", element

					screenScaleRatio = angular.element("#screen").scope().screenScaleRatio

					original = ui.originalPosition;
					ui.position = {
						left: (ev.clientX - click.x + original.left) / screenScaleRatio
						top:  (ev.clientY - click.y + original.top ) / screenScaleRatio
					}

				stop: () ->
					onResizedOrDraged()
					# design.jsのPropertyController内で受け取り
					$rootScope.$broadcast "onResizedOrDraged", element

					if screenElements.get(uuid)?.unresizable == "xy"
						$(element).css "width", ""
						$(element).css "height", ""

			}

		if screenElements.get(uuid).unresizable == "xy"
			element.addClass "ui-resizable"
		else
			$ element
				.resizable {
					handles: "ne, se, sw, nw"
					minHeight: 3
					minWidth: 3
					resize: () ->
						# design.jsのPropertyController内で受け取り
						$rootScope.$broadcast "onResizedOrDragging", element
					stop: () ->
						onResizedOrDraged()
						# design.jsのPropertyController内で受け取り
						$rootScope.$broadcast "onResizedOrDraged", element
				}
			
			handleRatio = 1 / $("#screen").scope().screenScaleRatio
			$(".ui-resizable-handle").css "transform", "scale(#{handleRatio})"
				
		# もしも親要素が存在するなら、
		parentElement = $(element).parent()
		if parentElement.hasClass "croset-element-group-div"
			parentElement.addClass "croset-resizable-parent"


		if CurrentScreenData.workspace
			CurrentScreenData.workspace.toolbox_.refreshSelection()

		SelectedElementOrTemplateUUID.set uuid
		
	return
]



# テンプレートを画面に表示
.service "SelectedTemplate", ["SelectedElementOrTemplateUUID", "SetElementProperty", "CurrentScreenData", (SelectedElementOrTemplateUUID, SetElementProperty, CurrentScreenData) ->
	uuid = ""
	this.get = ()-> return uuid
	this.set = (id) ->
		uuid = id
		$("#screen-wrapper").addClass "show-template"
		screenElementsManager = CurrentScreenData.elementsManager
		SetElementProperty id, true
		screenElementsManager.showTemplate id
		
		SelectedElementOrTemplateUUID.set id, true

	return
]


# リスト形式でアイテムを選択するモードに変更（主にProgramタブで使用）
.factory "ListItemSelect", ["$timeout", ($timeout) ->
	return {
		open: (id) ->
			$("#screen-wrapper").addClass "list-item-select-mode"
			return
		close: (id) ->
			$("#screen-wrapper").removeClass "list-item-select-mode"
			return
	}
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
						.then (result) ->
							$interval.cancel stop

						, (result) ->
							$interval.cancel stop

				, 100

			# ビルド
			$http {
				method : "GET"
				url : "/build"
				params: ProjectData.get()
			}
			.then (result) ->
				data = result
				# ビルドが完了しているかを確認
				checkBuilded = () ->
					$http {
						method : "GET"
						url : "/builded"
						params: {
							projectId: ProjectData.get().name
						}
					}
					.then (result) ->
						data = result
						if data
							$timeout () ->
								checkBuilded()
							, 2000

						else
							$scope.done = true


					, (result) ->
						data = result
						console.log "Failed", data

				checkBuilded()


			, (result) ->
				data = result
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

	$scope.config = (ev) ->
		
		ConfigDialogController = ["$scope", "ProjectData", "$mdDialog", ($scope, ProjectData, $mdDialog) ->
			$scope.headings = {
				"server": "サーバー"
			}
			$scope.currentHeading = "server"
			$scope.changeHeading = (heading) ->
				$scope.currentHeading = heading
				
			$scope.config = angular.merge {
				server: {}
			}, ProjectData.config
			
			$scope.cancel = () ->
				$mdDialog.hide()
			
			$scope.ok = () ->
				ProjectData.config = $scope.config
				$mdDialog.hide()
		]

		$mdDialog.show {
			controller: ConfigDialogController
			templateUrl: 'templates/config-dialog.tmpl.html'
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
		
		
		# jQueryがたまに無限参照をしててstringifyできないのでとりのぞく
		replacer = (key, value) ->
			if value instanceof jQuery
				return undefined
			
			return value
		
		$http {
			method : "PUT"
			url : "/project"
			data: JSON.parse JSON.stringify ProjectData.get(), replacer			# TODO: 多分なんかもっといい方法がある
		}
		.then (result) ->
			data = result.data
			console.log "Saved", data
			if fnc
				fnc()

		, (result) ->
			console.log "Failed", result

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
.controller "EditorController", ["$scope", "getUUID", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$timeout", "$interval", "$mdToast", "$mdSidenav", "$rootScope", "$mdDialog", "ScreenElementsManager", "Elements", "SelectedElementUUID", "CurrentScreenData", "projectDataRes",
($scope, getUUID, ElementDatas, $state, $stateParams, $http, ProjectData, $timeout, $interval, $mdToast, $mdSidenav, $rootScope, $mdDialog, ScreenElementsManager, Elements, SelectedElementUUID, CurrentScreenData, projectDataRes) ->

	SelectedElementUUID.init()

	$scope.settings = {
		elementDatas: ElementDatas
	}

	$scope.mode = ""

	$scope.designMode = () -> $scope.mode = "design"
	$scope.programMode = () -> $scope.mode = "program"

	# スクリーン選択画面を開く時
	$scope.changeScreen = () ->
		$rootScope.$broadcast("onSelectScreen");		# SelectScreenController内で受け取り
		$mdSidenav "select-screen"
			.toggle()
			.then () ->
				return

	# Mode Change
	$scope.modeList = {
		design:
			icon: "create"
		program:
			icon: "code"
	}
	$scope.secondModeList = {
		server:
			icon: "settings_ethernet"
		script:
			icon: "description"
	}

	$scope.changeMode = (name) ->
		if name == "server"
			if ProjectData.config?.server

				# Initialize Firebase
				config = {
					apiKey: ProjectData.config.server.apiKey
					authDomain:  ProjectData.config.server.authDomain
					databaseURL:  ProjectData.config.server.databaseURL
					projectId:  ProjectData.config.server.projectId
					storageBucket:  ProjectData.config.server.storageBucket
					messagingSenderId:  ProjectData.config.server.messagingSenderId
				}
				
				init = () ->
					try 
						firebase.initializeApp config
					catch	error

						$mdToast.show(
							$mdToast.simple()
							.textContent 'firebaseを正しく設定してください'
							.position "right bottom"
							.hideDelay 3000
						)
						return

					$state.go "editor.server", {screenId: CurrentScreenData.id}

				
				apps = firebase.apps
				if apps.length != 0
					firebase.app().delete().then init
				else 
					init()
				
		
			else
				$mdToast.show(
					$mdToast.simple()
					.textContent 'firebaseを設定してください'
					.position "right bottom"
					.hideDelay 3000
				)
			
		else
						
		$state.go "editor." + name, {screenId: CurrentScreenData.id}

	# Progress bar
	$scope.progress = {
		determinateValue: 0
		isLoading: true
	}

	Elements.set "screen", angular.element "#screen"

	projectData = projectDataRes.data
	console.log "プロジェクト読み込み", projectData

	ProjectData.init()
	ProjectData.screens = projectData.screens
	ProjectData.scripts = projectData.scripts
	ProjectData.name = projectData.name
	ProjectData.projectId = projectData.projectId
	ProjectData.defaultScreen = projectData.defaultScreen
	ProjectData.config = projectData.config
	if projectData.variables
		ProjectData.variables = projectData.variables

	# 子stateが読み込まれたらプロジェクトをロード
	$rootScope.$on "onChangedScreen", (ev, screenId) ->		# ChildEditorControllerから呼ばれる
		screenId = screenId || ProjectData.defaultScreen
		nextScreen = ProjectData.getScreens()[screenId]
		nextScreen.elements ?= {}
		nextScreen.card ?= ""
		nextScreen.templates ?= {}
		nextScreen.style ?= {}
		changeScreen nextScreen.elements, nextScreen.cards, nextScreen.templates, nextScreen.varProperties, nextScreen.style

		# 読み込みのプログレスバー削除
		$scope.progress.isLoading = false
		$scope.progress.determinateValue += 100


	# 表示されている画面を変更
	changeScreen = (elements, cards, templates, varProperties, style) ->
		newScreenElementsManager = new ScreenElementsManager $("#screen")
		CurrentScreenData.elementsManager = newScreenElementsManager
		CurrentScreenData.workspace = null
		CurrentScreenData.style = style
		
		angular.forEach elements, (data, uuid) ->
			newScreenElementsManager.addFromData data, uuid

		angular.forEach templates, (data, uuid) ->
			newScreenElementsManager.addTemplateFromData data, uuid
		
		varProperties ?= {}
		newScreenElementsManager.varProperties = varProperties
		
			
	$scope.isVarToolbarOpen = false
	$scope.openVarToolbar = () ->
		if $state.current.name != "editor.program"
			if cancel
				$timeout.cancel cancel
			$("#var-fab-toolbar").css "width", "100%"
			$scope.vars = ProjectData.variables
			$scope.isVarToolbarOpen = true
	
	cancel = null
	$scope.closeVarToolbar = () ->
		$scope.isVarToolbarOpen = false

		cancel = $timeout () ->
			$("#var-fab-toolbar").css "width", ""
		, 1000
		
		
	
	$scope.$state = $state
	$scope.addVariable = (ev) ->
		confirm = $mdDialog.prompt()
			.title '新しいを変数'
			.textContent "新しい変数を追加します。"
			.placeholder ''
			.ariaLabel '名前を入力'
			.targetEvent ev
			.ok 'OK'
			.cancel 'キャンセル'

		$mdDialog.show(confirm).then (result) ->
			for varId, varName of ProjectData.variables
				if varName = result
					$mdToast.show(
						$mdToast.simple()
						.textContent 'その名前の変数はすでに存在します'
						.position "right bottom"
						.hideDelay 3000
					)
					return 
			
			ProjectData.variables[getUUID()] = {
				name: result
			}
		
		, () ->
			return
		
	$scope.onVariableClicked = (ev, varId) ->
		
		if $state.current.name == "editor.server"
			ev.stopPropagation()
			
			$mdDialog.show {
				controller: "ServerBindDialogController"
				templateUrl: 'templates/server-bind-dialog.tmpl.html'
				parent: angular.element document.body
				targetEvent: ev
				clickOutsideToClose: false
				locals: {
					varId: varId
				}
			}
			.then (answer) ->
				return
			, () ->
				return
		
 		
	$rootScope.$broadcast "onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen
]

.controller "ChildEditorController", ["$scope", "$rootScope", "$stateParams", "ProjectData", ($scope, $rootScope, $stateParams, ProjectData) ->
	$rootScope.$broadcast "onChangedScreen", $stateParams.screenId || ProjectData.defaultScreen

]


# 画面
.controller "ScreenController", ["$scope", "$timeout", "ListItemSelect", "SelectedElementUUID", "SelectedElementOrTemplateUUID", "CurrentScreenData", "ElementDatas",  ($scope, $timeout, ListItemSelect, SelectedElementUUID, SelectedElementOrTemplateUUID, CurrentScreenData, ElementDatas) ->
	
	$scope.currentScreenData = CurrentScreenData
	
	
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

			handleRatio = 1 / $scope.screenScaleRatio
			$(".ui-resizable-handle").css "transform", "scale(#{handleRatio})"
		, 0
	).trigger("resize")
	
	
	$scope.onclick = () ->
		SelectedElementOrTemplateUUID.init()
		
		
	
	$scope.elementDatas = ElementDatas
	
	$scope.openListItemSelect = () ->
		$scope.selectedElementUUID = SelectedElementUUID.get()
		$scope.screenElements = CurrentScreenData.elementsManager.get()
		$scope.templates = CurrentScreenData.elementsManager.getTemplates()
		ListItemSelect.open()
		
	$scope.closeListItemSelect = () ->
		ListItemSelect.close()
	
	$scope.closeTemplatePreview = () ->
		$("#screen-wrapper").removeClass "show-template"
]

.directive "varButton", [() ->
	return {
		restrict: "C"
		scope: true
		link: (scope) ->

			scope.varButtonDragOptions = {
				helper: "clone"
				appendTo: "body"
				cancel: ""
			}	

	}
]

# リスト上の配置済みアイテム
.directive "hierarchyItem", [() ->
	return {
		restrict: "E"
		templateUrl: "hierarchy-item.html"
		controller: ["$attrs", ($attrs) ->
			this.isTemplate = $attrs.istemplate
		]
	}
]


# エディタ環境でのみ使u
.directive "crosetElementEditor", ()->
	return {
		restrict: "A"
		scope: false

		controller: ["$scope", "$element", "$attrs", "$compile", "ElementDatas", "SelectedElementUUID", "SelectedTemplate",
		($scope, $element, $attrs, $compile, ElementDatas, SelectedElementUUID, SelectedTemplate) ->
			
			
			eventCover = $("<div>").css("position", "absolute").css("top", "-5px").css("left", "-5px").css("bottom", "-5px").css("right", "-5px").css("zIndex", 20000)
			$($element).append eventCover

			# クリック時
			$element.bind "mousedown", (e) ->
				if !$scope.isTemplate
					SelectedElementUUID.set $attrs.uuid

				e.stopPropagation()
				return

			if !$scope.isTemplate
				SelectedElementUUID.set $attrs.uuid						# 追加した要素を選択された状態

			return 
			

		]

	}


