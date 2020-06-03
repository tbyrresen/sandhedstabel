import React from 'react';

const truthTable = (props) => {
    const columnHeaders = [];
    for (let i = 0; i < props.variables.length; i++) {
        columnHeaders.push(<th scope="col">{props.variables[i].spelling}</th>)
    }

    const rowEntries = [];
    for (let i = 0; i < props.tableRows.length; i++) {
        rowEntries.push([]);
        for (let j = 0; j < props.variables.length + 1; j++) {
            rowEntries[i].push(<td align="center">{props.tableRows[i][j]}</td>)
        }
    }

    // rowEntries wrapped in <tr> tags to ensure proper rendering in table
    const trWrappedRows = [];
    for (let i = 0; i < props.tableRows.length; i++) {
        trWrappedRows.push(<tr>{rowEntries[i]}</tr>)
    }
    
    return (
    <div className="row justify-content-center">
        <div className="col-auto">
            <table className="table table-borderless">
                <thead>
                    <tr>
                        {columnHeaders}
                        <th scope="col">{props.expression}</th>
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