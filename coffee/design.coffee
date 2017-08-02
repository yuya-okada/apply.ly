crosetModule = angular.module "Croset"


# 画面に追加されている要素
crosetModule.service "VisiblePropertyCards", () ->
	list = []
	callbacks = []
	boxes = []
	this.onchange = (func) -> callbacks.push func    # コールバックを登録

	this.get = () -> return list
	this.set = (ls, isTemplate) ->
		list = ls
		callback isTemplate
	
	this.push = (val) ->
		list.push val
		callback()
	
	
	callback = (isTemplate) ->
		for func in callbacks
			func list, isTemplate

	return

# 要素のプロパティのデータを渡すことで画面にプロパティを表示する
.service "SetElementProperty", ["VisiblePropertyCards", "ElementDatas", "CurrentScreenData", (VisiblePropertyCards, ElementDatas, CurrentScreenData) ->
	return (uuid, isTemplate) ->
			
		VisiblePropertyCards.set([])
		data = null
		if !isTemplate		# 普通の要素の場合
			data = CurrentScreenData.elementsManager.get uuid
		else 							# テンプレートの場合
			data = CurrentScreenData.elementsManager.getTemplate uuid


		defaultData = [].concat ElementDatas[data.type].properties
		for property, i in defaultData

			for row, j in property.propertyInputs
				for input, k in row
					result = input.options.result

					if result && data.options[result]
						defaultData[i].propertyInputs[j][k].options.defaultValue = data.options[result]

		VisiblePropertyCards.set defaultData, isTemplate
]






# 配置済みのアイテム
.controller "HierarchyController", ["$scope", "CurrentScreenData", "ElementDatas",  "SelectedElementUUID", "$interval",
($scope, CurrentScreenData, ElementDatas, SelectedElementUUID, $interval) ->
	screenElementsManager = CurrentScreenData.elementsManager
	$scope.screenElements = screenElementsManager.get()
	$scope.elementDatas = ElementDatas
	$scope.templates = screenElementsManager.getTemplates()

	$scope.$watch () ->
		return Object.keys(screenElementsManager.get()).length
	, (newVal, oldVal) ->
		if newVal
			$scope.selectedElementUUID = newVal
			$scope.screenElements = screenElementsManager.get()
			$scope.templates = screenElementsManager.getTemplates()
			console.log screenElementsManager

	screenElementsManager.setAddChildCallback () ->
		$scope.screenElements = screenElementsManager.get()
		$scope.$apply()

	$scope.reverse = false
	$interval () ->
		$scope.reverse = !$scope.reverse

	, 1000

]



# リスト上の配置済みアイテム
.directive "hierarchyChildItem", ["$compile", ($compile) ->
	return {
		restrict: "E"
		require: "^hierarchyItem"
		link: (scope, element, attrs, hierarchyItem) ->
			e = angular.element("<hierarchy-item>")
			e.attr "istemplate", hierarchyItem.isTemplate
			e = $compile(e)(scope)
			e.appendTo element

	}
]

