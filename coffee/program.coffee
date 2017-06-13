crosetModule = angular.module "Croset"

crosetModule
.value "GeneralComponents", {
	"onload": {
		type: "mat"
		appearance: [

			{
				type: "text"
				options:
					text: "この画面は始まった時"
			}
			{
				type: "mat"
				result: "mat"
			}
		]
		compile: "$events.onload(function({ ${mat} })) "
	}
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


	"variable": {
		type: "variable"
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
	"toint": {
		type: "function"
		appearance: [

			{
				type: "text"
				options:
					text: "数字に変換"
			}
			{
				type: "textbox"
				defaultValue: "条件"
				result: "text"
			}
		]
		compile: "parseInt(${text})"
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
			{
				type: "mat"
				result: "mat"
			}
		]
		compile: "if(${exp}) { ${mat} }"
	}
	"ifelse": {
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
				type: "mat"
				result: "mat"
			}
			{
				type: "text"
				options:
					text: "でなければ"
			}
			{
				type: "mat"
				result: "mat2"
			}
		]
		compile: "if(${exp}) { ${mat} } else { ${mat2} }"
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
			{
				type: "mat"
				result: "mat"
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

				{
					type: "mat"
					result: "mat"
				}
			]
			compile: "${options}.click = function() { $timeout(function() { ${mat} });  }"
		}
		"text": {
			type: "property"
			text: "のテキスト"
			compile: "${options}.text"
		}
	}
	"text": {
		"text": {
			type: "property"
			text: "のテキスト"
			compile: "${options}.text"
		}
	}
	"textbox": {
		"text": {
			type: "property"
			text: "のテキスト"
			compile: "${options}.value"
		}
	}
}


.factory "ShowElementDialog", ["$mdDialog", ($mdDialog) ->
	ShowElementDialogController = [()->
	]
	return (fnc) ->
		$mdDialog.show {
			controller: ShowElementDialogController
			templateUrl: 'templates/icon-select-dialog.tmpl.html'
			parent: angular.element document.body
			clickOutsideToClose: false
		}
		.then (answer) ->
			return
		, () ->
			return
]

