import React from 'react';

export default class ContractStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1 className="text-center"> Contract Status - {this.props.match.params.address} </h1>
            </div>
        )
    }
}
