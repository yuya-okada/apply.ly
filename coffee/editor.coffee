crosetModule = angular.module "Croset"

crosetModule

# エディタ画面のコントローラー
.controller "EditorController", ["$scope", "ElementDatas", "$stateParams", "$injector", "ProjectData", "$interval", "$rootScope"
($scope, ElementDatas, $stateParams, $injector, ProjectData, $interval, $rootScope) ->
	ProjectData.projectName = $stateParams.projectname

	$scope.settings = {
		elementDatas: ElementDatas
	}

	$scope.mode = ""

	$scope.designMode = () -> $scope.mode = "design"
	$scope.programMode = () -> $scope.mode = "program"
	dataStore = new Firebase "https://apply-backend.firebaseio.com/"
	dataStore.child("projects").child(ProjectData.projectName).once "value", (dataSnapshot)->
		ScreenElements = $injector.get "ScreenElements"

		result = dataSnapshot.val()
		ProjectData.projectData = result
		elementDatas = JSON.parse decodeURIComponent result.html;
		angular.forEach elementDatas, (data, uuid) ->
			ScreenElements.addFromDataEditor data, uuid


	# Mode Change
	$scope.modeList = {
		design:
			icon: "create"
		program:
			icon: "code"
	}

	$scope.changeMode = (name) ->


	# Progress bar
	$scope.progress = {
		determinateValue: 0
		isLoading: true
	}
	$interval () ->
		$scope.progress.determinateValue += 34

		if $scope.progress.determinateValue > 130
			$scope.progress.isLoading = false;

	, 700, 4

]


.service "ProjectData", () ->
	this.projectName = ""
	this.projectData = {}

.factory "Elements", () ->
	return {
		screen: do ->
			console.log angular.element "#screen"
			angular.element "#screen"
		propertyBody: angular.element "#property-body"
	}

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
		console.log ScreenElements.get()[uuid].element, "ｲｪｱ"
		$ ScreenElements.get()[uuid].element							# 選択
			.resizable {
				handles: "ne, se, sw, nw"
				minHeight: 3
				minWidth: 3
			}
			.draggable {
				cancel: null
			}

	return
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