.controller "CodeController", ["$scope", "$timeout", "ProjectData", "CurrentScreenData", "SelectedElementUUID", ($scope, $timeout, ProjectData, CurrentScreenData, SelectedElementUUID) ->



	onScreenChanged = () ->
		options = []
		for id, screen of ProjectData.screens
			options.push [screen.name, id]
		CrosetBlock.intentBlock.args0[0].options = options

		Blockly.defineBlocksWithJsonArray [CrosetBlock.intentBlock]
		CrosetBlock.intentBlockGenerator()

	# 画面遷移ブロックの登録
	ProjectData.setScreenCallback () ->

		onScreenChanged();
		dom = Blockly.Xml.workspaceToDom CurrentScreenData.workspace
		CurrentScreenData.workspace.clear()
		Blockly.Xml.domToWorkspace dom, CurrentScreenData.workspace

		blocks = CurrentScreenData.workspace.getAllBlocks()
		for block in blocks
			if block.type == "intent"
				id = block.getFieldValue("ID")
				console.log id, Object.keys(ProjectData.screens)[0]
				if !ProjectData.screens[id]
					block.setFieldValue Object.keys(ProjectData.screens)[0], "ID"

	onScreenChanged()
	
	
	# テンプレートのインスタンスを生成するブロック
	options = [["テンプレートを選択", ""]]
	for id, template of CurrentScreenData.elementsManager.getTemplates()
		options.push [template.name, id]
	
	CrosetBlock.instantiateBlock.args0[0].options = options
	Blockly.defineBlocksWithJsonArray [CrosetBlock.instantiateBlock]
	CrosetBlock.instantiateBlockGenerator()

	


	# Blocklyの初期設定と表示
	blocklyDiv = document.getElementById "program-code"
	CurrentScreenData.workspace = Blockly.inject blocklyDiv,{
		toolbox: document.getElementById('toolbox')
		grid:
			spacing: 20
			length: 3
			colour: '#ccc'
			snap: true

		trashcan: false
		zoom:
			controls: true
			wheel: true
			startScale: 1.0
			maxScale: 3
			minScale: 0.3
			scaleSpeed: 1.2
	}

	CurrentScreenData.workspace.variableList = ProjectData.variables


	# 画面上の要素全てに関して関連するブロックを読み込んでおく
	for id, element of CurrentScreenData.getElementsManager()?.get()
		elementBlocks = angular.copy CrosetBlock.elementBlocks[element.type]
		if elementBlocks
			for elementBlock in elementBlocks
				elementBlock.type = elementBlock.type.replace "#id", id
				elementBlock.message0 = elementBlock.message0.replace "#name", element.name
				Blockly.defineBlocksWithJsonArray [elementBlock]

			CrosetBlock.setGenerators id, element.type　



	# ブロックデータを読み込んでワークスペースに反映
	cards = ProjectData.screens?[CurrentScreenData.id]?.cards
	if cards && cards[0]
		xml = Blockly.Xml.textToDom cards
		Blockly.Xml.domToWorkspace xml, CurrentScreenData.workspace

	

	# 選択した要素のブロックを要求された時の処理
	CurrentScreenData.workspace.registerToolboxCategoryCallback　'ELEMENT', (workspace) ->
		if SelectedElementUUID.get()
			elementsManager = CurrentScreenData.getElementsManager()
			selectedElement = elementsManager.get SelectedElementUUID.get()
			xmlList = []
			for elementBlock in CrosetBlock.elementBlocks[selectedElement.type]
				type = elementBlock.type.replace "#id", SelectedElementUUID.get()
				blockText = '<xml>' +
					'<block type="' + type + '">　</block>' +
					'</xml>'

				block = Blockly.Xml.textToDom(blockText).firstChild
				xmlList.push(block)

			return xmlList
			
		else
			return []



	# ワークスペースのリサイズ処理
	blocklyArea =  $ "#program-zone"
	onResize = (e) ->
		# Position blocklyDiv over blocklyArea
		blocklyDiv.style.left = blocklyArea.offset().left + 'px'
		blocklyDiv.style.top = blocklyArea.offset().right + 'px'
		blocklyDiv.style.width = blocklyArea.width() + 'px'
		blocklyDiv.style.height = blocklyArea.height() + 'px'
		console.log blocklyArea.width(), blocklyArea.height()

		Blockly.svgResize CurrentScreenData.workspace

	window.addEventListener 'resize', onResize, false
	onResize()
	$timeout onResize, 1000


	# window.a = ()->
	# 	return ScreenCards
	#
	# $scope.$watch () ->
	# 	return ScreenCards.get()
	# , (newVal, oldVal) ->
	# 	console.log "changed"
	#
	# 	# $scope.cards = ScreenCards.get()
	# 	# $($element).empty()
	# 	# for card in ScreenCards.get()
	# 	# 	scope = $scope.$new true
	# 	# 	scope.card = card
	# 	# 	GenerateElement "<croset-component-in-code>", scope, $element
	# , true
	#
	# $scope.cards = ScreenCards.get()
	# $($element).empty()
	# for card in ScreenCards.get()
	# 	scope = $scope.$new true
	# 	scope.card = card
	# 	GenerateElement "<croset-component-in-code>", scope, $element
]


# .service "ScreenCards", ["$interval", ($interval) ->
# 	this.get = () ->
# 		return this.list
# 	this.set = (li) ->
# 		return this.list = li
# 	this.getParsed = () ->
# 		return this.parsedCards

# 	this.list = []
# 	this.parsedCards = []

# 	# window.parsedCards = this.parsedCards
# 	# window.getParsed = () -> return this.parsedCards

# 	return
# ]

# .factory "GetCardTemplate", ["$http", ($http) ->
# 	fncs = []
# 	template = null
# 	$http {
# 	    method : "GET"
# 	    url : "croset-component-in-code.html"
# 	}
# 	.success (data, status, headers, config) ->
# 		template = data
# 		for fnc in fncs
# 			fnc template
# 		fncs = null


# 	.error (data, status, headers, config) ->

# 	return (fnc)->
# 		if template
# 			fnc template

# 		else
# 			fncs.push fnc
# ]

