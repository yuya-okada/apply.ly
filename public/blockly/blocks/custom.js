
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
	},
	{
		"type": "server",
		"message0": "サーバーから取得 %1",
		"args0": [
			{
				"type": "input_value",
				"name": "ARG"
			}
		],
		"previousStatement": null,
		"nextStatement": null,
		"colour": Blockly.Blocks.logic.HUE,
		"tooltip": "",
		"helpUrl": "",
		"mutator": "server_mutator"
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





Blockly.Constants.CUSTOM = {}

Blockly.Constants.CUSTOM.CONTROLS_IF_MUTATOR_MIXIN = {
	elseifCount_: 0,
  elseCount_: 0,

  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = workspace.newBlock('controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = workspace.newBlock('controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case 'controls_if_else':
          this.elseCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.elseifCount_; i++) {
      Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this Blockly.Block
   * @private
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('ELSE')) {
      this.removeInput('ELSE');
    }
    var i = 1;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
      i++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck('Boolean')
          .appendField("フィールド名だョ");
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  }
}
	
Blockly.Extensions.registerMutator('server_mutator',
    Blockly.Constants.CUSTOM.CONTROLS_IF_MUTATOR_MIXIN, null,
    ['controls_if_elseif', 'controls_if_else']);

