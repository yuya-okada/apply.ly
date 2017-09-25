/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Non-editable text field.  Used for titles, labels, etc.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldValueLabel');

goog.require('Blockly.Field');
goog.require('Blockly.Tooltip');
goog.require('goog.dom');
goog.require('goog.math.Size');


/**
 * Class for a non-editable field.
 * @param {string} text The initial content of the field.
 * @param {string=} opt_class Optional CSS class for the field's text.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldValueLabel = function(text, opt_class) {
  this.size_ = new goog.math.Size(0, 17.5);
  this.class_ = opt_class;
  this.setValue(text);
};
goog.inherits(Blockly.FieldValueLabel, Blockly.Field);


Blockly.FieldValueLabel.prototype.EDITABLE = true;

Blockly.FieldValueLabel.prototype.setValue = function(newValue) {
  this.value_ = newValue
  Blockly.Field.prototype.setValue.call(this, newValue);
};


/**
 * Install this text on a block.
 */
Blockly.FieldValueLabel.prototype.init = function() {
  if (this.textElement_) {
    // Text has already been initialized once.
    return;
  }
  // Build the DOM.
  this.textElement_ = Blockly.utils.createSvgElement('text',
      {'class': 'blocklyText', 'y': this.size_.height - 5}, null);
  if (this.class_) {
    Blockly.utils.addClass(this.textElement_, this.class_);
  }
  if (!this.visible_) {
    this.textElement_.style.display = 'none';
  }
  this.sourceBlock_.getSvgRoot().appendChild(this.textElement_);

  // Configure the field to be transparent with respect to tooltips.
  this.textElement_.tooltip = this.sourceBlock_;
  Blockly.Tooltip.bindMouseEvents(this.textElement_);
  // Force a render.
  this.render_();
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
Blockly.FieldValueLabel.prototype.dispose = function() {
  goog.dom.removeNode(this.textElement_);
  this.textElement_ = null;
};

/**
 * Gets the group element for this field.
 * Used for measuring the size and for positioning.
 * @return {!Element} The group element.
 */
Blockly.FieldValueLabel.prototype.getSvgRoot = function() {
  return /** @type {!Element} */ (this.textElement_);
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
Blockly.FieldValueLabel.prototype.setTooltip = function(newTip) {
  this.textElement_.tooltip = newTip;
};
