CrosetBlock.setElementBlocks = function () {
  
  set(true);
  set(false);
  
  function set(isTemplate) {
    typeText = ""
    if (isTemplate) {
      typeText = "template"
    } else {
      typeText = "element"
    }

    function getOptionsText (block) {
      if (isTemplate) {
        return "$scope.getTemplate('" + block.getFieldValue("ELEMENT") + "').options"
      } else {
        return "$scope.get('" + block.getFieldValue("ELEMENT") + "').options"
      }
    }

    //  button
    Blockly.JavaScript['button_text_set_' + typeText] = function (block) {
      var code = getOptionsText(block) + ".text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
      return code
    };
    Blockly.JavaScript['button_text_get_' + typeText] = function (block) {
      var code = getOptionsText(block) + ".text";
      return [code, Blockly.JavaScript.ORDER_NONE]
    };
    Blockly.JavaScript['button_onclick_' + typeText] = function (block) {
      var code = getOptionsText(block) + ".click = function() {\n" + Blockly.JavaScript.statementToCode(block, "STATEMENT") + "\n}\n";
      return code
    };


    //  text
    Blockly.JavaScript['text_text_set_' + typeText] = function (block) {
      var code = getOptionsText(block) + ".text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
      return code
    };
    Blockly.JavaScript['text_text_get_' + typeText] = function (block) {
      var code = getOptionsText(block) + ".text";
      return [code, Blockly.JavaScript.ORDER_NONE]
    };


    //  textbox
    console.log("ここには来ました")
    Blockly.JavaScript['textbox_text_set_' + typeText] = function (block) {
      var code = getOptionsText(block) + ".text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
      return code
    };
    Blockly.JavaScript['textbox_text_get_' + typeText] = function (block) {
      console.log(block)
      var code = getOptionsText(block) + ".text";
      console.log(code)
      return [code, Blockly.JavaScript.ORDER_NONE]
    };
  }
}

// CrosetBlock.setGenerators = function(id, type, isTemplate) {
  
//   var codeToGetOptions = ""
//   if(!isTemplate) {
//     codeToGetOptions = "$scope.get('" + id + "').options"
//   } else {
//     codeToGetOptions = "$scope.getTemplate('" + id + "').options"
//   }
  
//   switch (type) {

//     case "button":
//       Blockly.JavaScript['button_text_set_' + id] = function (block) {

//         var code = codeToGetOptions + ".text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
//         return code
//       };
//       Blockly.JavaScript['button_text_get_' + id] = function (block) {
//         var code = codeToGetOptions + ".text";
//         return [code, Blockly.JavaScript.ORDER_NONE]
//       };
//       Blockly.JavaScript['button_onclick_' + id] = function (block) {
//         var code = codeToGetOptions + ".click = function() {\n" + Blockly.JavaScript.statementToCode(block, "STATEMENT") + "\n}\n";
//         return code
//       };

//     break;

//     case "text":
//       Blockly.JavaScript['text_text_set_' + id] = function (block) {
//         var code = codeToGetOptions + ".text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
//         return code
//       };
//       Blockly.JavaScript['text_text_get_' + id] = function (block) {
//         var code = codeToGetOptions + ".text";
//         return [code, Blockly.JavaScript.ORDER_NONE]
//       };

//     break;

//     case "textbox":
//       console.log("ここには来ました")
//       Blockly.JavaScript['textbox_text_set_' + id] = function (block) {
//         var code = codeToGetOptions + ".text = " + Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_NONE) + "\n";
//         return code
//       };
//       Blockly.JavaScript['textbox_text_get_' + id] = function (block) {
//         console.log(block)
//         var code = codeToGetOptions + ".text";
//         console.log(code)
//         return [code, Blockly.JavaScript.ORDER_NONE]
//       };

//     break;

//   }
// }

