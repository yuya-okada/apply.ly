
Blockly.Blocks.element = {
  HUE: "#3F51B5"
}

//##################################################


// 独自のブロックの登録
Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  {
    "type": "log",
    "message0": "ログ： %1",
    "args0": [
      {
        "type": "input_value",
        "name": "TEXT",
      }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "controls_interval",
    "message0": "%1 秒ごとに繰り返す %2 %3",
    "args0": [
      {
        "type": "field_input",
        "name": "TIME",
        "text": "1"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Blocks.loops.HUE,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "parse_int",
    "message0": "数字に変換 %1",
    "args0": [
      {
        "type": "input_value",
        "name": "ARG"
      }
    ],
    "output": null,
    "colour": Blockly.Blocks.math.HUE,
    "tooltip": "",
    "helpUrl": ""
  },
	{
		"type": "instantiate",
		"message0": "テンプレート %1 を画面に追加",
		"args0": [
			{
				"type": "field_template",
				"name": "TEMPLATE"
			},
		],
		"previousStatement": null,
		"nextStatement": null,
		"colour": Blockly.Blocks.element.HUE,
		"tooltip": "",
		"helpUrl": ""
	},
	{
		"type": "instantiateTo",
		"message0": "テンプレート %1 を %2 に追加",
		"args0": [
			{
				"type": "field_template",
				"name": "TEMPLATE"
			},
			{
				"type": "field_element",
				"name": "ELEMENT",
				"filter": ["group", "listGroup"]
			}
		],
		"previousStatement": null,
		"nextStatement": null,
		"colour": Blockly.Blocks.element.HUE,
		"tooltip": "",
		"helpUrl": ""
	},
	{
		"type": "watch",
		"message0": "%1 が変わった時 %2 %3",
		"args0": [
			{
				"type": "input_value",
				"name": "ARG"
			},
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
		],
		"previousStatement": null,
		"nextStatement": null,
		"colour": Blockly.Blocks.logic.HUE,
		"tooltip": "",
		"helpUrl": ""
	}

]);




//########################################################################


if (!window.CrosetBlock) {
	window.CrosetBlock = {}
}
  
CrosetBlock.customBlock = {}
// 画面遷移
CrosetBlock.customBlock.intentBlock = {
  "type": "intent",
  "message0": "画面を移動 %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "ID",
      "options": []
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Constants.Logic.HUE,
  "tooltip": "",
  "helpUrl": ""
};

