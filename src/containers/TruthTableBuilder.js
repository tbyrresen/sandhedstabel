import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

import Tokenizer from '../utils/tokenizer';
import Parser from '../utils/parser';
import TreeEvaluator from '../utils/treeEvaluator';
import TruthTable from '../components/truthTable';

class TruthTableBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: "",
            truthValueFormat: "T/F",
            valid: true,
            error: "",
            operands: [],
            tableRows: [[]],
        }
    }

    /*
    Generates entries of all rows of the truth table corresponding to the current entered expression by:
    (1) tokenizing the expression
    (2) parsing the tokens to build an expression tree
    (3) generating boolean values for each row except for the last entry such that the rows exhaust all possible table configurations
    (4) evaluating the tree from (2) for each row of (3) to produce the final entry value of that row
    If an error occurs at any stage, the error message is stored in the component state 
    */
    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.expression !== this.state.expression || prevState.truthValueFormat !== this.state.truthValueFormat) {
            try {
                this.setState({
                    valid: true,
                    error: null
                })              
                const tokens = Tokenizer.tokenize(this.state.expression);
                const expressionTree = Parser.parse(tokens);
                const operands = this.getOperandsFromTokens(tokens);
                const numOperands = operands.length;
                const numRows = Math.pow(2, numOperands);
                const currentNumSameBool = new Array(numOperands).fill(0);
                const targetNumSameBool = [];   
                const currentBool = [];    
                const tableRows = this.initTableRows(numRows);  
                const operandToBoolMapping = new Map();    
                this.setState({
                    operands: operands,
                    tableRows: tableRows
                })                

                for (let i = 0; i < numOperands; i++) {
                    targetNumSameBool[i] = Math.pow(2, numOperands - (i + 1));
                    currentBool[i] = true;
                }

                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numOperands; j++) {                    
                        if (currentNumSameBool[j] < targetNumSameBool[j]) {
                            currentNumSameBool[j]++;
                        }
                        else {
                            currentBool[j] = !currentBool[j];
                            currentNumSameBool[j] = 1;
                        }
                        tableRows[i][j] = this.convertBoolToTruthValueString(currentBool[j]);
                        operandToBoolMapping[operands[j]] = currentBool[j];
                    }
                    tableRows[i][numOperands] = this.convertBoolToTruthValueString(TreeEvaluator.evaluate(expressionTree, operandToBoolMapping));
                    operandToBoolMapping.clear();
                }
            }
            catch (error) {
                this.setState({
                    valid: false,
                    error: error
                })
            }
        }        
    }

    getOperandsFromTokens = (tokens) => {
        const operands = [];
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type === Tokenizer.tokenType.OPERAND && !operands.includes(tokens[i].spelling)) {
                operands.push(tokens[i].spelling);
            }
        }
        return operands;
    }

    initTableRows = (numRows) => {
        const arr = [];
        for (let i = 0; i < numRows; i++) {
            arr[i] = [];
        }
        return arr;
    }

    // converts a boolean value to the correct truth value string according to the current truth value format
    convertBoolToTruthValueString = (bool) => {
        const formatStrings = this.state.truthValueFormat.split('/');
        return bool ? formatStrings[0] : formatStrings[1];
    }

    expressionChangeHandler = (event) => {
        this.setState({
            expression: event.target.value            
        })
    }

    truthValueFormatChangeHandler = (event) => {
        this.setState({
            truthValueFormat: event.target.value
        })
    }

    render() {
        return (
            <div>
                <Form>
                    <Form.Label>Vælg sandhedsværdier:</Form.Label>
                    <Form.Group>
                        <Form.Check 
                            type="radio"
                            label="T/F"
                            value="T/F"
                            name="truthValueFormat"
                            id="trueFalseFormat"
                            onClick={this.truthValueFormatChangeHandler}
                            defaultChecked />
                        <Form.Check 
                            type="radio"
                            label="1/0"
                            value="1/0"
                            name="truthValueFormat"
                            id="binaryFormat"
                            onClick={this.truthValueFormatChangeHandler} />
                    </Form.Group>
                    <Form.Group>                  
                        <Form.Text className="text-muted">
                            Dit udtryk evalueres automatisk og giver fejlbesked hvis udtrykket ikke er veldefineret
                        </Form.Text> 
                        <Form.Control
                            size="lg"
                            type="text"
                            placeholder="Dit udtryk her"
                            onChange={this.expressionChangeHandler}
                            onKeyPress={(event) => { event.key === 'Enter' && event.preventDefault() }} />
                        <small>Eksempel på udtryk: a AND (b OR c)</small>      
                        {this.state.valid ? this.state.expression.length !== 0 ?
                        <TruthTable expression={this.state.expression} operands={this.state.operands} tableRows={this.state.tableRows} />
                        : null : this.state.expression.length !== 0 ? <p className="text-danger">{this.state.error.message}</p> : null}             
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default TruthTableBuilder;