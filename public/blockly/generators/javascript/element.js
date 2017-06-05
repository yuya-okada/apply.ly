CrosetBlock.setGenerators = function(id, type) {
  switch (type) {

    case "button":
      Blockly.JavaScript['button_text_set_' + id] = function (block) {

        var code = "$scope.list['" + id + "'].options.text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
        return code
      };
      Blockly.JavaScript['button_text_get_' + id] = function (block) {
        var code = "$scope.list['" + id + "'].options.text";
        return [code, Blockly.JavaScript.ORDER_NONE]
      };
      Blockly.JavaScript['button_onclick_' + id] = function (block) {
        var code = "$scope.list['" + id + "'].options.click = function() {\n" + Blockly.JavaScript.statementToCode(block, "STATEMENT") + "\n}\n";
        return code
      };

    break;

    case "text":
      Blockly.JavaScript['text_text_set_' + id] = function (block) {
        var code = "$scope.list['" + id + "'].options.text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
        return code
      };
      Blockly.JavaScript['text_text_get_' + id] = function (block) {
        var code = "$scope.list['" + id + "'].options.text";
        return [code, Blockly.JavaScript.ORDER_NONE]
      };

    break;

    case "textbox":
      console.log("ここには来ました")
      Blockly.JavaScript['textbox_text_set_' + id] = function (block) {
        var code = "$scope.list['" + id + "'].options.text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
        return code
      };
      Blockly.JavaScript['textbox_text_get_' + id] = function (block) {
        console.log(block)
        var code = "$scope.list['" + id + "'].options.text";
        console.log(code)
        return [code, Blockly.JavaScript.ORDER_NONE]
      };

    break;

  }
}
