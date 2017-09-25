window.CrosetBlock.setElementBlocks = function () {
  
  set(true);
  set(false);
  
  function set(isTemplate) {
    var typeText = ""
    if (isTemplate) {
      typeText = "_template"
    } else {
      typeText = "_element"
    }

    function getOptionsText (block) {
      if (isTemplate) {
        return "$scope.getTemplate('" + block.getFieldValue("ELEMENT") + "').options"
      } else {
        return "$scope.get('" + block.getFieldValue("ELEMENT") + "').options"
      }
    }
    
    
    for (var elementType in window.CrosetBlock.elementBlocks) {
      var elementBlocks = window.CrosetBlock.elementBlocks[elementType]
      
      for (var i in elementBlocks) {
        var block = elementBlocks[i]
                
        // 画面部品のオプションのゲッタ/セッタなら、         
        if (block.type.indexOf("_get") != -1) {
          var targetOption = block.type.split("_")[1];
          defineGetterBlock(block.type, targetOption);      
          
        } else if (block.type.indexOf("_set") != -1) {
          var targetOption = block.type.split("_")[1];
          defineSetterBlock(block.type, targetOption);
        }
      }
    }
    
    function defineGetterBlock (blockType, targetOption) {
      Blockly.JavaScript[blockType + typeText] = function (block) {
        var code = getOptionsText(block) + "." + targetOption;
        return [code, Blockly.JavaScript.ORDER_NONE]
      };
    }
    
    function defineSetterBlock (blockType, targetOption) {
      Blockly.JavaScript[blockType + typeText] = function (block) {
        var code = getOptionsText(block) + "." + targetOption + "= " + Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_NONE) + "\n";
        return code
      };
    }
    
    
    //  button
    Blockly.JavaScript['button_onclick' + typeText] = function (block) {
      var code = getOptionsText(block) + ".click = function() {\n" + Blockly.JavaScript.statementToCode(block, "DO") + "\n}\n";
      return code
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

