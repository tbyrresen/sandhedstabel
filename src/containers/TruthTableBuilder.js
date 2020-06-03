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
            variables: [],
            tableRows: [[]],
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.expression !== this.state.expression || prevState.truthValueFormat !== this.state.truthValueFormat) {
            try {
                this.setState({
                    valid: true,
                    error: null
                })              
                const tokens = Tokenizer.tokenize(this.state.expression);
                const expressionTree = Parser.parse(tokens);
                const variables = tokens.filter(e => e.type === Tokenizer.tokenType.VARIABLE);
                const numVars = variables.length;
                const numRows = Math.pow(2, numVars);
                const currentNumSameBool = new Array(numVars).fill(0);
                const targetNumSameBool = [];   
                const currentBool = [];    
                const tableRows = this.initTableRows(numRows);  
                const varToBoolMapping = new Map();    
                this.setState({
                    variables: variables,
                    tableRows: tableRows
                })                

                for (let i = 0; i < numVars; i++) {
                    targetNumSameBool[i] = Math.pow(2, numVars - (i + 1));
                    currentBool[i] = true;
                }

                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numVars; j++) {                    
                        if (currentNumSameBool[j] < targetNumSameBool[j]) {
                            currentNumSameBool[j]++;
                        }
                        else {
                            currentBool[j] = !currentBool[j];
                            currentNumSameBool[j] = 1;
                        }
                        tableRows[i][j] = this.convertBoolToTruthValueString(currentBool[j]);
                        varToBoolMapping[variables[j].spelling] = currentBool[j];
                    }
                    tableRows[i][numVars] = this.convertBoolToTruthValueString(TreeEvaluator.evaluate(expressionTree, varToBoolMapping));
                    varToBoolMapping.clear();
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
                            Dit udtryk evalueres automatisk
                        </Form.Text> 
                        <Form.Control
                            size="lg"
                            type="text"
                            placeholder="Dit udtryk her"
                            onChange={this.expressionChangeHandler}
                            onKeyPress={(event) => { event.key === 'Enter' && event.preventDefault() }} />
                        <small>Eksempel på udtryk: a AND (b OR c)</small>      
                        {this.state.valid ? this.state.expression.length !== 0 ?
                        <TruthTable expression={this.state.expression} variables={this.state.variables} tableRows={this.state.tableRows} />
                        : null : this.state.expression.length !== 0 ? <p className="text-danger">{this.state.error.message}</p> : null}             
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default TruthTableBuilder;