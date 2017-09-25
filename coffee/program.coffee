if !window.CrosetBlock
	window.CrosetBlock = {}

crosetModule = angular.module "Croset"

crosetModule



.service "InitCrosetBlockMethods", ["$mdDialog", "CurrentScreenData", ($mdDialog, CurrentScreenData) ->
	
	dialogCallback = null
	listFncName = ""
	# ここで指定されたタイプの要素のみ表示される
	filterTypes = null
	# ブロックを選択するダイアログのコントローラ
	SelectElementDialogController = ["CurrentScreenData", "ElementDatas", "SelectedElementUUID", "$scope", "$interval", (CurrentScreenData, ElementDatas, SelectedElementUUID, $scope, $interval)->
		screenElementsManager = CurrentScreenData.elementsManager
		screenElements = $.extend true, {}, screenElementsManager[listFncName]?()
		if filterTypes
			for id, element of screenElements
				if filterTypes.indexOf(element.type) == -1
					delete screenElements[id]
					
		$scope.screenElements = screenElements
			
		$scope.elementDatas = ElementDatas


		$scope.reverse = false
		$interval () ->
			$scope.reverse = !$scope.reverse
			
		$scope.itemSelected = (uuid, data) ->
			dialogCallback?(uuid, data)
			$mdDialog.hide()

	]

	SelectElementAndTemplateDialogController = ["CurrentScreenData", "ElementDatas", "SelectedElementUUID", "$scope", "$interval", (CurrentScreenData, ElementDatas, SelectedElementUUID, $scope, $interval)->
		screenElementsManager = CurrentScreenData.elementsManager
		elements = $.extend true, {}, screenElementsManager.get()
		templates = $.extend true, {}, screenElementsManager.getTemplates()
		
		$scope.screenElements = screenElements
			
		$scope.elementDatas = ElementDatas


		$scope.reverse = false
		$interval () ->
			$scope.reverse = !$scope.reverse
			
		$scope.itemSelected = (uuid, data) ->
			dialogCallback?(uuid, data)
			$mdDialog.hide()

	]



	return () ->
		
		# 画面上の要素を選択させるダイアログを表示する関数をCrosetBlockのメソッドとして宣言
		# fnc: ダイアログを表示したあと、実際に要素が選択されたらコールバックする
		CrosetBlock.showSelectElementDialog = (type, fnc) ->
			filterTypes = type
			listFncName = "get"
			showDialog fnc, SelectElementDialogController, "templates/select-element-dialog.tmpl.html"
		
		
		# テンプレートを選択させるダイアログを表示する関数をCrosetBlockのメソッドとして宣言
		# fnc: ダイアログを表示したあと、実際に要素が選択されたらコールバックする
		CrosetBlock.showSelectTemplateDialog = (type, fnc) ->
			filterTypes = type
			listFncName = "getTemplates"
			showDialog fnc, SelectElementDialogController, "templates/select-element-dialog.tmpl.html"
		
		
		CrosetBlock.showSelectElementAndTemplateDialog = (fnc) ->
			showDialog fnc, SelectElementAndTemplateDialogController, "templates/select-element-and-template-dialog.tmpl.html"

			
		showDialog = (callback, controller, templateUrl) ->
			dialogCallback = callback
			$mdDialog.show {
				controller: controller
				templateUrl: templateUrl
				parent: angular.element document.body
				clickOutsideToClose: true
			}
			.then (answer) ->
				return
			, () ->
				return
]


# ダイアログ内のアイテム
crosetModule
.directive "selectElementDialogChildItem", ["$compile", ($compile) ->
	return {
		restrict: "E"
		link: (scope, element, attrs) ->
			if scope.element.children
				e = angular.element("<select-element-dialog-item>")
				e = $compile(e)(scope)
				e.appendTo element

	}
]
.directive "selectElementDialogItem", () ->
	return {
		templateUrl: "templates/select-element-dialog-item.tmpl.html"		
	}


.controller "CodeController", ["$scope", "CurrentScreenData", "ProjectData", "$timeout", ($scope, CurrentScreenData, ProjectData, $timeout) ->
	
	$scope.cards =  ProjectData.screens?[CurrentScreenData.id]?.cards
	$scope.workspace = null
	$scope.onWorkspaceChanged = (workspace) ->
		$scope.workspace = workspace
		CurrentScreenData.workspace = workspace
		
	

	# ワークスペースのリサイズ処理
	blocklyArea =  $ "#program-zone"
	blocklyDiv =  $("#program-code")[0]
	onResize = (e) ->
		# Position blocklyDiv over blocklyArea
		blocklyDiv.style.left = blocklyArea.offset().left + 'px'
		blocklyDiv.style.top = blocklyArea.offset().right + 'px'
		blocklyDiv.style.width = blocklyArea.width() + 'px'
		blocklyDiv.style.height = blocklyArea.height() + 'px'
		console.log blocklyArea.width(), blocklyArea.height()
		
		if $scope.workspace
			Blockly.svgResize $scope.workspace

	window.addEventListener 'resize', onResize, false
	onResize()
	$timeout onResize, 1000
		
]	

