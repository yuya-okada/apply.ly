crosetModule = angular.module "Croset"

crosetModule
.value "GeneralComponents", {

	"intentTo": {
		type: "function"
		appearance: [
			{
				type: "text"
				options:
					text: "画面を移動"
			}
			{
				type: "screen"
				defaultValue: ""
				result: "screen"
			}
		]
		compile: "$state.go('screen' + ${screen})"
	}


	"valiable": {
		type: "valiable"
		compile: "${val}"
	}

	"hensu": {
		type: "property"
		text: "変数"
		compile: "val"
	}

	"exp": {
		type: "function"
		appearance: [
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp"
			}
		]
		compile: "${exp}"
	}
	"text": {
		type: "function"
		appearance: [
			{
				type: "textbox"
				defaultValue: "文字"
				result: "text"
			}
		]
		compile: "${text}"
	}

	"equal": {
		type: "function"
		appearance: [
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp1"
			}
			{
				type: "text"
				options:
					text: "="
			}
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp2"
			}
		]
		compile: "(${exp1} == ${exp2})"
	}

	"plus": {
		type: "function"
		appearance: [
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp1"
			}
			{
				type: "text"
				options:
					text: "+"
			}
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp2"
			}
		]
		compile: "(${exp1} + ${exp2})"
	}

	"minus": {
		type: "function"
		appearance: [
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp1"
			}
			{
				type: "text"
				options:
					text: "-"
			}
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp2"
			}
		]
		compile: "(${exp1} - ${exp2})"
	}

	"times": {
		type: "function"
		appearance: [
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp1"
			}
			{
				type: "text"
				options:
					text: "✕"
			}
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp2"
			}
		]
		compile: "(${exp1} * ${exp2})"
	}

	"devide": {
		type: "function"
		appearance: [
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp1"
			}
			{
				type: "text"
				options:
					text: "÷"
			}
			{
				type: "expbox"
				defaultValue: "式"
				result: "exp2"
			}
		]
		compile: "(${exp1} / ${exp2})"
	}

	"メッセージを表示": {
		type: "function"
		appearance: [
			{
				type: "text"
				options:
					text: "メッセージを表示"
			}
			{
				type: "textbox"
				defaultValue: "メッセージ"
				result: "message"
			}
		]
		compile: "alert(${message})"
	}
	"if": {
		type: "mat"
		appearance: [

			{
				type: "text"
				options:
					text: "もし"
			}
			{
				type: "expbox"
				defaultValue: "条件"
				result: "exp"
			}
			{
				type: "text"
				options:
					text: "なら"
			}
		]
		compile: "if(${exp}) { ${mat} }"
	}
	"interval": {
		type: "mat"
		appearance: [
			{
				type: "expbox"
				defaultValue: "1"
				result: "exp"
			}
			{
				type: "text"
				options:
					text: "秒ごとに繰り返す"
			}
		]
		compile: "$interval(function() { ${mat} }, ${exp} * 1000)"
	}
	# "color": {
	# 	type: "property"
	# 	text: "色"
	# 	returnType: "undefined"
	# 	compile: "eval"
	# }
}

.value "ElementComponents", {
	"button": {
		"click": {
			type: "mat"
			appearance: [
				{
					type: "text"
					options:
						text: "がクリックされたとき、"
				}
			]
			compile: "${scope}.click = function() { $timeout(function() { ${mat} });  }"
		}
		"text": {
			type: "property"
			text: "のテキスト"
			compile: "${scope}.options.text"
		}
	}
}

.service "ScreenCards", ["$interval", ($interval) ->
	this.get = () ->
		return this.list
	this.set = (li) ->
		return this.list = li
	this.getParsed = () ->
		return this.parsedCards

	this.list = []
	this.parsedCards = []

	# window.parsedCards = this.parsedCards
	# window.getParsed = () -> return this.parsedCards

	return
]

.factory "GetCardTemplate", ["$http", ($http) ->
	fncs = []
	template = null
	$http {
	    method : "GET"
	    url : "croset-component-in-code.html"
	}
	.success (data, status, headers, config) ->
		template = data
		for fnc in fncs
			fnc template
		fncs = null


	.error (data, status, headers, config) ->

	return (fnc)->
		if template
			fnc template

		else
			fncs.push fnc
]