# # スコープとdraggableにしたい要素を指定することで、カードのドラッグを実装する
# # 第3引数にコンポーネントのidを指定することで、helperをcloneにできる
# .factory "AddDraggableEvent", ["IsInDiv", "GetDistance", "ServiceConfig", "Build", "ScreenCards", "CurrentScreenData", "SelectedElementUUID", "GenerateElement", (IsInDiv, GetDistance, ServiceConfig, Build, ScreenCards, CurrentScreenData, SelectedElementUUID, GenerateElement) ->
# 	return (scope, element, helperId) ->
# 		bodyBottomLeftPoints = []
# 		propertyTopRightPoints = []
# 		inputTopLeftPoints = []

# 		bottomBorder = null
# 		modifyIcon = null
# 		targetInput = null

# 		isDragged = false  # stopコールバック内の処理が重くて動かしてない時に起動させたくないので、動かしたかどうか調べるスイッチを用意

# 		component = $(element).children "croset-component"


# 		helper = "origin"
# 		if helperId
# 			helper = "clone"


# 		programCode = $("#program-code")

# 		$(component).draggable {
# 			appendTo: "body"
# 			cancel: ".croset-mat-resizer, input"
# 			helper: helper
# 			start: (ev, ui) ->
# 				bodyBottomLeftPoints = []
# 				propertyTopRightPoints = []
# 				inputTopLeftPoints = []
# 				isDragged = false

# 				console.log component, "イベント"



# 				$(".croset-component-body").each (i, e) ->

# 					if !$(e).closest(element)[0]
# 						bodyBottomLeftPoints.push {
# 							left: $(e).offset().left
# 							top: $(e).offset().top + $(e).height()
# 							element: $ e
# 						}

# 						if e.tagName == "CROSET-COMPONENT-PROPERTY" or e.tagName == "CROSET-COMPONENT-VARIABLE"
# 							icon = $(e).children "croset-component-property-modify-icon"
# 							propertyTopRightPoints.push {
# 								left: icon.offset().left + icon.width()
# 								top: icon.offset().top
# 								element: $ e
# 							}

# 						if e.tagName == "CROSET-COMPONENT-MAT"
# 							e = $(e).children()[0]


# 						inputs = $(e).children "croset-component-input"					# 普通のカード
# 						matInputs = $(e).children ".croset-mat-flex"
# 							.children "croset-component-input"


# 						inputs.add(matInputs).each (i, input) ->
# 							if !$(input).children("croset-component-input-text")[0]
# 								inputTopLeftPoints.push {
# 									left: $(input).offset().left
# 									top: $(input).offset().top
# 									element: $ input
# 								}



# 			drag: (ev, ui) ->
# 				isDragged = true

# 				snapDistance = 20 * ServiceConfig.get().componentScale					# 要素同士が吸着する距離

# 				pos = component.offset()

# 				bottomBorder?.removeClass "bottom-border"
# 				bottomBorder = null
# 				for bodyBottomLeftPoint in bodyBottomLeftPoints
# 					if snapDistance > GetDistance pos, bodyBottomLeftPoint
# 						bodyBottomLeftPoint.element.addClass "bottom-border"
# 						bottomBorder = bodyBottomLeftPoint.element

# 				modifyIcon?.removeClass "selected-modify-icon"
# 				modifyIcon = null
# 				for propertyTopRightPoint in propertyTopRightPoints
# 					if snapDistance > GetDistance pos, propertyTopRightPoint
# 						propertyTopRightPoint.element.addClass "selected-modify-icon"
# 						modifyIcon = propertyTopRightPoint.element

# 				targetInput?.removeClass "target-input"
# 				targetInput = null
# 				for inputTopLeftPoint in inputTopLeftPoints
# 					if snapDistance > GetDistance pos, inputTopLeftPoint
# 						targetInput = inputTopLeftPoint.element

# 				targetInput?.addClass "target-input"

# 			stop: (ev, ui) ->

# 				if helper == "clone"
# 						# 	scope = $scope.$new true
# 						# 	scope.card = card
# 						# 	GenerateElement "<croset-component-in-code>", scope, $element

# 					card = {
# 						offset:
# 							top: $(ui.helper).offset().top - $("#program-code").offset().top
# 							left: $(ui.helper).offset().left - $("#program-code").offset().left
# 						blockId: helperId
# 					}

