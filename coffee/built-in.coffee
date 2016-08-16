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




.service "ScreenElements", ["Elements", "ElementDatas", "$compile", "$injector"
(Elements, ElementDatas, $compile, $injector) ->
	screenScope = null  				# ここで初期化処理をするとまだScreenControllerにscopeがinjectionされていない
	list = {}
	this.get = () -> return list
	this.set = (uuid, key, value) ->     # 指定されたオプションを対応するscopeのoptionsプロパティに適応
		list[uuid].options[key] = value
		scopes[uuid].options[key] = value

	scopes = {}

	this.add = (type, uuid) ->
		screenScope ?= Elements.get().screen.scope()		# 初期化されてない場合初期化

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

		e = $compile(e)(screenScope)						# 追加した要素にディレクティブを適応させるためにコンパイル
		Elements.get().screen.append e							# スクリーンに追加

		options = {}
		list[uuid] = {
			type: type
			name: ElementDatas[type].name
			element: e
			options: {}
		}

		scopes[uuid] = e.scope()
		e.scope().options = {}

	this.addFromData = (data, uuid) ->

		screenScope ?= Elements.get().screen.scope()		# 初期化されてない場合初期化

		e = $ "<croset-element-#{data.type}>"
			.addClass "croset-element"
			.attr "id", uuid
			.attr "croset-element-type", data.type			# タイプ。ex. Button, Text ...
			.attr "uuid", uuid								# 固有のID

		console.log(data.options.width, e , "あああいうえ")
		e.width data.options.width
			.height data.options.height
			.css {
				top: data.options.top
				left: data.options.left
			}

		scope = screenScope.$new true
		e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
		scope.options = data.options

		Elements.get().screen.append e							# スクリーンに追加


	this.addFromDataEditor = (data, uuid) ->
		console.log Elements
		screenScope ?= Elements.get().screen.scope()		# 初期化されてない場合初期化

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

		console.log Elements, "hi"

		scope = screenScope.$new true
		e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
		Elements.get().screen.append e							# スクリーンに追加

		scopes[uuid] = scope
		scope.options = data.options
		data.element = e
		list[uuid] = data


	this.delete = (uuid) ->
		list[uuid].element.remove()
		VisiblePropertyCards = $injector.get("VisiblePropertyCards")		# アプリとして実行した時にVisiblePropertyCardsが存在しないとエラーが起きるので、使うときだけinjectする
		VisiblePropertyCards.set []
		delete list[uuid]

	this.initialize = () ->
		list = {}
		scopes = {}
		Elements.get().screen.empty()

	window.se = () -> list

	return
]



.directive "crosetElementButton", ()->
	return {
		restrict: "E"
		scope: true
		templateUrl: "template-button.html"
		link: (scope, element, attrs) ->
			scope.click = () ->
	}

.directive "crosetElementText", ()->
	return {
		restrict: "E"
		scope: true
		templateUrl: "template-text.html"
		link: (scope, element, attrs) ->
	}

.directive "crosetElementTextbox", ()->
	return {
		restrict: "E"
		scope: true
		templateUrl: "template-textbox.html"
		link: (scope, element, attrs) ->
	}

.directive "crosetElementSquare", ()->
	return {
		restrict: "E"
		scope: true
		templateUrl: "template-square.html"
		link: (scope, element, attrs) ->
	}