.service "Build", ["GeneralComponents", "ElementComponents", "CurrentScreenData", "ScreenCards", (GeneralComponents, ElementComponents, CurrentScreenData, ScreenCards) ->
	this.build = () ->
		return this.compile this.parse()

	this.parse = () ->
		program = []
		$("#program-code").children().each (i, e) ->				# eは croset-component-in-code
			childScope = angular.element(e).scope()
			program.push childScope.parse()							# 子要素をすべてパースし、設定データを作る
																	# parse関数は、croset-component-in-codeの子要素のcroset-component内で定義されている

		console.log program
		ScreenCards.parsedCards = program

		return program



	this.compile = (source) ->

		compileBlock = (block) ->
			compileFunction = () ->

				compiledFunction = blockData.compile
				for optionName, optionValue of block.options
					cardOptionValue = block.cardOptions?[optionName]		# 引数がカードならここにデータが入る

					if cardOptionValue										# カードなら
						optionValue = compileBlock cardOptionValue

					compiledFunction = compiledFunction.replace "${" + optionName + "}", optionValue

				console.log compiledFunction, block

				if block.elementId
					compiledFunction = compiledFunction.replace "${jquery}", "$('#" + block.elementId + "')"
					compiledFunction = compiledFunction.replace "${scope}", "angular.element('#" + block.elementId + "').scope()"

				return compiledFunction
			# }

			compiledBlock = ""

			if block.elementId
				elementData = CurrentScreenData.elementsManager.get()[block.elementId]
				blockData = ElementComponents[elementData.type][block.blockId]

			else
				blockData = GeneralComponents[block.blockId]

			switch blockData.type
				when "function"
					compiledBlock = compileFunction()
				when "mat"
					compiledBlock = compileFunction()
					console.log block
					console.log compiledBlock
					compiledBlock = compiledBlock.replace "${mat}", "\n" + compileMat(block.matContents) + "\n"
				when "property"
					compiledBlock = blockData.compile
					if block.elementId
						compiledBlock = compiledBlock.replace "${jquery}", "$('#" + block.elementId + "')"
						compiledBlock = compiledBlock.replace "${scope}", "angular.element('#" + block.elementId + "').scope()"

					if block.propertyChild											# 子要素がある場合
						console.log block.propertyChild
						compiledBlock +=  " = " + (compileBlock block.propertyChild) + ";\n"

				when "valiable"
					console.log block, blockData
					compiledBlock = block.valiableName





			if block.child
				compiledBlock += ";\n" + compileBlock block.child

			return compiledBlock

		# }

		compileMat = (mat) ->
			if !mat
				return ""

			compiledMat = ""
			for block in mat
				compiledMat += compileBlock block

			return compiledMat
		# }


		compiled = ""
		for block in source
			compiled += compileBlock block

		console.log compiled
		return compiled
	# }
	return
]

.controller "ComponentListController", ["$scope", "GeneralComponents", "CurrentScreenData", "SelectedElementUUID", "ElementComponents", "ScreenCards",
($scope, GeneralComponents, CurrentScreenData, SelectedElementUUID, ElementComponents, ScreenCards) ->
	$scope.generalComponents = GeneralComponents

	screenElementsManager = CurrentScreenData.getElementsManager()
	$scope.$watch () ->
		return SelectedElementUUID.get()
	, (newVal, oldVal) ->
		$scope.elementComponents = ElementComponents[screenElementsManager.get()[newVal]?.type]

]
.directive "addComponentButton", ["ScreenCards", "SelectedElementUUID", "CurrentScreenData"
(ScreenCards, SelectedElementUUID, CurrentScreenData) ->
	return {
		restrict: "A"
		link: (scope) ->
			scope.addComponent = (id) ->

				ScreenCards.list.push {
					offset:
						top: 200
						left: 200
					blockId: id
				}


			scope.addElementComponent = (id)->
				ScreenCards.list.push {
					offset:
						top: 200
						left: 200
					elementId: SelectedElementUUID.get()
					blockId: id
					type: CurrentScreenData.elementsManager.get()[SelectedElementUUID.get()].type
				}
	}
]