# 					if scope.elementData
# 						card.elementId = SelectedElementUUID.get()
# 						card.type = scope.elementData.type

# 					newScope = scope.$new true
# 					newScope.card = card
# 					GenerateElement "<croset-component-in-code>", newScope, $("#program-code")

# 				if isDragged
# 					if bottomBorder
# 						element.appendTo bottomBorder.closest "croset-component"
# 						component.css {top:0, left:0}

# 					else if modifyIcon
# 						element.appendTo modifyIcon.children "croset-component-property-modified"
# 						component.css {top:0, left:0}

# 					else if targetInput
# 						firstChild = targetInput.children()[0]
# 						# if firstChild?.tagName == "CROSET-COMPONENT-IN-CODE"

# 						element.prependTo targetInput

# 						component.css {top:0, left:0}
# 						targetInput.removeClass "target-input"


# 					else
# 						offset = component.offset()

# 						mats = $ ".mat-wrapper"

# 						mats = mats.filter (i) ->
# 							return IsInDiv(component.offset(), this)

# 						mat = mats.last()
# 						element.appendTo(mat.children(".croset-mat"))
# 						component.offset offset



# 					console.log Build
# 					ScreenCards.list = Build.parse()
# 					scope.$apply()

# 					component.css {
# 						width: ""
# 						height: ""
# 					}
# 		}
# ]

# .service "Build", ["GeneralComponents", "ElementComponents", "CurrentScreenData", "ScreenCards", (GeneralComponents, ElementComponents, CurrentScreenData, ScreenCards) ->


# 	this.build = () ->
# 		return this.compile this.parse()

# 	this.parse = () ->
# 		program = []

# 		$("#program-code").children().each (i, e) ->				# eは croset-component-in-code
# 			childScope = angular.element(e).scope()
# 			program.push childScope.parse()							# 子要素をすべてパースし、設定データを作る
# 																	# parse関数は、croset-component-in-codeの子要素のcroset-component内で定義されている

# 		console.log program
# 		ScreenCards.parsedCards = program

# 		return program



# 	this.compile = (source) ->

# 		compileBlock = (block) ->
# 			compileFunction = () ->

# 				compiledFunction = blockData.compile
# 				for optionName, optionValue of block.options
# 					cardOptionValue = block.cardOptions?[optionName]		# 引数がカードならここにデータが入る

# 					if cardOptionValue										# カードなら
# 						optionValue = compileBlock cardOptionValue

# 					compiledFunction = compiledFunction.replace "${" + optionName + "}", optionValue



# 				if block.elementId
# 					compiledFunction = compiledFunction.replace "${jquery}", "$('#" + block.elementId + "')"
# 					compiledFunction = compiledFunction.replace "${options}", "$scope.list['" + block.elementId + "'].options"

# 				return compiledFunction
# 			# }

# 			compiledBlock = ""

# 			if block.elementId
# 				elementData = CurrentScreenData.elementsManager.get block.elementId
# 				blockData = ElementComponents[elementData.type][block.blockId]

# 			else
# 				blockData = GeneralComponents[block.blockId]

# 			switch blockData.type
# 				when "function"

# 					compiledBlock = compileFunction()
# 				when "mat"
# 					compiledBlock = compileFunction()
# 					for matName, matContent of block.matContents
# 						compiledBlock = compiledBlock.replace "${" + matName + "}", "\n" + compileMat(matContent) + "\n"
# 				when "property"
# 					compiledBlock = blockData.compile
# 					if block.elementId
# 						compiledBlock = compiledBlock.replace "${jquery}", "$('#" + block.elementId + "')"
# 						compiledBlock = compiledBlock.replace "${options}", "$scope.list['" + block.elementId + "'].options"

# 					if block.propertyChild											# 子要素がある場合
# 						compiledBlock +=  " = " + (compileBlock block.propertyChild)

# 				when "variable"
# 					compiledBlock = "variables['" + block.variableName + "']"
# 					if block.propertyChild											# 子要素がある場合
# 						compiledBlock +=  " = " + (compileBlock block.propertyChild)


# 			if block.child
# 				compiledBlock += ";\n" + compileBlock block.child

# 			return compiledBlock

# 		# }

# 		compileMat = (mat) ->
# 			if !mat
# 				return ""

