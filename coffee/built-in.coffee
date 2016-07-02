# ビルドされたデータにも含まれる
crosetModule = angular.module "Croset"

crosetModule.service "ScreenElements", ["Elements", "ElementDatas", "$compile", "VisiblePropertyCards",
(Elements, ElementDatas, $compile, VisiblePropertyCards) ->
	screenScope = null  				# ここで初期化処理をするとまだScreenControllerにscopeがinjectionされていない
	list = {}
	this.get = () -> return list
	this.set = (uuid, key, value) ->     # 指定されたオプションを対応するscopeのoptionsプロパティに適応
		list[uuid].options[key] = value
		scopes[uuid].options[key] = value

	scopes = {}

	this.add = (type, uuid) ->
		screenScope ?= Elements.screen.scope()		# 初期化されてない場合初期化

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

		console.log Elements, "aaaaaaaa"
		e = $compile(e)(screenScope)						# 追加した要素にディレクティブを適応させるためにコンパイル
		Elements.screen.append e							# スクリーンに追加

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
		screenScope ?= Elements.screen.scope()		# 初期化されてない場合初期化

		e = $ "<croset-element-#{data.type}>"
			.addClass "croset-element"
			.attr "id", uuid
			.attr "croset-element-type", data.type			# タイプ。ex. Button, Text ...
			.attr "uuid", uuid								# 固有のID

		e.width data.width
			.height data.height
			.css {
				top: data.top
				left: data.left
			}


		scope = screenScope.$new true
		e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
		scope.options = data.options

		Elements.screen.append e							# スクリーンに追加


	this.addFromDataEditor = (data, uuid) ->
		screenScope ?= Elements.screen.scope()		# 初期化されてない場合初期化

		e = $ "<croset-element-#{data.type}>"
			.addClass "croset-element"
			.attr "croset-element-editor", true				# エディタ上でのみ有効化する
			.attr "id", uuid
			.attr "croset-element-type", data.type			# タイプ。ex. Button, Text ...
			.attr "uuid", uuid								# 固有のID

		e.width data.width
			.height data.height
			.css {
				top: data.top
				left: data.left
			}

		console.log data

		scope = screenScope.$new true
		e = $compile(e)(scope)								# 追加した要素にディレクティブを適応させるためにコンパイル
		Elements.screen.append e							# スクリーンに追加

		scopes[uuid] = scope
		scope.options = data.options
		data.element = e
		list[uuid] = data


	this.delete = (uuid) ->
		list[uuid].element.remove()
		VisiblePropertyCards.set []
		delete list[uuid]

	this.initialize = () ->
		list = {}
		scopes = {}
		Elements.screen.empty()

	window.se = () -> list

	return
]



.directive "crosetElementButton", ()->
	return {
		restrict: "E"
		scope: true
		templateUrl: "template-button.html"
		link: (scope, element, attrs) ->
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