.controller "CodeController", ["$scope", "$element", "$compile", "ScreenCards", "ProjectData", "GenerateElement"
($scope, $element, $compile, ScreenCards, ProjectData, GenerateElement) ->

	window.a = ()->
		return ScreenCards

	$scope.$watch () ->
		return ScreenCards.get()
	, (newVal, oldVal) ->
		$scope.cards = ScreenCards.get()
		$($element).empty()
		console.log $scope.cards
		for card in ScreenCards.get()
			scope = $scope.$new true
			scope.card = card
			GenerateElement "<croset-component-in-code>", scope, $element
	, true
]

.directive "crosetComponentInputMatCard", [() ->
	return {
		restrict: "C"
		link: (scope, element, attrs) ->
			scope.cardData = scope.card
			scope.card = null
	}
]

.directive "crosetComponentPropertyModified", [() ->
	return {
		priority: 700
		scope: true
		link: (scope, element, attrs) ->
			if !scope.card					# リストの中にある要素では scope.card = undefined
				return
			else if !scope.card.propertyChild
				element.empty()
			scope.cardData = scope.card
			scope.card = scope.cardData.propertyChild
	}
]

.directive "crosetComponentInCode", ["$compile", "CurrentScreenData", "GeneralComponents", "GetCardTemplate", "ElementComponents", "GetDistance", "IsInDiv", "ScreenCards", "Build", "GenerateElement", "ServiceConfig"
($compile, CurrentScreenData, GeneralComponents, GetCardTemplate, ElementComponents, GetDistance, IsInDiv, ScreenCards, Build, GenerateElement, ServiceConfig) ->
	return {
		restrict: "E"
		scope: true

		link: (scope, element, attrs) ->
			scope.elementName = ""
			screenElementsManager = CurrentScreenData.elementsManager

			if scope.card.elementId
				type = screenElementsManager.get()[scope.card.elementId].type
				scope.data = ElementComponents[type][scope.card.blockId]


				scope.$watch () ->
					return screenElementsManager.get()[scope.card.elementId].name
				, (newVal, oldVal) ->
					scope.elementName = newVal
					console.log scope.elementName, "ネーム", scope
				, true


			else
				scope.data = GeneralComponents[scope.card.blockId]

			# console.log template
			GetCardTemplate (template) ->
				element.empty()
				GenerateElement template, scope, element


				bodyBottomLeftPoints = []
				propertyTopRightPoints = []
				inputTopLeftPoints = []

				bottomBorder = null
				modifyIcon = null
				targetInput = null

				component = $(element).children "croset-component"
				$(component).draggable {
					appendTo: "body"
					cancel: ".croset-mat-resizer, input"
					start: (ev, ui) ->
						bodyBottomLeftPoints = []
						propertyTopRightPoints = []
						inputTopLeftPoints = []

						$(".croset-component-body").each (i, e) ->

							if !$(e).closest(element)[0]
								bodyBottomLeftPoints.push {
									left: $(e).offset().left
									top: $(e).offset().top + $(e).height()
									element: $ e
								}

								if e.tagName == "CROSET-COMPONENT-PROPERTY"
									icon = $(e).children "croset-component-property-modify-icon"
									propertyTopRightPoints.push {
										left: icon.offset().left + icon.width()
										top: icon.offset().top
										element: $ e
									}

								if e.tagName == "CROSET-COMPONENT-MAT"
									e = $(e).children()[0]
									console.log e

								$(e).children("croset-component-input").each (i, input) ->
									if !$(input).children("croset-component-input-text")[0]
										inputTopLeftPoints.push {
											left: $(input).offset().left
											top: $(input).offset().top
											element: $ input
										}

						console.log propertyTopRightPoints
					drag: (ev, ui) ->
						snapDistance = 20 * ServiceConfig.get().componentScale					# 要素同士が吸着する距離

						pos = component.offset()

						bottomBorder?.removeClass "bottom-border"
						bottomBorder = null
						for bodyBottomLeftPoint in bodyBottomLeftPoints
							if snapDistance > GetDistance pos, bodyBottomLeftPoint
								bodyBottomLeftPoint.element.addClass "bottom-border"
								bottomBorder = bodyBottomLeftPoint.element

						modifyIcon?.removeClass "selected-modify-icon"
						modifyIcon = null
						for propertyTopRightPoint in propertyTopRightPoints
							if snapDistance > GetDistance pos, propertyTopRightPoint
								propertyTopRightPoint.element.addClass "selected-modify-icon"
								modifyIcon = propertyTopRightPoint.element

						targetInput?.removeClass "target-input"
						targetInput = null
						for inputTopLeftPoint in inputTopLeftPoints
							if snapDistance > GetDistance pos, inputTopLeftPoint
								targetInput = inputTopLeftPoint.element

						targetInput?.addClass "target-input"

					stop: (ev, ui) ->
						if bottomBorder
							element.appendTo bottomBorder.closest "croset-component"
							component.css {top:0, left:0}

						else if modifyIcon
							element.appendTo modifyIcon.children "croset-component-property-modified"
							component.css {top:0, left:0}

						else if targetInput
							firstChild = targetInput.children()[0]
							# if firstChild?.tagName == "CROSET-COMPONENT-IN-CODE"

							element.prependTo targetInput

							component.css {top:0, left:0}
							targetInput.removeClass "target-input"
							console.log element.parent()


						else
							offset = component.offset()

							mats = $ ".mat-wrapper"

							mats = mats.filter (i) ->
								return IsInDiv(component.offset(), this)

							mat = mats.last()
							element.appendTo(mat.children(".croset-mat"))
							component.offset offset


						console.log Build
						ScreenCards.list = Build.parse()

						component.css {
							width: ""
							height: ""
						}


				}

			scope._contextmenu = {
				delete: () ->
					console.log "deleting"
					element.remove()
					ScreenCards.list = Build.parse()
					return
			}

	}
]