# 			compiledMat = ""
# 			for block in mat
# 				compiledMat += compileBlock block
# 				compiledMat += ";\n"

# 			return compiledMat
# 		# }


# 		compiled = ""
# 		for block in source
# 			compiled += compileBlock block
# 			compiled += ";\n"

# 		console.log compiled
# 		return compiled
# 	# }
# 	return
# ]

# .controller "ComponentListController", ["$scope", "GeneralComponents", "CurrentScreenData", "SelectedElementUUID", "ElementComponents", "ScreenCards",
# ($scope, GeneralComponents, CurrentScreenData, SelectedElementUUID, ElementComponents, ScreenCards) ->
# 	$scope.generalComponents = GeneralComponents

# 	screenElementsManager = CurrentScreenData.getElementsManager()
# 	$scope.$watch () ->
# 		return SelectedElementUUID.get()
# 	, (newVal, oldVal) ->
# 		$scope.elementComponents = ElementComponents[screenElementsManager.get(newVal)?.type]

# ]
# .directive "addComponentButton", ["ScreenCards", "SelectedElementUUID", "CurrentScreenData", "AddDraggableEvent",
# (ScreenCards, SelectedElementUUID, CurrentScreenData, AddDraggableEvent) ->
# 	return {
# 		restrict: "A"
# 		link: (scope, element, attrs) ->

# 			AddDraggableEvent scope, element, scope.componentId

# 			scope.addComponent = (id) ->

# 				ScreenCards.list.push {
# 					offset:
# 						top: 200
# 						left: 200
# 					blockId: id
# 				}


# 			scope.addElementComponent = (id)->
# 				ScreenCards.list.push {
# 					offset:
# 						top: 200
# 						left: 200
# 					elementId: SelectedElementUUID.get()
# 					blockId: id
# 					type: CurrentScreenData.elementsManager.get(SelectedElementUUID.get()).type
# 				}
# 	}
# ]


# .directive "crosetComponentInputMatCard", [() ->
# 	return {
# 		restrict: "C"
# 		link: (scope, element, attrs) ->
# 			scope.cardData = scope.card
# 			scope.card = null
# 	}
# ]

# .directive "crosetComponentPropertyModified", [() ->
# 	return {
# 		priority: 700
# 		scope: true
# 		link: (scope, element, attrs) ->
# 			if !scope.card					# リストの中にある要素では scope.card = undefined
# 				return
# 			else if !scope.card.propertyChild
# 				element.empty()
# 			scope.cardData = scope.card
# 			scope.card = scope.cardData.propertyChild
# 	}
# ]

# .directive "crosetComponentInCode", ["$compile", "CurrentScreenData", "GeneralComponents", "GetCardTemplate", "ElementComponents", "ScreenCards", "Build", "GenerateElement", "AddDraggableEvent",
# ($compile, CurrentScreenData, GeneralComponents, GetCardTemplate, ElementComponents, ScreenCards, Build, GenerateElement, AddDraggableEvent) ->
# 	return {
# 		restrict: "E"
# 		scope: true

# 		link: (scope, element, attrs) ->
# 			scope.elementName = ""
# 			screenElementsManager = CurrentScreenData.elementsManager

# 			if scope.card.elementId
# 				type = screenElementsManager.get(scope.card.elementId).type
# 				scope.data = ElementComponents[type][scope.card.blockId]


# 				scope.$watch () ->
# 					return screenElementsManager.get(scope.card.elementId).name
# 				, (newVal, oldVal) ->
# 					scope.elementName = newVal
# 				, true


# 			else
# 				scope.data = GeneralComponents[scope.card.blockId]

# 			GetCardTemplate (template) ->
# 				element.empty()
# 				GenerateElement template, scope, element

# 				AddDraggableEvent scope, element

# 			scope._contextmenu = {
# 				delete: () ->
# 					element.remove()
# 					ScreenCards.list = Build.parse()
# 					return
# 			}

# 	}
# ]

# .directive "crosetElementComponentInList", ["CurrentScreenData", "SelectedElementUUID", (CurrentScreenData, SelectedElementUUID) ->
# 	return {
# 		link: (scope) ->
# 			scope.elementData = CurrentScreenData.elementsManager.get SelectedElementUUID.get()
# 	}
# ]

