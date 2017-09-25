var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.service("VisiblePropertyCards", function() {
  var boxes, callback, callbacks, list;
  list = [];
  callbacks = [];
  boxes = [];
  this.onchange = function(func) {
    return callbacks.push(func);
  };
  this.get = function() {
    return list;
  };
  this.set = function(ls, isTemplate) {
    list = ls;
    return callback(isTemplate);
  };
  this.push = function(val) {
    list.push(val);
    return callback();
  };
  callback = function(isTemplate) {
    var func, l, len, results;
    results = [];
    for (l = 0, len = callbacks.length; l < len; l++) {
      func = callbacks[l];
      results.push(func(list, isTemplate));
    }
    return results;
  };
}).service("SetElementProperty", [
  "VisiblePropertyCards", "ElementDatas", "CurrentScreenData", function(VisiblePropertyCards, ElementDatas, CurrentScreenData) {
    return function(uuid, isTemplate) {
      var data, defaultData, i, input, j, k, l, len, len1, len2, m, n, property, ref, result, row;
      VisiblePropertyCards.set([]);
      data = null;
      if (!isTemplate) {
        data = CurrentScreenData.elementsManager.get(uuid);
      } else {
        data = CurrentScreenData.elementsManager.getTemplate(uuid);
      }
      defaultData = [].concat(ElementDatas[data.type].properties);
      for (i = l = 0, len = defaultData.length; l < len; i = ++l) {
        property = defaultData[i];
        ref = property.propertyInputs;
        for (j = m = 0, len1 = ref.length; m < len1; j = ++m) {
          row = ref[j];
          for (k = n = 0, len2 = row.length; n < len2; k = ++n) {
            input = row[k];
            result = input.options.result;
            if (result && data.options[result]) {
              defaultData[i].propertyInputs[j][k].options.defaultValue = data.options[result];
            }
          }
        }
      }
      return VisiblePropertyCards.set(defaultData, isTemplate);
    };
  }
]).controller("HierarchyController", [
  "$scope", "CurrentScreenData", "ElementDatas", "SelectedElementUUID", "$interval", function($scope, CurrentScreenData, ElementDatas, SelectedElementUUID, $interval) {
    var screenElementsManager;
    screenElementsManager = CurrentScreenData.elementsManager;
    $scope.screenElements = screenElementsManager.get();
    $scope.elementDatas = ElementDatas;
    $scope.templates = screenElementsManager.getTemplates();
    $scope.$watch(function() {
      return Object.keys(screenElementsManager.get()).length;
    }, function(newVal, oldVal) {
      if (newVal) {
        $scope.selectedElementUUID = newVal;
        $scope.screenElements = screenElementsManager.get();
        $scope.templates = screenElementsManager.getTemplates();
        return console.log(screenElementsManager);
      }
    });
    screenElementsManager.setAddChildCallback(function() {
      $scope.screenElements = screenElementsManager.get();
      return $scope.$apply();
    });
    $scope.reverse = false;
    return $interval(function() {
      return $scope.reverse = !$scope.reverse;
    }, 1000);
  }
]).directive("hierarchyChildItem", [
  "$compile", function($compile) {
    return {
      restrict: "E",
      require: "^hierarchyItem",
      link: function(scope, element, attrs, hierarchyItem) {
        var e;
        e = angular.element("<hierarchy-item>");
        e.attr("istemplate", hierarchyItem.isTemplate);
        e = $compile(e)(scope);
        return e.appendTo(element);
      }
    };
  }
]).directive("crosetHierarchyItem", [
  "$mdDialog", "$compile", "ElementDatas", "SelectedElementUUID", "CurrentScreenData", "SelectedTemplate", "getUUID", "ListItemSelect", function($mdDialog, $compile, ElementDatas, SelectedElementUUID, CurrentScreenData, SelectedTemplate, getUUID, ListItemSelect) {
    return {
      restrict: "A",
      require: "^hierarchyItem",
      link: function(scope, element, attrs, hierarchyItem) {
        var itemDatas, items, screenElementsManager, target, targetGroup;
        screenElementsManager = CurrentScreenData.elementsManager;
        scope.isTemplate = hierarchyItem.isTemplate;
        scope.onclick = function(data) {
          if (!hierarchyItem.isTemplate) {
            SelectedElementUUID.set(scope.element.$$key);
          } else {
            SelectedTemplate.set(scope.element.$$key);
          }
          ListItemSelect.close();
        };
        scope.showPromptRename = function(ev) {
          var confirm;
          confirm = $mdDialog.prompt().title('名前を変更').textContent(scope.element.name + "の名前を変更します。").placeholder('').ariaLabel('新しい名前を入力').targetEvent(ev).ok('OK!').cancel('キャンセル');
          return $mdDialog.show(confirm).then(function(result) {
            if (!hierarchyItem.isTemplate) {
              return screenElementsManager.rename(scope.element.$$key, result);
            } else {
              return screenElementsManager.renameTemplate(scope.element.$$key, result);
            }
          }, function() {});
        };
        scope.showConfirmDelete = function(ev) {
          var confirm;
          confirm = $mdDialog.confirm().title("削除").content("'" + scope.element.name + "' を削除します").targetEvent(ev).ok("OK").cancel("キャンセル");
          return $mdDialog.show(confirm).then(function() {
            if (!hierarchyItem.isTemplate) {
              return screenElementsManager["delete"](scope.element.$$key);
            } else {
              return screenElementsManager.deleteTemplate(scope.element.$$key);
            }
          }, function() {});
        };
        scope.duplicate = function(ev) {
          return screenElementsManager.duplicate(scope.element);
        };
        scope.addTemplate = function() {
          return screenElementsManager.template(scope.element.$$key);
        };
        if (!hierarchyItem.isTemplate) {
          itemDatas = [];
          items = null;
          targetGroup = null;
          target = null;
          return $(element).draggable({
            axis: "y",
            helper: "clone",
            cancel: null,
            start: function() {
              itemDatas = [];
              items = $("#hierarchy-body").find("hierarchy-item").children("md-list-item");
              return items.each(function(i, e) {
                return itemDatas.push([angular.element(e), $(e).offset().top, $(e).offset().top + $(e).height()]);
              });
            },
            drag: function(ev, ui) {
              var height, i, itemData, l, len, top;
              targetGroup = null;
              target = null;
              top = $(ui.helper).offset().top;
              height = $(ui.helper).height();
              items.each(function(i, e) {
                return $(e).css("border", "none");
              });
              for (i = l = 0, len = itemDatas.length; l < len; i = ++l) {
                itemData = itemDatas[i];
                if (itemData[0].hasClass("hierarchy-group")) {
                  if ((itemData[1] < top) && (itemData[2] > top)) {
                    targetGroup = itemData[0];
                    break;
                  }
                }
                if (((itemData[1] + itemData[2]) / 2 < top) && (itemData[0] !== element)) {
                  target = itemData[0];
                }
              }
              if (targetGroup) {
                return targetGroup.css("border", "1px solid #4696F7");
              } else if (target) {
                return target.css("border-bottom", "1px solid #4696f7");
              }
            },
            stop: function() {
              var fromUUID, getLs, toUUID;
              items.each(function(i, e) {
                return $(e).css("border", "none");
              });
              if (targetGroup && !targetGroup.find(element).get(0) && !targetGroup.is(element)) {
                return screenElementsManager.addChild(targetGroup.scope().element.$$key, scope.element.$$key);
              } else if (target && !target.find(element).get(0) && !target.is(element)) {
                if (target.parent().parent().parent().attr("id") !== "hierarchy-body") {
                  screenElementsManager.addChild(target.closest("div").parent().scope().element.$$key, scope.element.$$key);
                }
                getLs = screenElementsManager.get;
                fromUUID = scope.element.$$key;
                toUUID = target.scope().element.$$key;
                if (getLs(fromUUID).zIndex <= getLs(toUUID).zIndex) {
                  return screenElementsManager.changeZIndex(fromUUID, getLs(toUUID).zIndex);
                } else {
                  return screenElementsManager.changeZIndex(fromUUID, getLs(toUUID).zIndex + 1);
                }
              }
            }
          });
        }
      }
    };
  }
]).directive("addElementCard", [
  "CurrentScreenData", "$compile", "getUUID", function(CurrentScreenData, $compile, getUUID) {
    return {
      scope: true,
      link: function(scope, element, attrs) {
        return scope.onclick = function() {
          CurrentScreenData.elementsManager.add(element.attr("add-element-card"), getUUID());
        };
      }
    };
  }
]).controller("PropertyController", [
  "$scope", "$element", "CurrentScreenData", "ProjectData", "SelectedElementOrTemplateUUID", "SelectedElementUUID", "VisiblePropertyCards", "$timeout", "$interval", "$rootScope", function($scope, $element, CurrentScreenData, ProjectData, SelectedElementOrTemplateUUID, SelectedElementUUID, VisiblePropertyCards, $timeout, $interval, $rootScope) {
    var ref, reloadCards, screenElementsManager;
    $scope.visiblePropertyCards = [];
    $scope.elementName = null;
    $scope.currentScreenData = CurrentScreenData;
    if ((ref = CurrentScreenData.style) != null) {
      if (ref.overflowY == null) {
        ref.overflowY = "hidden";
      }
    }
    $scope.scripts = ProjectData.scripts;
    $scope.isVisibleOffsetProperty = "none";
    screenElementsManager = CurrentScreenData.elementsManager;
    reloadCards = function(value, isTemplate) {
      return $timeout(function() {
        var ref1, ref2;
        $scope.visiblePropertyCards = value;
        $scope.isVisibleOffsetProperty = "block";
        $scope.isTemplate = isTemplate;
        if (!isTemplate) {
          $scope.elementName = (ref1 = screenElementsManager.get(SelectedElementUUID.get())) != null ? ref1.name : void 0;
          return $scope.element = screenElementsManager.get(SelectedElementUUID.get());
        } else {
          $scope.elementName = (ref2 = screenElementsManager.getTemplate(SelectedElementUUID.get())) != null ? ref2.name : void 0;
          return $scope.element = screenElementsManager.getTemplate(SelectedElementUUID.get());
        }
      }, 0);
    };
    VisiblePropertyCards.onchange(reloadCards);
    $scope.$on("onResizedOrDraged", function(ev, element) {
      var resizing;
      resizing = true;
      return $timeout(function() {
        var ref1;
        $scope.top = parseInt(element.css("top"), 10);
        $scope.left = parseInt(element.css("left"), 10);
        if (((ref1 = $scope.element) != null ? ref1.unresizable : void 0) !== "xy") {
          $scope.width = element.width();
          return $scope.height = element.height();
        }
      });
    });
    $rootScope.$broadcast("onResizedOrDraged", $element);
    $scope.onChangeTop = function() {
      var ref1;
      if ((ref1 = screenElementsManager.get(SelectedElementUUID.get())) != null) {
        ref1.element.css("top", $scope.top);
      }
      return screenElementsManager.set(SelectedElementUUID.get(), "top", $scope.top);
    };
    $scope.onChangeLeft = function() {
      var ref1;
      if ((ref1 = screenElementsManager.get(SelectedElementUUID.get())) != null) {
        ref1.element.css("left", $scope.left);
      }
      return screenElementsManager.set(SelectedElementUUID.get(), "left", $scope.left);
    };
    $scope.onChangeWidth = function() {
      var ref1;
      if ((ref1 = screenElementsManager.get(SelectedElementUUID.get())) != null) {
        ref1.element.width($scope.width);
      }
      return screenElementsManager.set(SelectedElementUUID.get(), "width", $scope.width);
    };
    $scope.onChangeHeight = function() {
      var ref1;
      if ((ref1 = screenElementsManager.get(SelectedElementUUID.get())) != null) {
        ref1.element.height($scope.height);
      }
      return screenElementsManager.set(SelectedElementUUID.get(), "height", $scope.height);
    };
    $scope.attachScript = function(scriptName) {
      screenElementsManager.attachScript(SelectedElementOrTemplateUUID.get(), scriptName);
      return reloadCards($scope.visiblePropertyCards, $scope.isTemplate);
    };
    return $scope.dettachScript = function(scriptName) {
      screenElementsManager.dettachScript(SelectedElementOrTemplateUUID.get(), scriptName);
      return reloadCards($scope.visiblePropertyCards, $scope.isTemplate);
    };
  }
]).directive("propertyCard", function() {
  return {
    restrict: "C",
    controller: [
      "$scope", "$element", function($scope, $element) {
        return $scope.cardToggle = false;
      }
    ]
  };
}).directive("crosetDynamicInput", [
  "$compile", function($compile) {
    return {
      restrict: "E",
      scope: {
        tag: "=",
        options: "="
      },
      compile: function(element, attributes) {
        return {
          pre: function(scope, el, attrs) {
            var compiled, newEl;
            newEl = angular.element("<" + scope.tag + ">").attr("options", angular.toJson(scope.options));
            compiled = $compile(newEl[0])(scope);
            return el.append(compiled);
          }
        };
      },
      controller: [
        "$scope", "$attrs", "CurrentScreenData", "SelectedElementUUID", "SelectedTemplate", "SelectedElementOrTemplateUUID", "ProjectData", function($scope, $attrs, CurrentScreenData, SelectedElementUUID, SelectedTemplate, SelectedElementOrTemplateUUID, ProjectData) {
          var ref, varProperty;
          this.onchange = function(value) {
            if (!$scope.$parent.isTemplate) {
              return CurrentScreenData.elementsManager.set(SelectedElementUUID.get(), $scope.options.result, value);
            } else {
              return CurrentScreenData.elementsManager.setTemplateOption(SelectedTemplate.get(), $scope.options.result, value);
            }
          };
          this.onchange($scope.options.defaultValue);
          varProperty = (ref = CurrentScreenData.elementsManager) != null ? ref.varProperties[SelectedElementOrTemplateUUID.get()] : void 0;
          if (varProperty) {
            $scope.$parent.varId = varProperty[$scope.options.result];
            $scope.$parent["var"] = ProjectData.variables[$scope.$parent.varId];
          }
          $scope.$parent.onDrop = function(ev, ui) {
            $scope.$parent.varId = angular.element(ui.draggable).scope().varId;
            $scope.$parent["var"] = angular.element(ui.draggable).scope()["var"];
            return CurrentScreenData.elementsManager.setVariableToProperty(SelectedElementOrTemplateUUID.get(), $scope.options.result, $scope.$parent.varId);
          };
          ProjectData.onVariableChanged = function(variables) {
            if (!variables[$scope.$parent.$varId]) {
              $scope.$parent["var"] = null;
              return $scope.$parent.varId = null;
            }
          };
          $scope.$parent.removeVariableToProperty = function() {
            return CurrentScreenData.elementsManager.removeVariableToProperty(SelectedElementOrTemplateUUID.get(), $scope.options.result, $scope.$parent.varId);
          };
        }
      ]
    };
  }
]).directive("crosetDynamicInputBorder", [
  "CurrentScreenData", "SelectedElementOrTemplateUUID", function(CurrentScreenData, SelectedElementOrTemplateUUID) {
    return {
      restrict: "C",
      link: function(scope, el) {
        scope.removeVar = function(ev) {
          scope.removeVariableToProperty();
          scope["var"] = null;
          return scope.varId = null;
        };
        scope.hoverIn = function() {
          return scope.hover = true;
        };
        return scope.hoverOut = function() {
          return scope.hover = false;
        };
      }
    };
  }
]).directive("crosetText", function() {
  return {
    restirct: "E",
    scope: {
      options: "="
    },
    templateUrl: "input-text.html"
  };
}).directive("crosetHeadline", function() {
  return {
    restirct: "E",
    scope: {
      options: "="
    },
    templateUrl: "input-headline.html"
  };
}).directive("crosetColorIcon", [
  "$mdColorPicker", "GetTextColor", "HexToRgb", function($mdColorPicker, GetTextColor, HexToRgb) {
    return {
      restrict: "E",
      scope: {
        options: "="
      },
      require: "^crosetDynamicInput",
      templateUrl: "input-color-icon.html",
      link: function(scope, element, attrs, dynamicInput) {
        var setColor;
        scope.onclick = function(ev) {
          return $mdColorPicker.show({
            value: scope.color,
            $event: ev,
            alphaChannel: true
          }).then(function(color) {
            return setColor(color);
          });
        };
        setColor = function(value) {
          scope.color = value;
          if (value.indexOf("#") !== -1) {
            scope.textColor = GetTextColor(HexToRgb(value));
          }
          if (value.indexOf("hsl") !== -1) {
            scope.textColor = GetTextColor(value);
          }
          return dynamicInput.onchange(scope.color);
        };
        return setColor(scope.options.defaultValue);
      }
    };
  }
]).directive("crosetToggleIcon", [
  "ColorPallet", function(ColorPallet) {
    return {
      restrict: "E",
      scope: {
        options: "="
      },
      require: "^crosetDynamicInput",
      templateUrl: "input-toggle-icon.html",
      link: function(scope, element, attrs, dynamicInput) {
        var getColor;
        getColor = function() {
          if (scope.disabled) {
            return "#888";
          } else {
            return ColorPallet.mc;
          }
        };
        if (angular.isUndefined(scope.options.disabled)) {
          scope.disabled = true;
        } else {
          scope.disabled = scope.options.disabled;
        }
        scope.color = getColor();
        return scope.onclick = function() {
          scope.disabled = !scope.disabled;
          scope.color = getColor();
          return dynamicInput.onchange(!scope.disabled);
        };
      }
    };
  }
]).directive("crosetCheckbox", [
  function() {
    return {
      restrict: "E",
      scope: {
        options: "="
      },
      require: "^crosetDynamicInput",
      templateUrl: "input-checkbox.html",
      link: function(scope, element, attrs, dynamicInput) {
        scope.value = scope.options.defaultValue;
        return scope.onchange = function() {
          return dynamicInput.onchange(scope.value);
        };
      }
    };
  }
]).directive("crosetTextbox", function() {
  return {
    restrict: "E",
    require: "^crosetDynamicInput",
    scope: {
      options: "="
    },
    templateUrl: "input-textbox.html",
    link: function(scope, element, attrs, dynamicInput) {
      scope.value = scope.options.defaultValue;
      return scope.onchange = function() {
        return dynamicInput.onchange(scope.value);
      };
    }
  };
}).directive("crosetTextarea", function() {
  return {
    restrict: "E",
    require: "^crosetDynamicInput",
    scope: {
      options: "="
    },
    templateUrl: "input-textarea.html",
    link: function(scope, element, attrs, dynamicInput) {
      scope.value = scope.options.defaultValue;
      return scope.onchange = function() {
        return dynamicInput.onchange(scope.value);
      };
    }
  };
}).directive("crosetNumber", function() {
  return {
    restrict: "E",
    require: "^crosetDynamicInput",
    scope: {
      options: "="
    },
    templateUrl: "input-number.html",
    link: function(scope, element, attrs, dynamicInput) {
      scope.value = scope.options.defaultValue;
      return scope.onchange = function() {
        return dynamicInput.onchange(scope.value);
      };
    }
  };
}).directive("crosetSlider", [
  "getUUID", function(getUUID) {
    return {
      restrict: "E",
      require: "^crosetDynamicInput",
      scope: {
        options: "="
      },
      templateUrl: "input-slider.html",
      link: function(scope, element, attrs, dynamicInput) {
        scope.id = getUUID();
        scope.value = scope.options.defaultValue;
        return scope.onchange = function() {
          return dynamicInput.onchange(scope.value);
        };
      }
    };
  }
]).directive("crosetSelect", [
  "getUUID", function(getUUID) {
    return {
      restrict: "E",
      require: "^crosetDynamicInput",
      scope: {
        options: "="
      },
      templateUrl: "input-select.html",
      link: function(scope, element, attrs, dynamicInput) {
        scope.id = getUUID();
        scope.value = scope.options.defaultValue;
        return scope.onchange = function() {
          return dynamicInput.onchange(scope.value);
        };
      }
    };
  }
]).directive("crosetIcon", [
  "$mdDialog", function($mdDialog) {
    return {
      restrict: "E",
      scope: {
        options: "="
      },
      require: "^crosetDynamicInput",
      templateUrl: "input-icon.html",
      link: function(scope, element, attrs, dynamicInput) {
        var RunDialogController;
        scope.icon = scope.options.defaultValue;
        scope.onclick = function(ev) {
          return $mdDialog.show({
            controller: RunDialogController,
            templateUrl: 'templates/icon-select-dialog.tmpl.html',
            parent: angular.element(document.body),
            windowClass: "icon-select-dialog",
            targetEvent: ev,
            clickOutsideToClose: false
          }).then(function(answer) {}, function() {});
        };
        return RunDialogController = [
          "$scope", function($scope) {
            $scope.icons = {
              "アクション": ["3d_rotation", "accessibility", "accessible", "account_balance", "account_box", "account_circle", "add_shopping_cart", "alarm", "alarm_add", "alarm_off", "alarm_on", "all_out", "android", "announcement", "aspect_ratio", "assessment", "assignment", "assignment_ind", "assignment_late", "assignment_return", "assignment_returned", "assignment_turned_in", "autorenew", "backup", "book", "bookmark", "bookmark_border", "bug_report", "build", "cached", "camera_enhance", "card_giftcard", "card_membership", "card_travel", "change_history", "check_circle", "chrome_reader_mode", "class", "code", "compare_arrows", "copyright", "credit_card", "dashboard", "date_range", "delete", "delete_forever", "description", "dns", "done", "done_all", "donut_large", "donut_small", "eject", "euro_symbol", "event", "event_seat", "exit_to_app", "explore", "extension", "face", "favorite", "favorite_border", "feedback", "find_in_page", "find_replace", "fingerprint", "flight_land", "flight_takeoff", "flip_to_back", "flip_to_front", "g_translate", "gavel", "get_app", "gif", "grade", "group_work", "help", "help_outline", "highlight_off", "history", "home", "hourglass_empty", "hourglass_full", "http", "https", "important_devices", "info", "info_outline", "input", "invert_colors", "label", "label_outline", "language", "launch", "lightbulb_outline", "line_style", "line_weight", "list", "lock", "lock_open", "lock_outline", "loyalty", "markunread_mailbox", "motorcycle", "note_add", "offline_pin", "opacity", "open_in_browser", "open_in_new", "open_with", "pageview", "pan_tool", "payment", "perm_camera_mic", "perm_contact_calendar", "perm_data_setting", "perm_device_infomation", "perm_identity", "perm_media", "perm_phone_msg", "perm_scan_wifi", "pets", "picture_in_picture", "picture_in_picture_alt", "play_for_work", "polymer", "power_settings_new", "pregnant_woman", "print", "query_builder", "question_answer", "receipt", "record_voice_over", "redeem", "remove_shopping_cart", "reorder", "report_problem", "restore", "restore_page", "room", "rounded_corner", "rowing", "schedule", "search", "settings", "settings_applications", "settings_backup_restore", "settings_bluetooth", "settings_input_antenna", "settings_cell", "settings_ethernet", "settings_brightness", "settings_input_component", "settings_input_hdmi", "settings_input_svideo", "settings_remote", "settings_voice", "shop", "shop_two", "shopping_basket", "shopping_cart", "speaker_notes", "speaker_notes_off", "spellcheck", "star_rate", "stars", "store", "subject", "supervisor_account", "swap_horiz", "swap_vert", "swap_vertical_circle", "system_update_alt", "tab", "tab_unselected", "theaters", "thumb_down", "thumb_up", "thumb_up_down", "timeline", "toc", "today", "toll", "touch_app", "track_changes", "translate", "trending_down", "trending_flat", "trending_up", "turned_in", "verified_user", "view_agenda", "view_array", "view_carousel", "view_column", "view_day", "view_headline", "view_list", "view_module", "view_quilt", "view_stream", "view_week", "visibility", "visibility_off", "watch_later", "work"]
            };
            return $scope.onselect = function(iconId) {
              scope.icon = iconId;
              dynamicInput.onchange(iconId);
              return $mdDialog.hide();
            };
          }
        ];
      }
    };
  }
]);
