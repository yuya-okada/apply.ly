crosetModule = angular.module "Croset", [
	"ui.router"				# ルーティング
	"uiRouterStyles"				# - スタイルをつけられるようにする奴
	"ngAria"
	"ngMaterial"			# マテリアルデザイン
	"ngAnimate"					# - required
	"ngMessages"				# - required
	"ngMdIcons"				# マテリアルデザインのアイコン
	"ngDragDrop"			# ドラッグ＆ドロップ
	"mdColorPicker"			# カラーピッカー
]
# crosetModule.factory "ScreenFunctions", ["Elements", (Elements) ->
#	 return {
#		 addElement: (element) ->
#			 element.appendTo Elements.screen
#				 .addClass "croset-element"
#				 .
#	 }
# ]

# アカウントごとのサービスの設定
crosetModule.factory "ServiceConfig", () ->
	return {
		componentScale: 1							# カードのサイズ
	}

crosetModule.factory "getUUID", () ->
	return () ->
		'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) ->
			r = Math.random() * 16 | 0
			v = if c is 'x' then r else (r & 0x3|0x8)
			v.toString(16)
	)

crosetModule.factory "GetDistance", () ->
	return (p1, p2) ->
		leftD = p1.left - p2.left
		topD = p1.top - p2.top

		return Math.sqrt leftD * leftD + topD * topD

crosetModule.factory "IsInDiv", () ->
	return (point, div) ->
		div = $ div
		top = div.offset().top
		left = div.offset().left
		bottom = div.offset().top + div.height()
		right = div.offset().left + div.width()
		if point.top >= top && point.left >= left && point.top <= bottom && point.left <= right
			return true
		else
			return false


crosetModule.factory "ElementDatas", () ->
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



.value "ColorPallet", {
	mc: "#0F9D58"
	ac: "#E53935"
}

# 背景色RGBを渡すと、白と黒どちらのテキストが良いか返す
.value "GetTextColor", (bgRgb) ->
	red = bgRgb.r
	green = bgRgb.g
	blue = bgRgb.b

	color = 'black'
	if (red * 0.299 + green * 0.587 + blue * 0.114) < 186
		color = 'white'

	return color

.value "HexToRgb", (hex) ->
	result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec hex
	if result
		return {
			r: parseInt result[1], 16
			g: parseInt result[2], 16
			b: parseInt result[3], 16
		}
	else
		return null


# 要素を生成、コンパイル、追加までを行う。
.factory "GenerateElement", ["$compile", ($compile) ->
	return (e, scope, appendTo) ->
		e = $compile(angular.element(e)) scope
		if appendTo
			e.appendTo(appendTo)
]


crosetModule.config ["$stateProvider", "$urlRouterProvider", "$mdThemingProvider", ($stateProvider, $urlRouterProvider, $mdThemingProvider) ->
		$mdThemingProvider.definePalette('myBlue', {
			'50': '526FFF'
			'100': '526FFF'
			'200': '526FFF'
			'300': '526FFF'
			'400': '526FFF'
			'500': '526FFF'
			'600': '526FFF'
			'700': '526FFF'
			'800': '526FFF'
			'900': '526FFF'
			'A100': '526FFF'
			'A200': '526FFF'
			'A400': '526FFF'
			'A700': '526FFF'
			'contrastDefaultColor': 'light'
			'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100']
			'contrastLightColors': undefined
		})
		$mdThemingProvider.definePalette('myOrange', {
			'50': '#FF5722'
			'100': '#FF5722'
			'200': '#FF5722'
			'300': '#FF5722'
			'400': '#FF5722'
			'500': '#FF5722'
			'600': '#FF5722'
			'700': '#FF5722'
			'800': '#FF5722'
			'900': '#FF5722'
			'A100': '#FF5722'
			'A200': '#FF5722'
			'A400': '#FF5722'
			'A700': '#FF5722'
			'contrastDefaultColor': 'light'
			'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100']
			'contrastLightColors': undefined
			'contrastDefaultColor': 'light'
		})

		$mdThemingProvider.theme('default')
			.primaryPalette('myBlue', {
				"default": "500"
			})
			.accentPalette('myOrange', {
				'default': '500'
			})

		$stateProvider
			.state "editor", {
				url: "/editor/:projectname"
				controller: "EditorController"
				templateUrl: "editor.html"
			}
			.state "editor.design", {
				url: "/design"
				css: "css/design"
				views:
					left:
						templateUrl: "hierarchy.html"
					right:
						templateUrl: "properties.html"
			}
			.state "editor.program", {
				url: "/program"
				css: "css/program"
				views:
					right:
						templateUrl: "program.html"
			}

		# $urlRouterProvider.otherwise "editor"
	]



crosetModule.controller "CrosetController", ["$scope", "$rootScope", ($scope, $rootScope) ->
	$scope.cssPaths = []
	$rootScope.$on "$stateChangeStart", (event, toState, toParams, fromState, fromParams) ->
		$scope.cssPaths = []
		if toState.css
			if angular.isArray( toState.css )
				$scope.cssPaths = toState.css
			else
				$scope.cssPaths = [toState.css]
]


crosetModule.controller "HeaderController", ["$scope", "$mdSidenav", "$injector", ($scope, $mdSidenav, $injector) ->
	$scope.toggleSideNav = () ->
		$mdSidenav "side-menu"
			.toggle()
			.then () ->
				# $log.debug "toggle " + navID + " is done"

	dataStore = new Firebase "https://apply-backend.firebaseio.com/"


	ScreenElements = null
	ProjectData = null
	$scope.run = () ->
		ScreenElements ?= $injector.get("ScreenElements")
		ProjectData ?= $injector.get("ProjectData")

		elements = ScreenElements.get()
		elementsToPush = {}
		for key, value of elements													# 必要な情報や不要な情報などを調整
			value.top = value.element.css "top"
			value.left = value.element.css "left"
			value.width = value.element.width()
			value.height = value.element.height()
			elementsToPush[key] = value


		dataStore.child("projects").child(ProjectData.projectName).update {
			title: "test"
			html: encodeURIComponent JSON.stringify elementsToPush
			js: encodeURIComponent window.build()
			cards: encodeURIComponent JSON.stringify $injector.get("ScreenCards").get()

		}

]


crosetModule.controller "SideMenuController", ["$scope", "$injector", "$state", "$mdSidenav", ($scope, $injector, $state, $mdSidenav) ->
	$scope.toggleSideNav = () ->
		$mdSidenav "side-menu"
			.toggle()
			.then () ->

	$scope.changeMode = () ->
		ProjectData = $injector.get "ProjectData"
		$scope.projectname = ProjectData.projectName

	$scope.navigateTo = (sref) ->
		$state.go sref

	$scope.sideLinks = do ->
		list = [
			{
				icon: "home"
				text: "ホーム"
			}
			{
				icon: "dashboard"
				text: "ダッシュボード"
				children: [
					{
						icon: "edit"
						text: "デザイン"
						sref: "^.design"
					}
					{
						icon: "code"
						text: "プログラム"
						sref: "^.program"
					}
				]
			}
		]
		result = []
		for item in list
			result.push item
			if item.children
				for child in item.children
					child.isChild = true
					result.push child

		return result
]