# .directive "crosetComponent", ["$compile", "GetDistance", "GetCardTemplate", ($compile, GetDistance, GetCardTemplate) ->
# 	return {
# 		restrict: "E"
# 		scope: false
# 		link: (scope, element, attrs) ->
# 			body = $ "<croset-component-" + scope.data.type + ">"			# カードの種類ごとに子要素を生成
# 			body = $compile(body)(scope)
# 			body.addClass "croset-component-body"
# 				.appendTo element


# 			childData = scope.$parent.card?.child
# 			if childData
# 				child = $ "<croset-component-in-code>"
# 				childScope = scope.$new()
# 				childScope.card = childData
# 				child = $compile(child) childScope
# 				element.append child

# 			scope.parse = () ->
# 				data = {
# 					offset: {
# 						top: element.css "top"					# element.positionを使うと、拡大の倍率が考慮されなくなってしまう
# 						left: element.css "left"
# 					}

# 					blockId: scope.card.blockId
# 					elementId: scope.card.elementId

# 				}

# 				cardOptions = {}																					#　カードの引数
# 				options = {}																						# インプットの結果
# 				inputOptions = {}																					# インプットの入力されたままの値

# 				inputs = $(element).children ".croset-component-body"
# 					.children "croset-component-input"
# 				if !inputs[0]
# 					inputs = $(element).children ".croset-component-body"
# 						.children()
# 						.children ".croset-mat-flex"
# 						.children "croset-component-input"


# 				inputs.each (i, e) ->
# 					inputCard = $(e).children("croset-component-in-code")
# 					inputScope = $(e).scope()
# 					key = inputScope.input.result

# 					if key
# 						options[key] = inputScope.value
# 						inputOptions[key] = inputScope.inputValue

# 						if inputCard[0]															# カード
# 							cardOptions[key] = inputCard.scope().parse()

# 				data.cardOptions = cardOptions
# 				data.options = options
# 				data.inputOptions = inputOptions



# 				childScope = angular.element($(element).children "croset-component-in-code").scope()			# 自分の下に続くカード
# 				if childScope
# 					data.child = childScope.parse()

# 				mats = $(element).children "croset-component-mat"
# 				 	.children()
# 					.children ".mat-wrapper"
# 					.children ".croset-component-input-mat-card"

# 				data.matContents = {}
# 				mats.each (i, e) ->																									# マットがある場合
# 					matScope = angular.element(e).scope()
# 					matResult = []
# 					$(e).children().each (i, e) ->
# 						matResult.push angular.element(e).scope().parse()

# 					data.matContents[matScope.matName] = matResult

# 					data.matSize = scope.card.matSize


# 				propertyChild = $(element).children "croset-component-property"					# このカードがプロパティで、かつ何か代入されている場合
# 					.children "croset-component-property-modified"
# 					.children "croset-component-in-code"
# 				if propertyChild[0]
# 					data.propertyChild = angular.element(propertyChild).scope().parse()

# 				variableChild = $(element).children "croset-component-variable"
# 					.children "croset-component-property-modified"
# 					.children "croset-component-in-code"
# 				if variableChild[0]
# 						data.propertyChild = angular.element(variableChild).scope().parse()


# 				variable = $(element).children "croset-component-variable"					# このカードが変数ならば
# 				if variable[0]
# 					data.variableName = angular.element(variable).scope().variableName

# 				return data



# 	}
# ]

# .directive "crosetComponentFunction", [() ->
# 	return {
# 		restrict: "E"
# 		scope: true
# 		templateUrl: "component-function.html"
# 		link: (scope, element, attrs) ->
# 	}
# ]

# .directive "crosetComponentMat", ["Build", (Build) ->
# 	return {
# 		restrict: "E"
# 		scope: false
# 		templateUrl: "component-mat.html"
# 		link: (scope, element, attrs) ->

# 			scope.mats = {}
# 			lastMatIndex = 0
# 			angular.forEach scope.data.appearance, (e, i) -> # matごとに区切る
# 				if e.type == "mat"
# 					scope.mats[e.result] = scope.data.appearance.slice lastMatIndex, i
# 					lastMatIndex = i + 1


