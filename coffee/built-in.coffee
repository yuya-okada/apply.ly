# ビルドされたデータにも含まれる
crosetModule = angular.module "Croset"

crosetModule

.factory "ElementDatas", () ->
	return {
		group:
			name: "グループ"
			icon: "folder"
			width: 150
			height: 150
			properties: [
				{
					title: "レイアウト"
					icon: "settings"
					propertyInputs: [
						[
							{
								type: "select"
								size: 100
								options:
									defaultValue: "free"
									label: "配置"
									items: {
										"自由配置" : "free"
										"縦型配置" : "row"
										"横型配置" : "column"
									}
									result: "layout"
							}
						]
						[
							{
								type: "select"
								size: 100
								options:
									defaultValue: "hidden"
									label: "オーバーフロー"
									items: {
										"隠す" : "hidden"
										"表示" : "visible"
										"スクロール" : "scroll"
									}
									result: "overflow"
							}
						]
					]
				}
				{
					title: "図形"
					icon: "border_all"
					propertyInputs: [
						[
							{
								type: "color_icon"
								size: 30
								options:
									icon: "format_color_fill"
									defaultValue: "#ffffff"
									result: "bgColor"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "角丸"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 3
									min: 0
									max: 150
									step: 1
									result: "borderRadius"
							}
						]
						[
							{
								type: "headline"
								size: 100
								options	:
									text: "影"
									marginTop: 15
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "透明度"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 100
									min: 0
									max: 100
									step: 1
									result: "shadowOpacity"
							}
						]

						[
							{
								type: "text"
								size: 20
								options:
									text: "位置(横)"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 0
									min: -20
									max: 20
									step: 1
									result: "shadowX"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "位置(縦)"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 1
									min: -20
									max: 20
									step: 1
									result: "shadowY"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "ぼかし"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 5
									min: 0
									max: 80
									step: 1
									result: "shadowGradation"
							}
						]
						[
							{
								type: "headline"
								size: 100
								options:
									text: "枠線"
									marginTop: 15
							}
						]
						[
							{
								type: "color_icon"
								size: 30
								options:
									icon: "format_color_fill"
									defaultValue: "#000000"
									result: "borderColor"
							}
						]
						[
							{
								type: "slider"
								size: 100
								options:
									defaultValue: 0
									min: 0
									max: 20
									step: 1
									result: "borderWidth"
							}
						]
					]
				}
			]
		text:
			name: "テキスト"
			icon: "title"
			width: 160
			height: 60
			properties: [
				{
					title: "テキスト"
					icon: "title"
					propertyInputs: [
						[
							{
								type: "textarea"
								size: 100
								options:
									label: "テキスト（改行可）"
									defaultValue: "テキストを\n入力"
									result: "text"
							}
						]
						[
							{
								type: "color-icon"
								size: 30
								options:						# このInput特有の設定。インプットに送られる
									icon: "text_format"
									defaultValue: "#000000"
									result: "textColor"
								# col: 24
							}
							{
								type: "toggle-icon"
								size: 30
								options:
									icon: "format_bold"
									result: "formatBold"
							}
							{
								type: "toggle-icon"
								size: 30
								options:
									icon: "format_italic"
									result: "formatItalic"
							}
						]
						[
							{
								type: "number"
								size: 100
								options:
									defaultValue: 14
									label: "フォントサイズ"
									step: 2
									result: "fontSize"
							}
						]
						[
							{
								type: "select"
								size: 50
								options:
									defaultValue: "left"
									label: "文字揃え"
									items: {
										"左揃え" : "left"
										"中央揃え" : "center"
										"右揃え" : "right"
									}
									result: "textAlign"
							}
							{
								type: "select"
								size: 50
								options:
									defaultValue: "top"
									label: "文字揃え(縦)"
									items: {
										"上揃え" : "flex-start"
										"中央揃え" : "center"
										"下揃え" : "flex-end"
									}
									result: "verticalAlign"
							}
						]
					]
				}
			]

		button:
			name: "ボタン"
			icon: "touch_app"
			width: 120
			height: 40
			properties: [
				{
					title: "テキスト"
					icon: "title"
					propertyInputs: [
						[
							{
								type: "textbox"
								size: 100
								options:
									label: "テキスト"
									defaultValue: "ボタン"
									result: "text"
							}
						]
						[
							{
								type: "color-icon"
								size: 30
								options:						# このInput特有の設定。インプットに送られる
									icon: "text_format"
									defaultValue: "#000000"
									result: "textColor"
								# col: 24
							}
							# {
							# 	type: "toggle-icon"
							# 	size: 30
							# 	options:
							# 		icon: "format_bold"
							# 		result: "formatBold"
							# }
							{
								type: "toggle-icon"
								size: 30
								options:
									icon: "format_italic"
									result: "formatItalic"
							}
						]
						[
							{
								type: "number"
								size: 100
								options:
									defaultValue: 14
									label: "フォントサイズ"
									step: 2
									result: "fontSize"
							}
						]
					]
				}
				{
					title: "図形"
					icon: "border_all"
					propertyInputs: [
						[
							{
								type: "color_icon"
								size: 30
								options:
									icon: "format_color_fill"
									defaultValue: "#ffffff"
									result: "bgColor"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "角丸"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 3
									min: 0
									max: 150
									step: 1
									result: "borderRadius"
							}
						]
						[
							{
								type: "headline"
								size: 100
								options:
									text: "影"
									marginTop: 15
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "透明度"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 74
									min: 0
									max: 100
									step: 1
									result: "shadowOpacity"
							}
						]

						[
							{
								type: "text"
								size: 20
								options:
									text: "位置(横)"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 0
									min: -20
									max: 20
									step: 1
									result: "shadowX"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "位置(縦)"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 2
									min: -20
									max: 20
									step: 1
									result: "shadowY"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "ぼかし"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 5
									min: 0
									max: 80
									step: 1
									result: "shadowGradation"
							}
						]
						[
							{
								type: "headline"
								size: 100
								options:
									text: "枠線"
									marginTop: 15
							}
						]
						[
							{
								type: "color_icon"
								size: 30
								options:
									icon: "format_color_fill"
									defaultValue: "#000000"
									result: "borderColor"
							}
						]
						[
							{
								type: "slider"
								size: 100
								options:
									defaultValue: 0
									min: 0
									max: 20
									step: 1
									result: "borderWidth"
							}
						]
					]
				}
			]

		square:
			name: "四角系"
			icon: "crop_square"
			width: 150
			height: 150
			properties: [
				{
					title: "図形"
					icon: "border_all"
					propertyInputs: [
						[
							{
								type: "color_icon"
								size: 30
								options:
									icon: "format_color_fill"
									defaultValue: "#ffffff"
									result: "bgColor"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "角丸"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 3
									min: 0
									max: 150
									step: 1
									result: "borderRadius"
							}
						]
						[
							{
								type: "headline"
								size: 100
								options	:
									text: "影"
									marginTop: 15
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "透明度"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 74
									min: 0
									max: 100
									step: 1
									result: "shadowOpacity"
							}
						]

						[
							{
								type: "text"
								size: 20
								options:
									text: "位置(横)"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 0
									min: -20
									max: 20
									step: 1
									result: "shadowX"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "位置(縦)"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 1
									min: -20
									max: 20
									step: 1
									result: "shadowY"
							}
						]
						[
							{
								type: "text"
								size: 20
								options:
									text: "ぼかし"
							}
							{
								type: "slider"
								size: 80
								options:
									defaultValue: 5
									min: 0
									max: 80
									step: 1
									result: "shadowGradation"
							}
						]
						[
							{
								type: "headline"
								size: 100
								options:
									text: "枠線"
									marginTop: 15
							}
						]
						[
							{
								type: "color_icon"
								size: 30
								options:
									icon: "format_color_fill"
									defaultValue: "#000000"
									result: "borderColor"
							}
						]
						[
							{
								type: "slider"
								size: 100
								options:
									defaultValue: 0
									min: 0
									max: 20
									step: 1
									result: "borderWidth"
							}
						]
					]
				}
			]

		textbox:
			name: "入力ボックス"
			icon: "create"
			width: 150
			properties: [
				{
					title: "入力"
					icon: "mode_edit"
					propertyInputs: [
						[
							{
								type: "textbox"
								size: 100
								options:
									defaultValue: "入力ボックス"
									result: "default"
							}
						]
						[
							{
								type: "number"
								size: 100
								options:
									label: "フォントサイズ"
									defaultValue: 14
									result: "fontSize"
							}
						]
					]
				}
			]

		checkbox:
			name: "チェック"
			icon: "check_box"

		switch:
			name: "スイッチ"
			icon: "swap_horizon"
	}


