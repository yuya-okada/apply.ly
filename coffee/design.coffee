crosetModule = angular.module "Croset"


# 画面に追加されている要素
crosetModule.service "VisiblePropertyCards", () ->
	list = []
	callbacks = []
	this.onchange = (func) -> callbacks.push func    # コールバックを登録

	this.get = () -> return list
	this.set = (ls) ->
		list = ls
		callback()
	this.push = (val) ->
		list.push val
		callback()

	callback = () ->
		for func in callbacks
			func(list)

	return

# 要素のプロパティのデータを渡すことで画面にプロパティを表示する
.service "SetElementProperty", ["VisiblePropertyCards", "ElementDatas", "CurrentScreenData", (VisiblePropertyCards, ElementDatas, CurrentScreenData) ->
	return (uuid) ->
		VisiblePropertyCards.set([])
		data = CurrentScreenData.elementsManager.get()[uuid]
		defaultData = [].concat ElementDatas[data.type].properties
		for property, i in defaultData

			for row, j in property.propertyInputs
				for input, k in row
					result = input.options.result

					if result && data.options[result]
						defaultData[i].propertyInputs[j][k].options.defaultValue = data.options[result]

		VisiblePropertyCards.set defaultData
]






# 配置済みのアイテム
.controller "HierarchyController", ["$scope", "CurrentScreenData", "ElementDatas",  "SelectedElementUUID",
($scope, CurrentScreenData, ElementDatas, SelectedElementUUID) ->
	screenElementsManager = CurrentScreenData.elementsManager
	$scope.screenElements = screenElementsManager.get()
	$scope.elementDatas = ElementDatas
	$scope.$watch SelectedElementUUID.get, (newVal, oldVal) ->
		if newVal
			$scope.selectedElementUUID = newVal
			$scope.screenElements = screenElementsManager.get()
			console.log screenElementsManager

]

# リスト上の配置済みアイテム
.directive "crosetHierarchyItem", ["$mdDialog", "ElementDatas", "SelectedElementUUID", "CurrentScreenData", ($mdDialog, ElementDatas, SelectedElementUUID, CurrentScreenData) ->
	return {
		restrict: "A"
		#クリックされた時プロパティを表示する
		link: (scope, element, attrs) ->
			screenElementsManager = CurrentScreenData.elementsManager
			scope.onclick = (data)->
				SelectedElementUUID.set scope.uuid
				return

			scope.showPromptRename = (ev) ->
				confirm = $mdDialog.prompt()
					.title '名前を変更'
					.textContent "の名前を変更します。"
					.placeholder ''
					.ariaLabel '新しい名前を入力'
					.targetEvent ev
					.ok 'OK!'
					.cancel 'キャンセル'

				$mdDialog.show(confirm).then (result) ->
					screenElementsManager.rename scope.uuid, result
				, () ->
					return


			scope.showConfirmDelete = (ev) ->
				confirm = $mdDialog.confirm()
					.title "削除"
					.content "'" + screenElementsManager.get()[scope.uuid].name + "' を削除します"
					# .ariaLabel 'Lucky day'
					.targetEvent ev
					.ok "OK"
					.cancel "キャンセル"

				$mdDialog.show(confirm).then () ->
					screenElementsManager.delete(scope.uuid)
				, () ->

	}
]

# 要素を追加するボタン
.directive("addElementCard", ["CurrentScreenData","$compile", "getUUID"
(CurrentScreenData, $compile, getUUID) ->
	return {
		scope: true
		link: (scope, element, attrs) ->
			scope.onclick = () ->
				CurrentScreenData.elementsManager.add element.attr("add-element-card"), getUUID()

				return

	}
])



# 詳細設定
.controller "PropertyController", ["$scope", "CurrentScreenData", "SelectedElementUUID", "VisiblePropertyCards", "$timeout",　"$interval", "$rootScope",
($scope, CurrentScreenData, SelectedElementUUID, VisiblePropertyCards, $timeout, $interval, $rootScope) ->
	$scope.visiblePropertyCards = []
	$scope.elementName = null
	$scope.isVisibleOffsetProperty = "none"
	screenElementsManager = CurrentScreenData.elementsManager
	VisiblePropertyCards.onchange (value) ->
		$timeout ()->									# applyが多重に実行されるとバグるので、代わりにtimeoutを使う
			$scope.visiblePropertyCards = value
			$scope.isVisibleOffsetProperty = "block"
			if screenElementsManager.get()[SelectedElementUUID.get()]
				$scope.elementName = screenElementsManager.get()[SelectedElementUUID.get()].name
			else
				$scope.elementName = null
		, 0

	$scope.onChangeName = () ->
		$scope.elementName = screenElementsManager.get()[SelectedElementUUID.get()].name = $scope.elementName


	# 以下は offsetに関するプロパティの設定
	resizing = false
	$rootScope.$on "onResizedOrDragging", (ev, element) ->		# editor.jsからbroadcastされる。
		resizing = true
		$timeout () ->
			$scope.top = parseInt element.css("top"), 10
			$scope.left = parseInt element.css("left"), 10
			$scope.width = element.width()
			$scope.height = element.height()
		# $scope.$apply()

	$rootScope.$on "onResizedOrDraged", (ev) ->		# editor.jsからbroadcastされる。
		resizing = false

	$scope.onChangeTop = () ->
		if !resizing
			screenElementsManager.get()[SelectedElementUUID.get()]?.element.css "top", $scope.top
			screenElementsManager.set SelectedElementUUID.get(), "top", $scope.top

	$scope.onChangeLeft = () ->
		if !resizing
			screenElementsManager.get()[SelectedElementUUID.get()]?.element.css "left", $scope.left
			screenElementsManager.set SelectedElementUUID.get(), "left", $scope.left

	$scope.onChangeWidth = () ->
		if !resizing
			screenElementsManager.get()[SelectedElementUUID.get()]?.element.width $scope.width
			screenElementsManager.set SelectedElementUUID.get(), "width", $scope.width

	$scope.onChangeHeight = () ->
		if !resizing
			screenElementsManager.get()[SelectedElementUUID.get()]?.element.height $scope.height
			screenElementsManager.set SelectedElementUUID.get(), "height", $scope.height
]

# プロパティのカード
.directive("propertyCard", () ->
	return {
		restrict: "C"
		controller: ["$scope", "$element", ($scope, $element) ->
			$scope.cardToggle = false
		]
	}
)
