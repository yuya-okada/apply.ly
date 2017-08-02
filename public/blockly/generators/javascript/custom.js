


// TODO: もう少し賢い方法
setInterval(function() {
  Blockly.JavaScript['log'] = function (block) {
    console.log(block)
    var code = "console.log(" + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + ");\n";
    return code;
  }

  Blockly.JavaScript['controls_interval'] = function (block) {
    var code = "intervals.push($interval(function() {\n" + Blockly.JavaScript.statementToCode(block, "DO") + "}, " + block.getFieldValue("TIME") + "*1000));\n";
    return code;
  }

  Blockly.JavaScript['parse_int'] = function (block) {
    var code = "parseInt(" + Blockly.JavaScript.valueToCode(block, "ARG", Blockly.JavaScript.ORDER_NONE) + ")";
    return [code, Blockly.JavaScript.ORDER_NONE]
  }
	
	// テンプレートのインスタンス化
	Blockly.JavaScript["instantiate"] = function (block) {
    var code = "screenElementsManager.instantiate('" + block.getFieldValue("TEMPLATE") + "')";
    return code;
  }
	
	Blockly.JavaScript["instantiateTo"] = function (block) {
		var code = "screenElementsManager.instantiateTo('" + block.getFieldValue("TEMPLATE") + "', '" + block.getFieldValue("ELEMENT") + "')";
		return code;
	}
	
	Blockly.JavaScript["watch"] = function (block) {
    var code = "$scope.$watch(function() { \n return " + Blockly.JavaScript.valueToCode(block, "ARG", Blockly.JavaScript.ORDER_NONE)  + "\n}, function() {\n" + Blockly.JavaScript.statementToCode(block, "DO") + "});\n";
		return code;
	}
});




//########################################################################


if (!window.CrosetBlock) {
	window.CrosetBlock = {}
}

CrosetBlock.customBlockGenerator = {}

// 画面遷移
CrosetBlock.customBlockGenerator.intentBlockGenerator = function() {
  Blockly.JavaScript["intent"] = function (block) {
    var code = "stateGo('screen" + block.getFieldValue("ID") + "')";
    return code
  }
}

