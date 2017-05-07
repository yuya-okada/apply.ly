Blockly.Blocks.element = {
  HUE: "#3F51B5"
}

// 画面要素に関するやつ
CrosetBlock.elementBlocks = {
  button: [
    {
      "type": "button_text_set_#id",
      "message0": "[#name] のテキストを変更 %1",
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.element.HUE,
      "tooltip": "",
      "helpUrl": ""
    },
    {
      "type": "button_text_get_#id",
      "message0": "[#name] のテキスト",
      "args0": [],
      "output": null,
      "colour": Blockly.Blocks.element.HUE,
      "tooltip": "",
      "helpUrl": ""
    },
    {
      "type": "button_onclick_#id",
      "message0": "[#name] がクリックされた時、 %1 %2",
      "args0": [
        {
          "type": "input_dummy"
        },
        {
          "type": "input_statement",
          "name": "STATEMENT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.element.HUE,
      "tooltip": "",
      "helpUrl": ""
    }
  ],
  text: [
    {
      "type": "text_text_set_#id",
      "message0": "[#name] のテキストを変更 %1",
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.element.HUE,
      "tooltip": "",
      "helpUrl": ""
    },
    {
      "type": "text_text_get_#id",
      "message0": "[#name] のテキスト",
      "args0": [],
      "output": null,
      "colour": Blockly.Blocks.element.HUE,
      "tooltip": "",
      "helpUrl": ""
    }
  ],
  textbox: [
    {
      "type": "textbox_text_set_#id",
      "message0": "[#name] のテキストを変更 %1",
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.element.HUE,
      "tooltip": "",
      "helpUrl": ""
    },
    {
      "type": "textbox_text_get_#id",
      "message0": "[#name] のテキスト",
      "args0": [],
      "output": null,
      "colour": Blockly.Blocks.element.HUE,
      "tooltip": "",
      "helpUrl": ""
    }
  ]
}