.factory "ScreenElementsManager", ["Elements", "ElementDatas", "$compile", "$injector", (Elements, ElementDatas, $compile, $injector) ->
	return (screenElement, isPublic) ->
		screenScope = null
		screenElement.empty()

		that = this
		isPublic ?= false						# 本番環境の時はtrueにする

		initScope = () ->
			screenScope = screenElement.scope()
			screenScope.get = that.get
			screenScope.list = {}

		this.init = () ->						# Screenが変更された場合は追加前に必ず呼ぶ
			screenScope = null
			screenScope.list = {}

		this.get = (id) ->						# 引数にuuidを渡した場合、そのidの要素を返す。引数がない場合、リスト全体を返す。
			if id
				searchInArray = (array) ->
					for uuid, data of array
						if uuid == id
							return data
						else
							result = searchInArray data.children
							if result
								return result

					return null

				result = searchInArray screenScope?.list
				return result

			else
				return screenScope?.list

		this.set = (id, key, value) ->     # 指定されたオプションを対応するscopeのoptionsプロパティに適応
			searchInArray = (array) ->
				for uuid, data of array
					if uuid == id
						array[uuid].options[key] = value
						return true


					else
						result = searchInArray data.children
						if result
							return true

			searchInArray screenScope?.list

		this.setData = (id, data) ->     # 任意の要素を検索して新たなデータを代入
			searchInArray = (array) ->
				for uuid, data of array
					if uuid == id
						array[uuid] = data
						return true


					else
						result = searchInArray data.children
						if result
							return true

			searchInArray screenScope?.list

		this.rename = (uuid, name) ->
			this.get(uuid).name = name

		this.removeAll = () ->
			screenScope.list = {}
			screenElement.empty()

		this.add = (type, uuid) ->
			if !screenScope 		# 初期化されてない場合初期化
				initScope()

			# 要素のデータを取得
			e = $ "<croset-element-#{type}>"
				.addClass "croset-element"
				.attr "id", uuid
				.attr "ng-class", "{'croset-element': true}"	# 追加アニメーションに使う
				.attr "croset-element-type", type				# タイプ。ex. Button, Text ...
				.attr "uuid", uuid											# 固有のID
				.attr "croset-element-editor", true			# エディタ上でのみ有効化する
				.width ElementDatas[type].width					# 横幅を初期化
				.height ElementDatas[type].height				# 縦幅を初期化
				.attr "ng-style", "{zIndex: s.get(uuid).zIndex}"	# zIndexを設定


			scope = screenScope.$new true
			scope.uuid = uuid
			scope.s = screenScope
			e = $compile(e)(scope)						# 追加した要素にディレクティブを適応させるためにコンパイル
			screenElement.append e							# スクリーンに追加

			options = {}
			screenScope.list[uuid] = {
				type: type
				name: ElementDatas[type].name
				element: e
				options:
					top: "0px"
					left: "0px"
					width: ElementDatas[type].width
					height: ElementDatas[type].height

				zIndex: Object.keys(screenScope.list).length
			}

			screenScope.zIndexes?.push uuid

		this.addFromData = (data, uuid) ->
			if !screenScope 		# 初期化されてない場合初期化
				initScope()

			e = $ "<croset-element-#{data.type}>"
				.addClass "croset-element"
				.attr "id", uuid
				.attr "croset-element-type", data.type			# タイプ。ex. Button, Text ...
				.attr "uuid", uuid								# 固有のID
				.attr "ng-style", "{zIndex: s.get(uuid).zIndex}"	# zIndexを設定


			if !isPublic
				e.attr "croset-element-editor", true	# エディタ上でのみ実行。

			e.width data.options.width
				.height data.options.height
				.css {
					top: data.options.top
					left: data.options.left
				}


			scope = screenScope.$new true
			scope.uuid = uuid
			scope.s = screenScope

			e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
			screenElement.append e							# スクリーンに追加

			data.element = e
			screenScope.list[uuid] = data

		this.delete = (uuid) ->
			this.get(uuid).element.remove()
			VisiblePropertyCards = $injector.get("VisiblePropertyCards")		# アプリとして実行した時にVisiblePropertyCardsが存在しないとエラーが起きるので、使うときだけinjectする
			VisiblePropertyCards.set []

			this.deleteData uuid

		this.deleteData = (id) ->			# データのみ除去してdomは残す

			deleteInArray = (array) ->
				if array
					if array[id]
						delete array[id]

					for uuid, data of array
						deleteInArray data.children


			for uuid, data of screenScope.list[id]
				deleteInArray data.children

			delete screenScope.list[id]


		childAddedCallbacks = []

		this.addChild = (parentId, childId) ->

			originalParent = this.getSiblings childId

			screenScope.get(parentId).children ?= {}
			data = Object.assign {}, this.get(childId)
			this.delete childId

			# 移動する分だけzIndexを詰める
			for id, child of originalParent
				if child.zIndex > data.zIndex
					child.zIndex--

			screenScope.get(parentId).children[childId] = data
			this.addChildElement parentId, childId, data
			screenScope.get(childId).zIndex = Object.keys(this.get(parentId).children).length


			for callback in childAddedCallbacks
				callback childId, data




		# 子要素のDOMを生成
		this.addChildElement = (parentId, childId, childData) ->
			if !screenScope 		# 初期化されてない場合初期化
				initScope()

			$("#" + childId).remove()					# すでにある場合最初に削除する

			e = $ "<croset-element-#{childData.type}>"
				.addClass "croset-element"
				.attr "id", childId
				.attr "croset-element-type", childData.type			# タイプ。ex. Button, Text ...
				.attr "uuid", childId								# 固有のID
				.attr "ng-style", "{zIndex: s.get(uuid).zIndex}"	# zIndexを設定

			if !isPublic
				e.attr "croset-element-editor", true	# エディタ上でのみ実行。


			e.width childData.options.width
				.height childData.options.height
				.css {
					top: childData.options.top
					left: childData.options.left
				}


			scope = screenScope.$new true
			scope.uuid = childId
			scope.s = screenScope

			e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
			e.appendTo this.get(parentId)?.element.children(".croset-element-group-div")							# スクリーンに追加

			childData.element = e


		# 特定の要素に子要素を追加すると呼ばれるコールバックを設定。
		# 引数に　子要素のデータ、　子要素のID
		this.setAddChildCallback = (fnc) ->
			childAddedCallbacks.push fnc

		# 特定の要素の兄弟要素を取得
		this.getSiblings = (id) ->
			searchParent = (array) ->
				for uuid, data of array
					if uuid == id
						return array
					else
						result = searchParent data.children
						if result
							return result

				return null

			return searchParent screenScope?.list



		this.changeZIndex = (fromUUID, toZIndex) ->
			fromZIndex = this.get(fromUUID).zIndex

			this.getSiblings fromUUID

			if fromZIndex <= toZIndex
				for id, child of parent
					if (child.zIndex <= toZIndex) && (child.zIndex > fromZIndex)
						console.log child.zIndex
						child.zIndex--

			else
				for id, child of parent
					if (child.zIndex >= toZIndex) && (child.zIndex < fromZIndex)
						child.zIndex++

			this.get(fromUUID).zIndex = toZIndex

			screenScope.$apply()


		this.initialize = () ->
			screenScope.list = {}
			screenElement.empty()


		return

]