.directive "workspace", ["$timeout", "ProjectData", "CurrentScreenData", "SelectedElementOrTemplateUUID", "SelectedElementUUID", "SelectedTemplate", "InitCrosetBlockMethods", ($timeout, ProjectData, CurrentScreenData, SelectedElementOrTemplateUUID, SelectedElementUUID, SelectedTemplate, InitCrosetBlockMethods) ->
	return {
		restrict: "A"
		scope: {
			onWorkspaceChanged: "=workspaceChanged"
			defaultXML: "=workspace"
		}
		link: (scope, el, attr) ->
			InitCrosetBlockMethods()
			
			workspace = null
			
			onScreenChanged = () ->
				options = []
				for id, screen of ProjectData.screens
					options.push [screen.name, id]
				CrosetBlock.customBlock.intentBlock.args0[0].options = options

				Blockly.defineBlocksWithJsonArray [CrosetBlock.customBlock.intentBlock]
				CrosetBlock.customBlockGenerator.intentBlockGenerator()

			# 画面遷移ブロックの登録
			ProjectData.setScreenCallback () ->

				onScreenChanged()
				dom = Blockly.Xml.workspaceToDom workspace
				workspace.clear()
				Blockly.Xml.domToWorkspace dom, workspace

				blocks = workspace.getAllBlocks()
				for block in blocks
					if block.type == "intent"
						id = block.getFieldValue("ID")
						console.log id, Object.keys(ProjectData.screens)[0]
						if !ProjectData.screens[id]
							block.setFieldValue Object.keys(ProjectData.screens)[0], "ID"

			onScreenChanged()




			# Blocklyの初期設定と表示
			blocklyDiv = el[0]
			workspace = Blockly.inject blocklyDiv,{
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
			workspace.addChangeListener () ->
				scope.onWorkspaceChanged workspace
			
			scope.onWorkspaceChanged workspace
			
			variables = []
			for varId, variable of ProjectData.variables
				variables.push variable.name
			workspace.variableList = variables

			CrosetBlock.setElementBlocks()

			# ブロックデータを読み込んでワークスペースに反映
			cards =	scope.defaultXML
			if cards && cards[0]
				xml = Blockly.Xml.textToDom cards
				Blockly.Xml.domToWorkspace xml, workspace

			# 選択した要素のブロックを要求された時の処理		
			workspace.registerToolboxCategoryCallback　'ELEMENT', (workspace) ->


				xmlList = []
				button = goog.dom.createDom "button"
				button.setAttribute "text", "要素を選択"
				button.setAttribute "callbackKey", 'SELECT_ELEMENT'
				xmlList.push button

				if SelectedElementOrTemplateUUID.get()
					elementsManager = CurrentScreenData.getElementsManager()

					if !SelectedElementOrTemplateUUID.isTemplate()
						selectedElement = elementsManager.get SelectedElementOrTemplateUUID.get()
					else
						selectedElement = elementsManager.getTemplate SelectedElementOrTemplateUUID.get()

					for elementBlock in angular.copy CrosetBlock.elementBlocks[selectedElement.type]
						templateText = if SelectedElementOrTemplateUUID.isTemplate() then "_template" else "_element"

		# 				elementBlock.args0?.unshift {
		# 					type: "field" + templateText
		# 					name: "ELEMENT"
		# 					filter: selectedElement.type
		# 				}
		# 				Blockly.defineBlocksWithJsonArray [elementBlock]

						blockText = '<xml>' +
							'<block type="' + elementBlock.type + templateText + '"> <field name="ELEMENT">' + SelectedElementOrTemplateUUID.get() + '</field> </block>' +
							'</xml>'

						block = Blockly.Xml.textToDom(blockText).firstChild
						xmlList.push(block)

				return xmlList


			# 要素を選択
			workspace.registerButtonCallback　'SELECT_ELEMENT', (workspace) ->
				CrosetBlock.showSelectElementAndTemplateDialog null, (uuid, data, isTemplate) ->
					if !isTemplate
						SelectedElementUUID.set uuid
					else
						SelectedTemplate.set uuid

					lastNode = workspace.toolbox_.tree_.getSelectedItem()
					workspace.toolbox_.tree_.setSelectedItem(null)
					workspace.toolbox_.tree_.setSelectedItem(lastNode)


	}

]