# 			if scope.card													# コードのなかでだけ実行し、カードリスト内では無効
# 				resizing = false
# 				mousePosition = {};


# 		}
# ]

# .directive "matWrapper", [() ->
# 	return {
# 		restrict: "C"
# 		scope: false
# 		link: (scope, element) ->
# 			card = scope.$parent.$parent.$parent.card
# 			if card

# 				card.matSize ?= {
# 					height: {}
# 					width: null
# 				}

# 				# サイズを初期化
# 				element.parent().parent().width card.matSize.width
# 				if card.matSize.height
# 					element.height card.matSize.height[scope.matName]


# 	}
# ]

# # リサイザに付加しておくと、そのdomをドラッグした時にそのdomの親をリサイズする
# .directive "crosetMatResizer", ["Build", (Build)->
# 	return {
# 		restrict: "C"
# 		scope:
# 			direction: "@"
# 		link:(scope, element, attrs) ->

# 			target = element.parent()
# 			# 以下ドラッグ時の処理
# 			$(element).mousedown ($event) ->

# 				resizing = true
# 				mousePosition = {
# 					x: $event.pageX
# 					y: $event.pageY
# 				}
# 				currentMatWidth = target.width()
# 				currentMatHeight = target.height()

# 				$(document).mousemove	 (e) ->
# 					switch scope.direction
# 						when "right"
# 							scope.$parent.card.matSize.width = currentMatWidth + e.pageX - mousePosition.x
# 							target.width scope.$parent.card.matSize.width

# 						when "bottom"
# 							scope.$parent.$parent.card.matSize.height[scope.$parent.matName] = currentMatHeight + e.pageY - mousePosition.y
# 							target.height currentMatHeight + e.pageY - mousePosition.y


# 							scope.$parent.$parent.card.matSize
# 					mousePosition = {
# 						x: $event.pageX
# 						y: $event.pageY
# 					}

# 					scope.$apply()

# 				return

# 			$(document).mouseup () ->
# 				$(document).unbind "mousemove"
# 				Build.parse()
# 	}

# ]

# .directive "crosetComponentProperty", [() ->
# 	return {
# 		restrict: "E"
# 		scope: false
# 		templateUrl: "component-property.html"
# 		link: (scope, element, attrs) ->

# 	}
# ]


# .directive "crosetComponentVariable", ["ProjectData", "$mdDialog", "$mdToast", (ProjectData, $mdDialog, $mdToast) ->
# 	return {
# 		restrict: "E"
# 		scope: false
# 		templateUrl: "component-variable.html"
# 		link: (scope, element, attrs) ->
# 			if scope.card
# 				scope.variables = ProjectData.variables
# 				scope.variableName = scope.card.variableName
# 				scope.onchange = () ->

# 				# 新しい変数を作る
# 				scope.new = (ev) ->
# 					confirm = $mdDialog.prompt()
# 						.title "新しい変数"
# 						.textContent ""
# 						.targetEvent ev
# 						.ok "OK"
# 						.cancel "キャンセル"

# 					$mdDialog.show(confirm).then (name) ->
# 						result = ProjectData.addvariable name
# 						if !result
# 							$mdToast.show(
# 								$mdToast.simple()
# 								.textContent 'その名前の変数はすでに存在します'
# 								.position "right bottom"
# 								.hideDelay 3000
# 							)

# 				# 変数が追加・変更された時
# 				ProjectData.onChangevariables (variables)->
# 					scope.variables = variables

# 	}
# ]

# .directive "crosetComponentLiteral", [() ->
# 	return {
# 		restrict: "E"
# 		scope: false
# 		templateUrl: "component-literal.html"
# 		link: (scope, element, attrs) ->
# 	}
# ]

# .directive "crosetComponentInput", ["$compile", ($compile) ->
# 	return {
# 		restrict: "E"
# 		scope: true
# 		link: (scope, element, attrs) ->

# 			element.empty()

# 			cardData = scope.$parent.card?.cardOptions?[scope.input?.result]
# 			if cardData?.blockId																# カード
# 				e = $ "<croset-component-in-code>"
# 				cardScope = scope.$new()
# 				cardScope.card = cardData
# 				e = $compile(e) cardScope
# 				element.append e


