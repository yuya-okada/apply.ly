var crosetModule;

crosetModule = angular.module("Croset");

crosetModule.factory("getUUID", function() {
  return function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };
}).factory("ScreenElementsManager", [
  "Elements", "ElementDatas", "$compile", "$injector", "getUUID", function(Elements, ElementDatas, $compile, $injector, getUUID) {
    return function(screenElement, status) {
      var childAddedCallbacks, initScope, initTemplatePreview, ref, ref1, screenScope, templatePreviewElement, templatePreviewScope, that;
      screenScope = null;
      templatePreviewElement = null;
      templatePreviewScope = null;
      screenElement.empty();
      this.varProperties = {};
      that = this;
      if (status == null) {
        status = "develop";
      }
      initScope = function() {
        screenScope = screenElement.scope();
        screenScope.get = that.get;
        screenScope.addChildElement = that.addChildElement;
        screenScope.getTemplate = that.getTemplate;
        screenScope.list = {};
        return screenScope.templates = {};
      };
      initTemplatePreview = function() {
        templatePreviewElement = $("#template-preview");
        return templatePreviewScope = templatePreviewElement.scope();
      };
      this.init = function() {
        screenScope = null;
        screenScope.list = {};
        return screenScope.templates = {};
      };
      this.getScope = function() {
        return screenScope;
      };
      this.get = function(id) {
        var result, searchInArray;
        if (id) {
          searchInArray = function(array) {
            var data, result, uuid;
            for (uuid in array) {
              data = array[uuid];
              if (uuid === id) {
                return data;
              } else {
                result = searchInArray(data.children);
                if (result) {
                  return result;
                }
              }
            }
            return null;
          };
          result = searchInArray(screenScope != null ? screenScope.list : void 0);
          return result;
        } else {
          return screenScope != null ? screenScope.list : void 0;
        }
      };
      this.set = function(id, key, value) {
        var searchInArray;
        searchInArray = function(array) {
          var b, data, result, uuid;
          b = that;
          for (uuid in array) {
            data = array[uuid];
            if (uuid === id) {
              array[uuid].options[key] = value;
              return true;
            } else {
              result = searchInArray(data.children);
              if (result) {
                return true;
              }
            }
          }
        };
        return searchInArray(screenScope != null ? screenScope.list : void 0);
      };
      this.setVariableToProperty = function(id, key, varId) {
        var base;
        if ((base = this.varProperties)[id] == null) {
          base[id] = {};
        }
        this.varProperties[id][key] = varId;
      };
      this.removeVariableToProperty = function(id, key) {
        var ref;
        return (ref = this.varProperties[id]) != null ? delete ref[key] : void 0;
      };
      this.getSiblings = function(id) {
        var searchParent;
        searchParent = function(array) {
          var data, result, uuid;
          for (uuid in array) {
            data = array[uuid];
            if (uuid === id) {
              return array;
            } else {
              result = searchParent(data.children);
              if (result) {
                return result;
              }
            }
          }
          return null;
        };
        return searchParent(screenScope != null ? screenScope.list : void 0);
      };
      this.setData = function(id, data) {
        var searchInArray;
        searchInArray = function(array) {
          var result, uuid;
          for (uuid in array) {
            data = array[uuid];
            if (uuid === id) {
              array[uuid] = data;
              return true;
            } else {
              result = searchInArray(data.children);
              if (result) {
                return true;
              }
            }
          }
        };
        return searchInArray(screenScope != null ? screenScope.list : void 0);
      };
      this.rename = function(uuid, name) {
        return this.get(uuid).name = name;
      };
      this.removeAll = function() {
        screenScope.list = {};
        screenElement.empty();
        return this.varProperties = {};
      };
      this.add = function(type, uuid) {
        var e, options, ref, scope;
        if (!screenScope) {
          initScope();
        }
        e = $("<croset-element-" + type + ">").addClass("croset-element").attr("id", uuid).attr("ng-class", "{'croset-element': true}").attr("croset-element-type", type).attr("uuid", uuid).attr("croset-element-editor", true).width(ElementDatas[type].width).height(ElementDatas[type].height).attr("ng-style", "{zIndex: s.get(uuid).zIndex}");
        scope = screenScope.$new(true);
        scope.uuid = uuid;
        scope.s = screenScope;
        options = {};
        screenScope.list[uuid] = {
          type: type,
          group: ElementDatas[type].group,
          name: ElementDatas[type].name,
          options: {
            top: "0px",
            left: "0px",
            width: ElementDatas[type].width,
            height: ElementDatas[type].height
          },
          zIndex: Object.keys(screenScope.list).length,
          unresizable: ElementDatas[type].unresizable
        };
        if ((ref = screenScope.zIndexes) != null) {
          ref.push(uuid);
        }
        screenScope.list[uuid].element = e;
        e = $compile(e)(scope);
        screenElement.append(e);
        return screenScope.list[uuid].element = e;
      };
      this.addFromData = function(data, uuid) {
        var e, scope;
        if (!screenScope) {
          initScope();
        }
        e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid).attr("ng-style", "{zIndex: s.get(uuid).zIndex}");
        if (status === "develop") {
          e.attr("croset-element-editor", true);
        }
        e.width(data.options.width).height(data.options.height).css({
          top: data.options.top,
          left: data.options.left
        });
        scope = screenScope.$new(true);
        scope.uuid = uuid;
        scope.s = screenScope;
        scope.elementsManager = this;
        screenScope.list[uuid] = data;
        e = $compile(e)(scope);
        screenElement.append(e);
        return data.element = e;
      };
      this["delete"] = function(uuid) {
        var VisiblePropertyCards;
        this.get(uuid).element.remove();
        if (status === "develop") {
          VisiblePropertyCards = $injector.get("VisiblePropertyCards");
          VisiblePropertyCards.set([]);
        }
        return this.deleteData(uuid);
      };
      this.duplicate = function(data) {
        var changeChildName, id;
        data = angular.copy(data);
        changeChildName = function(children) {
          var child, id, results;
          results = [];
          for (id in children) {
            child = children[id];
            children[getUUID()] = child;
            delete children[id];
            if (child != null ? child.children : void 0) {
              results.push(changeChildName(child.children));
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
        data.zIndex = Object.keys(screenScope.list).length;
        changeChildName(data.children);
        id = getUUID();
        this.addFromData(data, id);
        return id;
      };
      this.instantiate = function(id) {
        return this.duplicate(this.getTemplate(id));
      };
      this.instantiateTo = function(id, parentId) {
        var childData, childId;
        childData = this.getTemplate(id);
        childId = this.duplicate(childData);
        return this.addChild(parentId, childId);
      };
      this.deleteData = function(id) {
        var data, deleteInArray, ref, uuid;
        deleteInArray = function(array) {
          var data, results, uuid;
          if (array) {
            if (array[id]) {
              delete array[id];
            }
            results = [];
            for (uuid in array) {
              data = array[uuid];
              results.push(deleteInArray(data.children));
            }
            return results;
          }
        };
        ref = screenScope.list;
        for (uuid in ref) {
          data = ref[uuid];
          deleteInArray(data.children);
        }
        delete screenScope.list[id];
        return delete this.varProperties[id];
      };
      childAddedCallbacks = [];
      this.addChild = function(parentId, childId) {
        var base, callback, child, data, i, id, len, originalParent, results;
        originalParent = this.getSiblings(childId);
        if ((base = screenScope.get(parentId)).children == null) {
          base.children = {};
        }
        data = Object.assign({}, this.get(childId));
        this["delete"](childId);
        for (id in originalParent) {
          child = originalParent[id];
          if (child.zIndex > data.zIndex) {
            child.zIndex--;
          }
        }
        this.addChildElement(parentId, childId, data);
        screenScope.get(childId).zIndex = Object.keys(this.get(parentId).children).length;
        results = [];
        for (i = 0, len = childAddedCallbacks.length; i < len; i++) {
          callback = childAddedCallbacks[i];
          results.push(callback(childId, data));
        }
        return results;
      };
      that = this;
      this.addChildElement = function(parentId, childId, childData, isTemplate) {
        var e, ref, ref1, scope;
        if (!screenScope) {
          initScope();
        }
        if (!isTemplate) {
          this.get(parentId).children[childId] = childData;
        } else {
          this.getTemplate(parentId).children[childId] = childData;
        }
        $("#" + childId).remove();
        e = $("<croset-element-" + childData.type + ">").addClass("croset-element").attr("id", childId).attr("croset-element-type", childData.type).attr("uuid", childId).attr("ng-style", "{zIndex: s.get(uuid).zIndex}");
        if (status === "develop") {
          e.attr("croset-element-editor", true);
        }
        e.width(childData.options.width).height(childData.options.height).css({
          top: childData.options.top,
          left: childData.options.left
        });
        scope = screenScope.$new(true);
        scope.uuid = childId;
        scope.s = screenScope;
        scope.elementsManager = this;
        scope.isTemplate = isTemplate;
        e = $compile(e)(scope);
        childData.element = e;
        if (!isTemplate) {
          return e.appendTo((ref = this.get(parentId)) != null ? ref.element.children(".croset-element-group-div") : void 0);
        } else {
          return e.appendTo((ref1 = this.getTemplate(parentId)) != null ? ref1.element.children(".croset-element-group-div") : void 0);
        }
      };
      this.setAddChildCallback = function(fnc) {
        return childAddedCallbacks.push(fnc);
      };
      this.attachScript = function(uuid, scriptName) {
        var base, data;
        data = that.get(uuid);
        if (data.scripts == null) {
          data.scripts = {};
        }
        return (base = data.scripts)[scriptName] != null ? base[scriptName] : base[scriptName] = {
          exist: true
        };
      };
      this.dettachScript = function(uuid, scriptName) {
        var data;
        data = that.get(uuid);
        if (data.scripts) {
          return delete data.scripts[scriptName];
        }
      };
      this.runScript = function(uuid, script) {
        var func;
        if (status === "public") {
          func = new Function("$scope", script.sourceCode);
          return func(screenScope);
        }
      };
      this.template = function(uuid) {
        var element, ref, ref1, templateId;
        if (!screenScope) {
          initScope();
        }
        element = $.extend(true, {}, this.get(uuid));
        if (element != null) {
          if ((ref = element.options) != null) {
            ref.left = "";
          }
        }
        if (element != null) {
          if ((ref1 = element.options) != null) {
            ref1.top = "";
          }
        }
        templateId = getUUID();
        delete element.zIndex;
        return screenScope.templates[templateId] = element;
      };
      this.addTemplateFromData = function(data, uuid) {
        if (!screenScope) {
          initScope();
        }
        return screenScope.templates[uuid] = data;
      };
      this.getTemplates = function() {
        if (!screenScope) {
          initScope();
        }
        return screenScope.templates;
      };
      this.getTemplate = function(id) {
        var result, searchInArray;
        if (!screenScope) {
          initScope();
        }
        searchInArray = function(array) {
          var data, result, uuid;
          for (uuid in array) {
            data = array[uuid];
            if (uuid === id) {
              return data;
            } else {
              result = searchInArray(data.children);
              if (result) {
                return result;
              }
            }
          }
          return null;
        };
        result = searchInArray(screenScope.templates);
        return result;
      };
      this.setTemplateOption = function(id, key, value) {
        var searchInArray;
        searchInArray = function(array) {
          var data, result, uuid;
          for (uuid in array) {
            data = array[uuid];
            if (uuid === id) {
              array[uuid].options[key] = value;
              return true;
            } else {
              result = searchInArray(data.children);
              if (result) {
                return true;
              }
            }
          }
        };
        return searchInArray(screenScope != null ? screenScope.templates : void 0);
      };
      this.renameTemplate = function(uuid, name) {
        return this.getTemplate(uuid).name = name;
      };
      this.deleteTemplate = function(uuid) {
        var VisiblePropertyCards, ref;
        if ((ref = this.getTemplate(uuid).element) != null) {
          if (typeof ref.remove === "function") {
            ref.remove();
          }
        }
        VisiblePropertyCards = $injector.get("VisiblePropertyCards");
        VisiblePropertyCards.set([]);
        return this.deleteTemplateData(uuid);
      };
      this.deleteTemplateData = function(id) {
        var data, deleteInArray, ref, uuid;
        deleteInArray = function(array) {
          var data, results, uuid;
          if (array) {
            if (array[id]) {
              delete array[id];
            }
            results = [];
            for (uuid in array) {
              data = array[uuid];
              results.push(deleteInArray(data.children));
            }
            return results;
          }
        };
        ref = screenScope.templates;
        for (uuid in ref) {
          data = ref[uuid];
          deleteInArray(data.children);
        }
        delete screenScope.templates[id];
        return delete this.varProperties[id];
      };
      this.showTemplate = function(uuid) {
        var data, e, scope;
        if (!templatePreviewScope) {
          initTemplatePreview();
        }
        templatePreviewElement.empty();
        data = this.getTemplate(uuid);
        e = $("<croset-element-" + data.type + ">").addClass("croset-element").attr("id", uuid).attr("croset-element-type", data.type).attr("uuid", uuid);
        e.width(data.options.width).height(data.options.height).css({
          top: data.options.top,
          left: data.options.left
        });
        scope = templatePreviewScope.$new(true);
        scope.uuid = uuid;
        scope.isTemplate = true;
        scope.elementsManager = this;
        scope.s = {
          get: this.getTemplate
        };
        e = $compile(e)(scope);
        templatePreviewElement.append(e);
        return this.getTemplate(uuid).element = e;
      };
      this.changeZIndex = function(fromUUID, toZIndex) {
        var child, fromZIndex, id, parent;
        fromZIndex = this.get(fromUUID).zIndex;
        parent = this.getSiblings(fromUUID);
        if (fromZIndex <= toZIndex) {
          for (id in parent) {
            child = parent[id];
            if ((child.zIndex <= toZIndex) && (child.zIndex > fromZIndex)) {
              console.log(child.zIndex);
              child.zIndex--;
            }
          }
        } else {
          for (id in parent) {
            child = parent[id];
            if ((child.zIndex >= toZIndex) && (child.zIndex < fromZIndex)) {
              child.zIndex++;
            }
          }
        }
        this.get(fromUUID).zIndex = toZIndex;
        return screenScope.$apply();
      };
      this.initialize = function() {
        screenScope.list = {};
        return screenElement.empty();
      };
      if ((ref = window.CrosetBlock) != null) {
        ref.get = this.get;
      }
      if ((ref1 = window.CrosetBlock) != null) {
        ref1.getTemplate = this.getTemplate;
      }
    };
  }
]).directive("crosetElement", [
  "ProjectData", function(ProjectData) {
    return {
      restrict: "C",
      scope: false,
      link: function(scope, element, attrs) {
        var ref, ref1, ref2, results, script, scriptData, scriptName;
        if (!scope.isTemplate) {
          ref1 = (ref = scope.s.get(scope.uuid)) != null ? ref.scripts : void 0;
          results = [];
          for (scriptName in ref1) {
            scriptData = ref1[scriptName];
            script = ProjectData.scripts[scriptName];
            results.push((ref2 = scope.elementsManager) != null ? ref2.runScript(scope.uuid, script) : void 0);
          }
          return results;
        }
      }
    };
  }
]).directive("crosetElementGroup", [
  function() {
    return {
      restrict: "E",
      templateUrl: "template-group.html",
      link: function(scope, element, attrs) {
        var data, id, ref, ref1, results;
        ref1 = (ref = scope.s.get(scope.uuid)) != null ? ref.children : void 0;
        results = [];
        for (id in ref1) {
          data = ref1[id];
          results.push(scope.elementsManager.addChildElement(scope.uuid, id, data, scope.isTemplate));
        }
        return results;
      }
    };
  }
]).directive("crosetElementListgroup", [
  function() {
    return {
      restrict: "E",
      templateUrl: "template-listgroup.html",
      link: function(scope, element, attrs) {
        var data, id, ref, ref1, results;
        ref1 = (ref = scope.s.get(scope.uuid)) != null ? ref.children : void 0;
        results = [];
        for (id in ref1) {
          data = ref1[id];
          results.push(scope.elementsManager.addChildElement(scope.uuid, id, data, scope.isTemplate));
        }
        return results;
      }
    };
  }
]).directive("crosetElementButton", function() {
  return {
    restrict: "E",
    templateUrl: "template-button.html",
    link: function(scope, element, attrs) {
      return scope.click = function() {
        var fnc;
        fnc = scope.s.get(scope.uuid).options.click;
        if (fnc) {
          return fnc();
        }
      };
    }
  };
}).directive("crosetElementText", function() {
  return {
    restrict: "E",
    templateUrl: "template-text.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementIcon", function() {
  return {
    restrict: "E",
    templateUrl: "template-icon.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementTextbox", function() {
  return {
    restrict: "E",
    templateUrl: "template-textbox.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementSquare", function() {
  return {
    restrict: "E",
    templateUrl: "template-square.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementCheckbox", function() {
  return {
    restrict: "E",
    templateUrl: "template-checkbox.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementSwitch", function() {
  return {
    restrict: "E",
    templateUrl: "template-switch.html",
    link: function(scope, element, attrs) {}
  };
}).directive("crosetElementSlider", function() {
  return {
    restrict: "E",
    templateUrl: "template-slider.html",
    link: function(scope, element, attrs) {}
  };
});
