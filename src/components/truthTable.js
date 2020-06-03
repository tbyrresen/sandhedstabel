import React from 'react';

const truthTable = (props) => {
    const columnHeaders = [];
    for (let i = 0; i < props.operands.length; i++) {
        columnHeaders.push(<th scope="col">{props.operands[i]}</th>)
    }

    const rowEntries = [];
    for (let i = 0; i < props.tableRows.length; i++) {
        rowEntries.push([]);
        for (let j = 0; j < props.operands.length + 1; j++) {
            rowEntries[i].push(<td align="center">{props.tableRows[i][j]}</td>)
        }
    }

    // rowEntries wrapped in <tr> tags to ensure proper rendering in table
    const trWrappedRows = [];
    for (let i = 0; i < props.tableRows.length; i++) {
        trWrappedRows.push(<tr>{rowEntries[i]}</tr>)
    }

    // Build the expression using proper mathematical symbols. 
    // Assumes that the expression is well-formed
    const expressionWithProperSymbols = [];
    let i = 0;
    while (i < props.expression.length) {
        if (props.expression[i] === ' ' || props.expression[i] === '(' || props.expression[i] === ')') {
            expressionWithProperSymbols.push(props.expression[i++]);
        }
        else {
            const symbolString = [];
            while (i < props.expression.length && props.expression[i] !== ' ' && props.expression[i] !== '(' && props.expression[i] !== ')') {
                symbolString.push(props.expression[i++]);
            }

            switch (symbolString.join('').toUpperCase()) {
                case 'NOT':
                    expressionWithProperSymbols.push(String.fromCharCode(0x00AC));
                    break;
                case 'AND':
                    expressionWithProperSymbols.push(String.fromCharCode(0x2227));
                    break;
                case 'NAND':
                    expressionWithProperSymbols.push(String.fromCharCode(0x007C));
                    break;
                case 'OR':
                    expressionWithProperSymbols.push(String.fromCharCode(0x2228));
                    break;
                case 'XOR':
                    expressionWithProperSymbols.push(String.fromCharCode(0x2295));
                    break;
                case 'NOR':
                    expressionWithProperSymbols.push(String.fromCharCode(0x2193));
                    break
                case 'IMPLY':
                    expressionWithProperSymbols.push(String.fromCharCode(0x2192));
                    break
                case 'XNOR':
                    expressionWithProperSymbols.push(String.fromCharCode(0x2194));
                    break
                default:
                    expressionWithProperSymbols.push(symbolString.join(''));
            }
        }
    }
    
    return (
    <div className="row justify-content-center">
        <div className="col-auto">
            <table className="table table-borderless">
                <thead>
                    <tr>
                        {columnHeaders}
                        <th scope="col">{expressionWithProperSymbols.join('')}</th>
                    </tr>
                </thead>
                <tbody>                   
                    {trWrappedRows}              
                </tbody>
            </table>
        </div>
    </div>    
    )
}

export default truthTable;