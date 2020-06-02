import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import Tokenizer from '../utils/tokenizer';
import Parser from '../utils/parser';

class TruthTableBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: "",
            truthValueFormat: "T/F",
            valid: true,
            error: null
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.expression !== this.state.expression) {
            try {
                this.setState({
                    valid: true,
                    error: null
                })              
                const tokens = Tokenizer.tokenize(this.state.expression);
                const expressionTree = Parser.parse(tokens);
            }
            catch (error) {
                this.setState({
                    valid: false,
                    error: error
                })
            }
        }        
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
                        <small>Eksempel på udtryk: a AND (b OR C)</small>      
                        {this.state.valid ? <p className="text-success">TODO</p> :
                        <p className="text-danger">{this.state.error.message}</p>}             
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default TruthTableBuilder;