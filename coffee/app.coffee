
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


crosetModule.service "Elements", [() ->
	elements = {
		screen: null # プロジェクトのデータをダウンロードしたあとで、ロードされる
	}

	this.get = () ->
		return elements

	this.set = (key, value) ->
		elements[key] = value

	return
]

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


# ルート切り替え時にログイン確認をする
.run ["$http", "$rootScope", "$state", ($http, $rootScope, $state) ->
	console.log "run"

	stateChangeBypass = false			# 遷移が無限ループするのを回避
	$rootScope.$on "$stateChangeStart", (ev, toState, toParams, fromState, fromParams) ->

		if stateChangeBypass || toState.name == "login"		# 無限ループ回避
			stateChangeBypass = false;
			return

		ev.preventDefault() 			# 一時的に繊維をストップ

		console.log "Change"
		$http.get "/profile"
		.success (data, status, headers, config) ->
			console.log data
			if data
				stateChangeBypass = true;
				$rootScope.profile = data
				$state.go toState, toParams
			else
				ev.preventDefault()
				$state.go "login"

		.error (data, status, headers, config) ->
			console.log "Failed", data


]


.config ["$stateProvider", "$urlRouterProvider", "$mdThemingProvider", ($stateProvider, $urlRouterProvider, $mdThemingProvider) ->
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
				url: "/editor/:projectId"
				controller: "EditorController"
				templateUrl: "editor.html"

				resolve:
					# あらかじめプロジェクトのデータを取得してcontrollerにinjectする
					projectDataRes: ["$http", "$stateParams", ($http, $stateParams) ->
						# プロジェクトダウンロード
						return $http {
							method : "GET"
							url: "/project"
							params: {
								projectId: $stateParams.projectId
							}
						}
					]
			}
			.state "editor.design", {
				url: "/design/:screenId"
				css: "css/design"
				views:
					left:
						templateUrl: "hierarchy.html"
						controller: "ChildEditorController"


					right:
						templateUrl: "properties.html"


			}
			.state "editor.program", {
				url: "/program/:screenId"
				css: "css/program"
				views:
					right:
						templateUrl: "program.html"

				controller: "ChildEditorController"
			}
			.state "login", {
				url: "/login"
				css: "css/login"
				templateUrl: "login.html"
				controller: "LoginController"
			}
			.state "dashboard", {
				url: "/dashboard"
				css: "css/dashboard"
				templateUrl: "dashboard.html"
				controller: "DashboardController"
			}

		# $urlRouterProvider.otherwise "editor"
	]

crosetModule.controller "LoginController", ["$scope", ($scope) ->
	$('.form-control').on 'focus blur', (e) ->
		$(this).parents '.form-group'
			.toggleClass 'focused', (e.type == 'focus' || this.value.length > 0)

	.trigger 'blur'

	$('#moveleft').click () ->
		$('#textbox').animate {
			marginLeft: "0" #moves left
		}

		$('.toplam').animate {
			marginLeft: "100%" #moves right
		}

	$('#moveright').click () ->
		$('#textbox').animate {
			marginLeft: "50%" #moves right
		}

		$('.toplam').animate {
			marginLeft: "0" #moves right
		}

]


crosetModule.controller "CrosetController", ["$scope", "$rootScope", "$mdSidenav", ($scope, $rootScope, $mdSidenav) ->
	$scope.cssPaths = []
	$rootScope.$on "$stateChangeStart", (event, toState, toParams, fromState, fromParams) ->
		$mdSidenav("side-menu").close()
		$mdSidenav("select-screen").close()
		$scope.cssPaths = []
		if toState.css
			if angular.isArray( toState.css )
				$scope.cssPaths = toState.css
			else
				$scope.cssPaths = [toState.css]
]



crosetModule.controller "SideMenuController", ["$scope", "$injector", "$state", "$mdSidenav", ($scope, $injector, $state, $mdSidenav) ->
	$scope.toggleSideNav = () ->
		$mdSidenav "side-menu"
			.toggle()
			.then () ->


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
				sref: "dashboard"

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

# 右クリックイベントを実装
.directive "ngRightClick", ["$parse", ($parse) ->
	return (scope, element, attrs) ->
		fn = $parse attrs.ngRightClick
		element.bind 'contextmenu', (event) ->
			scope.$apply () ->
				event.preventDefault()
				fn scope, {$event:event}

			return
]

### コンテキストメニュー
 	.e(ng-context-menu="#menu")   の場合、
	#menuを.eのコンテキストメニューとして使用し、.eのスコープの_contextmenuプロパティの中身をすべて#menuのスコープに展開する
###
crosetModule.directive "ngContextMenu", ["$parse", "$compile", ($parse, $compile) ->
	return (scope, element, attrs) ->

		# コンテキストメニュー要素の初期化
		menu = angular.element attrs.ngContextMenu
		menu.appendTo $("body")
			.hide()

		element.bind "contextmenu", (event) ->
			scope.$apply () ->
				menu.show()
					.offset {
						top: event.pageY
						left: event.pageX
					}

				angular.forEach element.scope()._contextmenu, (value, key) ->		# プロパティ展開
					menu.scope()[key] = value

			return false

		# 削除処理
		$(window).bind "mouseup", (e) ->
			if e.which != 1
				return false    				# 右クリック、中クリックは無効

			menu.hide()

			return
]


# ng-repeatが更新されたとき、DOM更新後に各要素についてイベントを着火する
# 呼ばれるイベントは repeatFinishedEventFired (event, element)
.directive "repeatFinished", ($timeout) ->
	return (scope, element, attrs) ->
		console.log scope.$last, element, scope
		# ループが最後であるときに呼ばれる
		# if scope.$last
		$timeout () ->
			scope.$emit "repeatFinishedEventFired", element  #イベント発火