.directive "crosetElement", [()->
	return {
		restrict: "C"
		scope: false
		link: (scope, element, attrs) ->
			# scope.options = scope.s.list[uuid].options.fontSize

	}
]


.directive "crosetElementGroup", ["CurrentScreenData", (CurrentScreenData)->
	return {
		restrict: "E"
		templateUrl: "template-group.html"
		link: (scope, element, attrs) ->

			screenElementsManager = CurrentScreenData.elementsManager


			for id, data of scope.s.get(scope.uuid)?.children
				screenElementsManager.addChildElement scope.uuid, id, data

	}
]

.directive "crosetElementButton", ()->
	return {
		restrict: "E"
		templateUrl: "template-button.html"
		link: (scope, element, attrs) ->
			scope.click = () ->
				fnc = scope.s.get(scope.uuid).options.click
				if fnc
					fnc()
	}

.directive "crosetElementText", ()->
	return {
		restrict: "E"
		templateUrl: "template-text.html"
		link: (scope, element, attrs) ->
	}

.directive "crosetElementTextbox", ()->
	return {
		restrict: "E"
		templateUrl: "template-textbox.html"
		link: (scope, element, attrs) ->
			console.log(scope, "suko-pu")
			scope.s.get(scope.uuid).options.text = options.default
	}

.directive "crosetElementSquare", ()->
	return {
		restrict: "E"
		templateUrl: "template-square.html"
		link: (scope, element, attrs) ->
	}