.directive "crosetElementComponentInList", ["CurrentScreenData", "SelectedElementUUID", (CurrentScreenData, SelectedElementUUID) ->
	return {
		link: (scope) ->
			scope.elementData = CurrentScreenData.elementsManager.get()[SelectedElementUUID.get()]
	}
]

.directive "crosetComponent", ["$compile", "GetDistance", "GetCardTemplate", ($compile, GetDistance, GetCardTemplate) ->
	return {
		restrict: "E"
		scope: false
		link: (scope, element, attrs) ->

			body = $ "<croset-component-" + scope.data.type + ">"			# カードの種類ごとに子要素を生成
			body = $compile(body)(scope)
			body.addClass "croset-component-body"
				.appendTo element


			childData = scope.$parent.card?.child
			if childData
				child = $ "<croset-component-in-code>"
				childScope = scope.$new()
				childScope.card = childData
				child = $compile(child) childScope
				element.append child

			scope.parse = () ->
				data = {
					offset: {
						top: element.css "top"					# element.positionを使うと、拡大の倍率が考慮されなくなってしまう
						left: element.css "left"
					}

					blockId: scope.card.blockId
					elementId: scope.card.elementId

				}

				cardOptions = {}																					#　カードの引数
				options = {}																						# インプットの結果
				inputOptions = {}																					# インプットの入力されたままの値

				inputs = $(element).children(".croset-component-body").children("croset-component-input")
				if !inputs[0]
					inputs = $(element).children(".croset-component-body").children(".croset-mat-flex").children("croset-component-input")


				inputs.each (i, e) ->
					inputCard = $(e).children("croset-component-in-code")
					inputScope = $(e).scope()
					key = inputScope.input.result

					if key
						options[key] = inputScope.value
						inputOptions[key] = inputScope.inputValue

						if inputCard[0]															# カード
							cardOptions[key] = inputCard.scope().parse()

				data.cardOptions = cardOptions
				data.options = options
				data.inputOptions = inputOptions



				childScope = angular.element($(element).children "croset-component-in-code").scope()			# 自分の下に続くカード
				if childScope
					data.child = childScope.parse()

				matChildren = $(element).children "croset-component-mat"
				 	.children ".mat-wrapper"
					.children ".croset-component-input-mat-card"
					.children "croset-component-in-code"
				if matChildren[0]																				# マットがある場合
					data.matContents = []
					matChildren.each (i, e) ->
						matChildScope = angular.element(e).scope()
						data.matContents.push matChildScope.parse()

						data.matSize = scope.card.matSize


				propertyChild = $(element).children "croset-component-property"					# このカードがプロパティで、かつ何か代入されている場合
					.children "croset-component-property-modified"
					.children "croset-component-in-code"
				if propertyChild[0]
					data.propertyChild = angular.element(propertyChild).scope().parse()



				valiable = $(element).children "croset-component-valiable"					# このカードが変数ならば
				if valiable[0]
					data.valiableName = angular.element(valiable).scope().valiableName

				return data



	}
]

