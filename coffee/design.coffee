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
.service "SetElementProperty", ["VisiblePropertyCards", "ElementDatas", "ScreenElements", (VisiblePropertyCards, ElementDatas, ScreenElements) ->
	return (uuid) ->
		VisiblePropertyCards.set([])
		data = ScreenElements.get()[uuid]
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
.controller "HierarchyController", ["$scope", "ScreenElements", "ElementDatas", "SelectedElementUUID"
($scope, ScreenElements, ElementDatas, SelectedElementUUID) ->
	$scope.screenElements = ScreenElements.get()						# TODO: 何故動いてるのかがわからない
	$scope.elementDatas = ElementDatas
	$scope.$watch SelectedElementUUID.get, (newVal, oldVal) ->
		$scope.selectedElementUUID = newVal

]

# リスト上の配置済みアイテム
.directive "crosetHierarchyItem", ["$mdDialog", "ElementDatas", "SelectedElementUUID", "ScreenElements", ($mdDialog, ElementDatas, SelectedElementUUID, ScreenElements) ->
	return {
		restrict: "A"
		#クリックされた時プロパティを表示する
		link: (scope, element, attrs) ->
			scope.onclick = (data)->
				SelectedElementUUID.set scope.uuid
				return;


			scope.showConfirmDelete = (ev) ->
				confirm = $mdDialog.confirm()
					.title "削除"
					.content "'" + ScreenElements.get()[scope.uuid].name + "' を削除します"
					# .ariaLabel 'Lucky day'
					.targetEvent ev
					.ok "OK"
					.cancel "キャンセル"

				$mdDialog.show(confirm).then () ->
					ScreenElements.delete(scope.uuid)
				, () ->

	}
]

# 要素を追加するボタン
.directive("addElementCard", ["ScreenElements","$compile", "getUUID"
(ScreenElements, $compile, getUUID) ->
	return {
		scope: true
		link: (scope, element, attrs) ->
			scope.onclick = () ->
				ScreenElements.add element.attr("add-element-card"), getUUID()

				return

	}
])



# 詳細設定
.controller "PropertyController", ["$scope", "ScreenElements", "SelectedElementUUID", "VisiblePropertyCards", "$timeout"
($scope, ScreenElements, SelectedElementUUID, VisiblePropertyCards, $timeout) ->
	$scope.visiblePropertyCards = []
	$scope.elementName = null
	VisiblePropertyCards.onchange (value) ->
		$timeout ()->									# applyが多重に実行されるとバグるので、代わりにtimeoutを使う
			$scope.visiblePropertyCards = value
			if ScreenElements.get()[SelectedElementUUID.get()]
			    $scope.elementName = ScreenElements.get()[SelectedElementUUID.get()].name
			else
                $scope.elementName = null
		, 0

	$scope.onChangeName = () ->
		$scope.elementName = ScreenElements.get()[SelectedElementUUID.get()].name = $scope.elementName
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
