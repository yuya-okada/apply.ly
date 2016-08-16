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

.service "ProjectData", ["$http", "ScreenCards", "ScreenElements", "Build", "ServiceConfig", ($http, ScreenCards, ScreenElements, Build, ServiceConfig) ->
	this.name = ""

	this.get = () ->

		return {
			name: this.name
			elements: ScreenElements.get()
			cards: ScreenCards.get()
			config: ServiceConfig.get()
			sourceCode: Build.compile ScreenCards.get()
		}

	return
]



.service "Elements", [() ->
	elements = {
		screen: null # プロジェクトのデータをダウンロードしたあとで、ロードされる
	}

	this.get = () ->
		return elements

	this.set = (key, value) ->
		elements[key] = value

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


.controller "HeaderController", ["$scope", "$http", "$mdDialog", "$mdSidenav", "$injector", "ProjectData", ($scope, $http, $mdDialog, $mdSidenav, $injector, ProjectData) ->
	$scope.toggleSideNav = () ->
		$mdSidenav "side-menu"
			.toggle()
			.then () ->
				# $log.debug "toggle " + navID + " is done"

	$scope.run = () ->
		console.log "------------実行結果--------------"
		$http {
			method : 'POST'
			url : '/project'
			data: ProjectData.get()
		}
		.success (data, status, headers, config) ->
			console.log "Saved", data
		.error (data, status, headers, config) ->
			console.log "Failed", data

		# for key, value of elements													# 必要な情報や不要な情報などを調整
		# 	value.top = value.element.css "top"
		# 	value.left = value.element.css "left"
		# 	value.width = value.element.width()
		# 	value.height = value.element.height()
		# 	elementsToPush[key] = value



		#
		# $http {
		# 	method : 'POST'
		# 	url : '/login'
		# 	data: ProjectData.get()
		# }
		# .success (data, status, headers, config) ->
		# 	console.log "Saved", data
		# .error (data, status, headers, config) ->
		# 	console.log "Failed", data


]



# エディタ画面のコントローラー
.controller "EditorController", ["$scope", "ElementDatas", "$state", "$stateParams", "$http", "ProjectData", "$interval", "ScreenElements", "ScreenCards", "Elements"
($scope, ElementDatas, $state, $stateParams, $http, ProjectData, $interval, ScreenElements, ScreenCards, Elements) ->

	$scope.settings = {
		elementDatas: ElementDatas
	}

	$scope.mode = ""

	$scope.designMode = () -> $scope.mode = "design"
	$scope.programMode = () -> $scope.mode = "program"

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

	$http {
		method : 'GET'
		url : '/project'
		params: {
			_id: $stateParams.projectId
		}
	}
	.success (data, status, headers, config) ->
		Elements.set "screen", angular.element "#screen"

		angular.forEach data.elements, (data, uuid) ->
			ScreenElements.addFromDataEditor data, uuid

		console.log "GET", data.cards
		ScreenCards.list = data.cards || []
		ScreenCards.parsedCards = data.parsedCards || []

		console.log data.cards

		ProjectData.name = data.name

		$scope.progress.isLoading = false
		$scope.progress.determinateValue += 100

		return

	.error (data, status, headers, config) ->
		console.log "Failed", data


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
			console.log height, screenDefaultHeight
			$scope.marginRight = -1 * (screenDefaultWidth * (1 - $scope.screenScaleRatio))
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
				ScreenElements.set(SelectedElementUUID.get(), $scope.options.result, value)

			this.onchange($scope.options.defaultValue)
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