# 			 																				# 普通のインプット
# 			e = angular.element "<croset-component-input-" + scope.input.type + ">"
# 			e = $compile(e)(scope)
# 			e.appendTo element


# 			# initialValue = scope.card?.cardOptions?[scope.input.cardOptions?.result]			# 設定データに書いてあった値
# 			value = scope.$parent.card?.options?[scope.input?.result]
# 			inputValue = scope.$parent.card?.inputOptions?[scope.input?.result]

# 			scope.inputValue = inputValue || scope.input?.defaultValue

# 	}
# ]



# .directive "crosetComponentInputText", [() ->
# 	return {
# 		restrict: "E"
# 		# require: "^crosetComponentInput"
# 		scope: true
# 		templateUrl: "component-input-text.html"
# 		link: (scope, element, attrs) ->
# 	}
# ]



# .directive "crosetComponentInputTextbox", ["$timeout", "Build", "ScreenCards", ($timeout, Build, ScreenCards) ->
# 	calculateWidth = (stringWidth) ->
# 		minWidth = 50
# 		padding = 10
# 		if stringWidth + padding < minWidth
# 			return minWidth
# 		else
# 			return stringWidth + padding

# 	return {
# 		restrict: "E"
# 		scope: false
# 		templateUrl: "component-input-textbox.html"
# 		link: (scope, element, attrs) ->
# 			scope.value = "'" + scope.inputValue + "'"
# 			scope.onblur = () ->
# 				scope.value = "'" + scope.inputValue + "'"
# 				ScreenCards.list = Build.parse()
# 				return

# 			scope.onchange = () ->
# 				width = element.children("span")[0].offsetWidth;
# 				element.find("input").css "width", calculateWidth(width)
# 				return

# 			$timeout () ->										# timeoutは、バインドされたdomのrenderが終わったタイミングで呼ばれる
# 				scope.onchange()
# 	}
# ]



# .directive "crosetComponentInputExpbox", ["$timeout", "Build", "ScreenCards", ($timeout, Build, ScreenCards) ->
# 	calculateWidth = (stringWidth) ->
# 		minWidth = 50
# 		padding = 10
# 		if stringWidth + padding < minWidth
# 			return minWidth
# 		else
# 			return stringWidth + padding

# 	return {
# 		restrict: "E"
# 		scope: false
# 		templateUrl: "component-input-expbox.html"
# 		link: (scope, element, attrs) ->
# 			scope.value = scope.inputValue
# 			scope.onblur = () ->
# 				scope.value = scope.inputValue
# 				ScreenCards.list = Build.parse()
# 				return

# 			scope.onchange = () ->
# 				width = element.children("span")[0].offsetWidth;
# 				element.find("input").css "width", calculateWidth(width)
# 				return

# 			$timeout () ->										# timeoutは、バインドされたdomのrenderが終わったタイミングで呼ばれる
# 				scope.onchange()
# 	}
# ]



# .directive "crosetComponentInputScreen", ["$timeout", "Build", "ScreenCards", "ProjectData", ($timeout, Build, ScreenCards, ProjectData) ->
# 	calculateWidth = (stringWidth) ->
# 		minWidth = 50
# 		padding = 10
# 		if stringWidth + padding < minWidth
# 			return minWidth
# 		else
# 			return stringWidth + padding

# 	return {
# 		restrict: "E"
# 		scope: false
# 		templateUrl: "component-input-screen.html"
# 		link: (scope, element, attrs) ->
# 			# scope.inputValue = "'" + scope.inputValue + "'"
# 			scope.screens = ProjectData.screens
# 			ProjectData.setCallback () ->			# 画面数や画面名の更新がある時呼ばれる
# 				scope.screens = ProjectData.getScreens()

# 			scope.onchange = () ->
# 				scope.value = "'" + scope.inputValue + "'"
# 				return


# 			$timeout () ->										# timeoutは、バインドされたdomのrenderが終わったタイミングで呼ばれる
# 				scope.onchange()
# 	}
# ]

# .directive "matWrapper", [() ->
# 	return {
# 		restrict: "C"
# 		# require: "^crosetComponentInput"
# 		scope: true
# 		link: (scope, element, attrs) ->

# 	}
# ]

# .directive "componentMenu", [() ->
# 	return {
# 		scope: true
# 	}
# ]