.directive "crosetComponentFunction", [() ->
	return {
		restrict: "E"
		scope: true
		templateUrl: "component-function.html"
		link: (scope, element, attrs) ->
	}
]

.directive "crosetComponentMat", ["Build", (Build) ->
	return {
		restrict: "E"
		scope: false
		templateUrl: "component-mat.html"
		link: (scope, element, attrs) ->
			if scope.card													# コードのなかでだけ実行し、カードリスト内では無効
				resizing = false
				mousePosition = {};
				wrapper = element.children ".mat-wrapper"

				console.log scope.card
				scope.card.matSize ?= {
					top: null
					left: null
				}
				wrapper.width scope.card.matSize.width						# サイズを初期化
				wrapper.height scope.card.matSize.height


				# 以下ドラッグ時の処理
				scope.startResizing = ($event) ->
					resizing = true
					mousePosition = {
						x: $event.pageX
						y: $event.pageY
					}


				document.onmousemove = ($event) ->
					if resizing
						console.log $event.pageX, mousePosition.x
						scope.card.matSize = {
							width: wrapper.width() + $event.pageX - mousePosition.x
							height: wrapper.height() + $event.pageY - mousePosition.y
						}
						wrapper.width scope.card.matSize.width
						wrapper.height scope.card.matSize.height

						mousePosition = {
							x: $event.pageX
							y: $event.pageY
						}
					return

				document.onmouseup = () ->
					resizing = false
					Build.parse()
	}
]


.directive "crosetComponentProperty", [() ->
	return {
		restrict: "E"
		scope: false
		templateUrl: "component-property.html"
		link: (scope, element, attrs) ->

	}
]


.directive "crosetComponentValiable", ["ProjectData", "$mdDialog", "$mdToast", (ProjectData, $mdDialog, $mdToast) ->
	return {
		restrict: "E"
		scope: false
		templateUrl: "component-valiable.html"
		link: (scope, element, attrs) ->
			if scope.card
				scope.valiables = ProjectData.valiables
				scope.valiableName = scope.card.valiableName
				scope.onchange = () ->

				# 新しい変数を作る
				scope.new = (ev) ->
					confirm = $mdDialog.prompt()
						.title "新しい変数"
						.textContent ""
						.targetEvent ev
						.ok "OK"
						.cancel "キャンセル"

					$mdDialog.show(confirm).then (name) ->
						result = ProjectData.addValiable name
						if !result
							$mdToast.show(
								$mdToast.simple()
								.textContent 'その名前の変数はすでに存在します'
								.position "right bottom"
								.hideDelay 3000
							)

				# 変数が追加・変更された時
				ProjectData.onChangeValiables (valiables)->
					scope.valiables = valiables

	}
]

.directive "crosetComponentLiteral", [() ->
	return {
		restrict: "E"
		scope: false
		templateUrl: "component-literal.html"
		link: (scope, element, attrs) ->
	}
]

