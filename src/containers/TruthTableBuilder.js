import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class TruthTableBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: "",
            truthValueFormat: "T/F",
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
                            defaultChecked 
                        />
                        <Form.Check 
                            type="radio"
                            label="1/0"
                            value="1/0"
                            name="truthValueFormat"
                            id="binaryFormat"
                            onClick={this.truthValueFormatChangeHandler}
                        />
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
                            onKeyPress={(event) => { event.key === 'Enter' && event.preventDefault() }}
                        />
                        <small>Eksempel på udtryk: a AND (b OR C)</small>                   
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default TruthTableBuilder;