# リスト上の配置済みアイテム
.directive "crosetHierarchyItem", ["$mdDialog", "$compile", "ElementDatas", "SelectedElementUUID", "CurrentScreenData", "SelectedTemplate", "getUUID", "ListItemSelect", ($mdDialog,  $compile, ElementDatas, SelectedElementUUID, CurrentScreenData, SelectedTemplate, getUUID, ListItemSelect) ->
	return {
		restrict: "A"
		require: "^hierarchyItem"
		#クリックされた時プロパティを表示する
		link: (scope, element, attrs, hierarchyItem) ->
			screenElementsManager = CurrentScreenData.elementsManager
			scope.isTemplate = hierarchyItem.isTemplate
			scope.onclick = (data)->
				if !hierarchyItem.isTemplate
					SelectedElementUUID.set scope.element.$$key
				else
					SelectedTemplate.set scope.element.$$key

				ListItemSelect.close()

				return

			scope.showPromptRename = (ev) ->
				confirm = $mdDialog.prompt()
					.title '名前を変更'
					.textContent scope.element.name + "の名前を変更します。"
					.placeholder ''
					.ariaLabel '新しい名前を入力'
					.targetEvent ev
					.ok 'OK!'
					.cancel 'キャンセル'

				$mdDialog.show(confirm).then (result) ->
					if !hierarchyItem.isTemplate
						screenElementsManager.rename scope.element.$$key, result
					else
						screenElementsManager.renameTemplate scope.element.$$key, result

				, () ->
					return

			scope.showConfirmDelete = (ev) ->
				confirm = $mdDialog.confirm()
					.title "削除"
					.content "'" + scope.element.name + "' を削除します"
					# .ariaLabel 'Lucky day'
					.targetEvent ev
					.ok "OK"
					.cancel "キャンセル"

				$mdDialog.show(confirm).then () ->
					if !hierarchyItem.isTemplate
						screenElementsManager.delete scope.element.$$key
					else
						screenElementsManager.deleteTemplate scope.element.$$key
				, () ->

					
			scope.duplicate = (ev) ->
				screenElementsManager.duplicate scope.element


			scope.addTemplate = () ->
				screenElementsManager.template scope.element.$$key

			if !hierarchyItem.isTemplate
				itemDatas = []
				items = null
				targetGroup = null
				target = null
				$(element).draggable {
					axis: "y"
					helper: "clone"
					cancel: null
					start: () ->
						itemDatas = []
						items = $("#hierarchy-body").find("hierarchy-item").children "md-list-item"
						items.each (i, e) ->
							itemDatas.push [angular.element(e), $(e).offset().top, $(e).offset().top + $(e).height()]


					drag: (ev, ui) ->
						targetGroup = null
						target = null

						top = $(ui.helper).offset().top
						height = $(ui.helper).height()
						items.each (i, e) ->
							$(e).css "border", "none"


						for itemData, i in itemDatas
							if itemData[0].hasClass "hierarchy-group"
								if (itemData[1] < top) && (itemData[2] > top)
									targetGroup = itemData[0]
									break

							if ((itemData[1] + itemData[2]) / 2 < top)  && (itemData[0] != element)
								target = itemData[0]


						if targetGroup
							targetGroup.css "border", "1px solid #4696F7"

						else if target
							target.css "border-bottom", "1px solid #4696f7"


					stop: () ->
						items.each (i, e) ->
							$(e).css "border", "none"

						if targetGroup && !targetGroup.find(element).get(0) && !targetGroup.is(element)
							screenElementsManager.addChild targetGroup.scope().element.$$key, scope.element.$$key


						else if target && !target.find(element).get(0) && !target.is(element)  

							if target.parent().parent().parent().attr("id") != "hierarchy-body"				# スクリーン直下でないなら,まず親を変更する
								screenElementsManager.addChild target.closest("div").parent().scope().element.$$key, scope.element.$$key

							# zIndexを変える処理
							getLs = screenElementsManager.get
							fromUUID = scope.element.$$key
							toUUID = target.scope().element.$$key
							if getLs(fromUUID).zIndex <= getLs(toUUID).zIndex
								screenElementsManager.changeZIndex fromUUID, getLs(toUUID).zIndex
							else
								screenElementsManager.changeZIndex fromUUID, getLs(toUUID).zIndex + 1
				}


	}
]


# 要素を追加するボタン
.directive("addElementCard", ["CurrentScreenData","$compile", "getUUID"
(CurrentScreenData, $compile, getUUID) ->
	return {
		scope: true
		link: (scope, element, attrs) ->
			scope.onclick = () ->
				CurrentScreenData.elementsManager.add element.attr("add-element-card"), getUUID()
				return

	}
])