.directive "crosetComponentInput", ["$compile", ($compile) ->
	return {
		restrict: "E"
		scope: true
		link: (scope, element, attrs) ->

			element.empty()

			cardData = scope.$parent.card?.cardOptions?[scope.input?.result]
			if cardData?.blockId																# カード
				console.log "a"
				e = $ "<croset-component-in-code>"
				cardScope = scope.$new()
				cardScope.card = cardData
				e = $compile(e) cardScope
				element.append e


			 																				# 普通のインプット
			console.log "b"
			e = angular.element "<croset-component-input-" + scope.input.type + ">"
			e = $compile(e)(scope)
			e.appendTo element


			# initialValue = scope.card?.cardOptions?[scope.input.cardOptions?.result]			# 設定データに書いてあった値
			value = scope.$parent.card?.options?[scope.input?.result]
			inputValue = scope.$parent.card?.inputOptions?[scope.input?.result]

			scope.inputValue = inputValue || scope.input?.defaultValue

	}
]



.directive "crosetComponentInputText", [() ->
	return {
		restrict: "E"
		# require: "^crosetComponentInput"
		scope: true
		templateUrl: "component-input-text.html"
		link: (scope, element, attrs) ->
	}
]



.directive "crosetComponentInputTextbox", ["$timeout", "Build", "ScreenCards", ($timeout, Build, ScreenCards) ->
	calculateWidth = (stringWidth) ->
		minWidth = 50
		padding = 10
		if stringWidth + padding < minWidth
			return minWidth
		else
			return stringWidth + padding

	return {
		restrict: "E"
		scope: false
		templateUrl: "component-input-textbox.html"
		link: (scope, element, attrs) ->
			scope.value = "'" + scope.inputValue + "'"
			scope.onblur = () ->
				scope.value = "'" + scope.inputValue + "'"
				ScreenCards.list = Build.parse()
				console.log scope.value, scope.inputValue
				return

			scope.onchange = () ->
				width = element.children("span")[0].offsetWidth;
				element.find("input").css "width", calculateWidth(width)
				return

			$timeout () ->										# timeoutは、バインドされたdomのrenderが終わったタイミングで呼ばれる
				scope.onchange()
	}
]



.directive "crosetComponentInputExpbox", ["$timeout", "Build", "ScreenCards", ($timeout, Build, ScreenCards) ->
	calculateWidth = (stringWidth) ->
		minWidth = 50
		padding = 10
		if stringWidth + padding < minWidth
			return minWidth
		else
			return stringWidth + padding

	return {
		restrict: "E"
		scope: false
		templateUrl: "component-input-expbox.html"
		link: (scope, element, attrs) ->
			scope.value = scope.inputValue
			scope.onblur = () ->
				scope.value = scope.inputValue
				ScreenCards.list = Build.parse()
				return

			scope.onchange = () ->
				width = element.children("span")[0].offsetWidth;
				element.find("input").css "width", calculateWidth(width)
				return

			$timeout () ->										# timeoutは、バインドされたdomのrenderが終わったタイミングで呼ばれる
				scope.onchange()
	}
]



.directive "crosetComponentInputScreen", ["$timeout", "Build", "ScreenCards", "ProjectData", ($timeout, Build, ScreenCards, ProjectData) ->
	calculateWidth = (stringWidth) ->
		minWidth = 50
		padding = 10
		if stringWidth + padding < minWidth
			return minWidth
		else
			return stringWidth + padding

	return {
		restrict: "E"
		scope: false
		templateUrl: "component-input-screen.html"
		link: (scope, element, attrs) ->
			# scope.inputValue = "'" + scope.inputValue + "'"
			scope.screens = ProjectData.screens
			ProjectData.setCallback () ->			# 画面数や画面名の更新がある時呼ばれる
				scope.screens = ProjectData.getScreens()
				console.log scope.value

			scope.onchange = () ->
				scope.value = "'" + scope.inputValue + "'"
				console.log scope.value
				return


			$timeout () ->										# timeoutは、バインドされたdomのrenderが終わったタイミングで呼ばれる
				scope.onchange()
	}
]

.directive "matWrapper", [() ->
	return {
		restrict: "C"
		# require: "^crosetComponentInput"
		scope: true
		link: (scope, element, attrs) ->

	}
]

.directive "componentMenu", [() ->
	return {
		scope: true
	}
]
