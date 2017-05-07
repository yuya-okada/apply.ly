


// TODO: なぜintervalがないと動かないの？もう少し賢い方法
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
});





//########################################################################

// 画面遷移
CrosetBlock.intentBlockGenerator = function() {
  console.log("ビルド");
  Blockly.JavaScript["intent"] = function (block) {
    var code = "stateGo('screen" + block.getFieldValue("ID") + "')";
    console.log("インテント", block.getFieldValue("ID"));
    return code
  }
}