# 詳細設定
.controller "PropertyController", ["$scope", "$element", "CurrentScreenData", "SelectedElementUUID", "VisiblePropertyCards", "$timeout",　"$interval", "$rootScope",
($scope, $element, CurrentScreenData, SelectedElementUUID, VisiblePropertyCards, $timeout, $interval, $rootScope) ->
	$scope.visiblePropertyCards = []
	$scope.elementName = null
	$scope.isVisibleOffsetProperty = "none"
	screenElementsManager = CurrentScreenData.elementsManager
	VisiblePropertyCards.onchange (value, isTemplate) ->
		$timeout ()->									# applyが多重に実行されるとバグるので、代わりにtimeoutを使う
			$scope.visiblePropertyCards = value
			$scope.isVisibleOffsetProperty = "block"
			$scope.isTemplate = isTemplate

			if !isTemplate
				$scope.elementName = screenElementsManager.get(SelectedElementUUID.get())?.name
				$scope.element = screenElementsManager.get(SelectedElementUUID.get())

			else
				$scope.elementName = screenElementsManager.getTemplate(SelectedElementUUID.get())?.name
				$scope.element = screenElementsManager.getTemplate(SelectedElementUUID.get())

		, 0

	# 以下は offsetに関するプロパティの設定
# 	resizing = false
	$rootScope.$on "onResizedOrDraged", onResizedOrDraged
	
	onResizedOrDraged = (ev, element) ->		# editor.jsからbroadcastされる。
		resizing = true
		$timeout () ->
			$scope.top = parseInt element.css("top"), 10
			$scope.left = parseInt element.css("left"), 10
			if $scope.element?.unresizable != "xy"
				$scope.width = element.width()
				$scope.height = element.height()
		
	onResizedOrDraged(null, $element)
		
	

# 	$rootScope.$on "onResizedOrDraged", (ev) ->		# editor.jsからbroadcastされる。
# 		resizing = false

	$scope.onChangeTop = () ->
# 		if !resizing
		screenElementsManager.get(SelectedElementUUID.get())?.element.css "top", $scope.top
		screenElementsManager.set SelectedElementUUID.get(), "top", $scope.top

	$scope.onChangeLeft = () ->
# 		if !resizing
		screenElementsManager.get(SelectedElementUUID.get())?.element.css "left", $scope.left
		screenElementsManager.set SelectedElementUUID.get(), "left", $scope.left

	$scope.onChangeWidth = () ->
# 		if !resizing && $scope.element?.unresizable != "xy"
		screenElementsManager.get(SelectedElementUUID.get())?.element.width $scope.width
		screenElementsManager.set SelectedElementUUID.get(), "width", $scope.width

	$scope.onChangeHeight = () ->
# 		if !resizing && $scope.element?.unresizable != "xy"
		screenElementsManager.get(SelectedElementUUID.get())?.element.height $scope.height
		screenElementsManager.set SelectedElementUUID.get(), "height", $scope.height
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



# tag属性に書いてある値をタグとする空要素を作ってコンパイルする
.directive "crosetDynamicInput", ["$compile", ($compile) ->
	return {
		restrict: "E"
		scope: {
			tag: "="
			options: "="     # それぞれのインプットのデータ
		}
		compile: (element, attributes) ->
			return {
				pre: (scope, el, attrs) ->
					# make a new element having given tag name
					newEl = angular.element("<#{scope.tag}>").attr "options", angular.toJson scope.options
					# compile
					compiled = $compile(newEl[0]) scope
					el.append compiled
			}
		controller: ["$scope", "$attrs", "CurrentScreenData", "SelectedElementUUID", "SelectedTemplate", "SelectedElementOrTemplateUUID", "ProjectData",
		($scope, $attrs, CurrentScreenData, SelectedElementUUID, SelectedTemplate, SelectedElementOrTemplateUUID, ProjectData) ->

			this.onchange = (value) ->
				if !$scope.$parent.isTemplate
					CurrentScreenData.elementsManager.set SelectedElementUUID.get(), $scope.options.result, value
					
				else
					CurrentScreenData.elementsManager.setTemplateOption SelectedTemplate.get(), $scope.options.result, value

			this.onchange $scope.options.defaultValue
			
			boxProperty = CurrentScreenData.elementsManager?.boxProperties[SelectedElementOrTemplateUUID.get()]
			if boxProperty
				$scope.$parent.box = boxProperty[$scope.options.result]
				
				
			$scope.$parent.onDrop = (ev, ui) ->
				$scope.$parent.box = angular.element(ui.draggable).scope().box
				CurrentScreenData.elementsManager.setBoxToProperty SelectedElementOrTemplateUUID.get(), $scope.options.result, $scope.$parent.box
			
			ProjectData.onVariableChanged = (variables) ->
				if variables.indexOf($scope.$parent.$box) != -1
					$scope.$parent.box = null
					
			$scope.$parent.removeBoxToProperty = () ->
				CurrentScreenData.elementsManager.removeBoxToProperty SelectedElementOrTemplateUUID.get(), $scope.options.result, $scope.$parent.box
				
			return
		]
	}
]

.directive "crosetDynamicInputBorder", ["CurrentScreenData", "SelectedElementOrTemplateUUID", (CurrentScreenData, SelectedElementOrTemplateUUID) ->
	return {
		restrict: "C"
		link: (scope, el) ->
					
			scope.removeBox = (ev) ->
				scope.removeBoxToProperty()
				scope.box = null
				ev.stopPropagation()
				
			scope.hoverIn = () ->
				scope.hover = true
			
			scope.hoverOut = () ->
				scope.hover = false
				
	}
]

.directive "crosetText", () ->
	return {
		restirct: "E"
		scope: {
			options: "="
		}
		templateUrl: "input-text.html"
	}

.directive "crosetHeadline", () ->
	return {
		restirct: "E"
		scope: {
			options: "="
		}
		templateUrl: "input-headline.html"
	}

.directive("crosetColorIcon", ["$mdColorPicker", "GetTextColor", "HexToRgb", ($mdColorPicker, GetTextColor, HexToRgb) ->
	return {
		restrict: "E"
		scope: {
			options: "="
		}
		require: "^crosetDynamicInput"
		templateUrl: "input-color-icon.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.onclick = (ev)->
				$mdColorPicker.show {
					value: scope.color
					$event: ev
				}
				.then (color) ->
					setColor color

			setColor = (value)->
				scope.color = value
				scope.textColor = GetTextColor HexToRgb value

				dynamicInput.onchange scope.color


			setColor(scope.options.defaultValue)

	}
])

.directive("crosetToggleIcon", ["ColorPallet", (ColorPallet) ->
	return {
		restrict: "E"
		scope: {
			options: "="
		}
		require: "^crosetDynamicInput"
		templateUrl: "input-toggle-icon.html"
		link: (scope, element, attrs, dynamicInput) ->

			getColor = () ->
				if scope.disabled
					return "#888"
				else
					return ColorPallet.mc

			if angular.isUndefined scope.options.disabled
				scope.disabled = true
			else
				scope.disabled = scope.options.disabled

			scope.color = getColor()

			scope.onclick = ()->
				scope.disabled = !scope.disabled
				scope.color = getColor()
				dynamicInput.onchange(!scope.disabled)				# 変更イベントを呼び出し

	}
])

.directive("crosetCheckbox", [() ->
	return {
		restrict: "E"
		scope: {
			options: "="
		}
		require: "^crosetDynamicInput"
		templateUrl: "input-checkbox.html"
		link: (scope, element, attrs, dynamicInput) ->
			
			scope.value = scope.options.defaultValue
			scope.onchange = ()->
				dynamicInput.onchange scope.value				# 変更イベントを呼び出し

	}
])

.directive "crosetTextbox", ()->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-textbox.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value
	}

