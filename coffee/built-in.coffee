# ビルドされたデータにも含まれる
crosetModule = angular.module "Croset"

crosetModule

.factory "ElementDatas", () ->
	return {
		text:
			name: "テキスト"
			icon: "title"
			width: 160
			height: 60
			properties: [
				{
					title: "テキスト"
					icon: "settings"
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
										"上揃え" : "top"
										"中央揃え" : "middle"
										"下揃え" : "bottom"
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
					icon: "settings"
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
									max: 99
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
									max: 99
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
	return (screenElement) ->
		console.log screenElement
		screenScope = null
		screenElement.empty()

		initScope = () ->
			screenScope = screenElement.scope()
			screenScope.list = {}

		this.init = () ->						# Screenが変更された場合は追加前に必ず呼ぶ
			screenScope = null
			screenScope.list = {}

		this.get = () ->
			return screenScope?.list

		this.set = (uuid, key, value) ->     # 指定されたオプションを対応するscopeのoptionsプロパティに適応
			screenScope.list[uuid].options[key] = value

		this.rename = (uuid, name) ->
			screenScope.list[uuid].name = name

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
				.attr "uuid", uuid								# 固有のID
				.attr "croset-element-editor", true				# エディタ上でのみ有効化する
				.width ElementDatas[type].width					# 横幅を初期化
				.height ElementDatas[type].height				# 縦幅を初期化


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
				options: {}
			}

			console.log screenScope


		this.addFromData = (data, uuid) ->
			if !screenScope 		# 初期化されてない場合初期化
				initScope()

			e = $ "<croset-element-#{data.type}>"
				.addClass "croset-element"
				.attr "id", uuid
				.attr "croset-element-type", data.type			# タイプ。ex. Button, Text ...
				.attr "uuid", uuid								# 固有のID

			e.width data.options.width
				.height data.options.height
				.css {
					top: data.options.top
					left: data.options.left
				}

			scope = screenScope.$new true
			scope.uuid = uuid
			scope.s = screenScope
			console.log "ああああい", scope, e
			e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
			screenElement.append e							# スクリーンに追加

			data.element = e
			screenScope.list[uuid] = data

			console.log screenScope.list[uuid], screenScope.$id

		this.addFromDataEditor = (data, uuid) ->
			console.log Elements
			if !screenScope 		# 初期化されてない場合初期化
				initScope()

			e = $ "<croset-element-#{data.type}>"
				.addClass "croset-element"
				.attr "croset-element-editor", true				# エディタ上でのみ有効化する
				.attr "id", uuid
				.attr "croset-element-type", data.type			# タイプ。ex. Button, Text ...
				.attr "uuid", uuid								# 固有のID

			console.log data
			e.width data.options.width
				.height data.options.height
				.css {
					top: data.options.top
					left: data.options.left
				}


			scope = screenScope.$new true
			scope.uuid = uuid
			scope.s = screenScope
			console.log screenScope
			e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
			screenElement.append e							# スクリーンに追加

			data.element = e
			screenScope.list[uuid] = data


		this.delete = (uuid) ->
			screenScope.list[uuid].element.remove()
			VisiblePropertyCards = $injector.get("VisiblePropertyCards")		# アプリとして実行した時にVisiblePropertyCardsが存在しないとエラーが起きるので、使うときだけinjectする
			VisiblePropertyCards.set []
			delete screenScope.list[uuid]


		this.initialize = () ->
			screenScope.list = {}
			screenElement.empty()


		return

]


.directive "crosetElement", ["$interval", ($interval)->
	return {
		restrict: "C"
		scope: false
		link: (scope, element, attrs) ->
			# $interval () ->
			# 	console.log scope
			# , 1000
	}
]

.directive "crosetElementButton", ()->
	return {
		restrict: "E"
		templateUrl: "template-button.html"
		link: (scope, element, attrs) ->
			scope.click = () ->
				fnc = scope.s.list[scope.uuid].options.click
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
			scope.value = options.default
	}

.directive "crosetElementSquare", ()->
	return {
		restrict: "E"
		templateUrl: "template-square.html"
		link: (scope, element, attrs) ->
			console.log element, scope, "スクエア"
	}