.directive "crosetTextarea", ()->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-textarea.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value
	}



.directive "crosetNumber", ()->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-number.html"
		link: (scope, element, attrs, dynamicInput) ->
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value
	}

.directive "crosetSlider", ["getUUID", (getUUID)->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-slider.html"

		link: (scope, element, attrs, dynamicInput) ->
			scope.id = getUUID()
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value
	}
]

.directive "crosetSelect", ["getUUID", (getUUID)->
	return {
		restrict: "E"
		require: "^crosetDynamicInput"
		scope: {
			options: "="
		}
		templateUrl: "input-select.html"

		link: (scope, element, attrs, dynamicInput) ->
			scope.id = getUUID()
			scope.value = scope.options.defaultValue
			scope.onchange = () ->
				dynamicInput.onchange scope.value

	}
]



.directive("crosetIcon", ["$mdDialog", ($mdDialog) ->
	return {
		restrict: "E"
		scope: {
			options: "="
		}
		require: "^crosetDynamicInput"
		templateUrl: "input-icon.html"
		link: (scope, element, attrs, dynamicInput) ->

			scope.icon = scope.options.defaultValue

			scope.onclick = (ev)->
				$mdDialog.show {
					controller: RunDialogController
					templateUrl: 'templates/icon-select-dialog.tmpl.html'
					parent: angular.element document.body
					windowClass: "icon-select-dialog"
					targetEvent: ev
					clickOutsideToClose: false
				}
				.then (answer) ->
					return
				, () ->
					return



			RunDialogController = ["$scope", ($scope) ->
				$scope.icons = {
					"アクション": ["3d_rotation","accessibility","accessible","account_balance","account_box","account_circle","add_shopping_cart","alarm","alarm_add","alarm_off","alarm_on","all_out","android","announcement","aspect_ratio","assessment","assignment","assignment_ind","assignment_late","assignment_return","assignment_returned","assignment_turned_in","autorenew","backup","book","bookmark","bookmark_border","bug_report","build","cached","camera_enhance","card_giftcard","card_membership","card_travel","change_history","check_circle","chrome_reader_mode","class","code","compare_arrows","copyright","credit_card","dashboard","date_range","delete","delete_forever","description","dns","done","done_all","donut_large","donut_small","eject","euro_symbol","event","event_seat","exit_to_app","explore","extension","face","favorite","favorite_border","feedback","find_in_page","find_replace","fingerprint","flight_land","flight_takeoff","flip_to_back","flip_to_front","g_translate","gavel","get_app","gif","grade","group_work","help","help_outline","highlight_off","history","home","hourglass_empty","hourglass_full","http","https","important_devices","info","info_outline","input","invert_colors","label","label_outline","language","launch","lightbulb_outline","line_style","line_weight","list","lock","lock_open","lock_outline","loyalty","markunread_mailbox","motorcycle","note_add","offline_pin","opacity","open_in_browser","open_in_new","open_with","pageview","pan_tool","payment","perm_camera_mic","perm_contact_calendar","perm_data_setting","perm_device_infomation","perm_identity","perm_media","perm_phone_msg","perm_scan_wifi","pets","picture_in_picture","picture_in_picture_alt","play_for_work","polymer","power_settings_new","pregnant_woman","print","query_builder","question_answer","receipt","record_voice_over","redeem","remove_shopping_cart","reorder","report_problem","restore","restore_page","room","rounded_corner","rowing","schedule","search","settings","settings_applications","settings_backup_restore","settings_bluetooth","settings_input_antenna","settings_cell","settings_ethernet","settings_brightness","settings_input_component","settings_input_hdmi","settings_input_svideo","settings_remote","settings_voice","shop","shop_two","shopping_basket","shopping_cart","speaker_notes","speaker_notes_off","spellcheck","star_rate","stars","store","subject","supervisor_account","swap_horiz","swap_vert","swap_vertical_circle","system_update_alt","tab","tab_unselected","theaters","thumb_down","thumb_up","thumb_up_down","timeline","toc","today","toll","touch_app","track_changes","translate","trending_down","trending_flat","trending_up","turned_in","verified_user","view_agenda","view_array","view_carousel","view_column","view_day","view_headline","view_list","view_module","view_quilt","view_stream","view_week","visibility","visibility_off","watch_later","work"]
				}

				$scope.onselect = (iconId) ->
					scope.icon = iconId
					dynamicInput.onchange iconId				# 変更イベントを呼び出し
					$mdDialog.hide()
			]

	}
])
