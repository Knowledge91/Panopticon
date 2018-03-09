import React from 'react';
import { contractInfo } from '../ethereum.js';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default class ContractStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            address: this.props.match.params.address,
            dueDate: null,
            fulfilled: false,
            balance: 0,
            hasChildLabour: false,
            client: null,
            factory: null
        }
    }

    componentDidMount() {
        contractInfo(this.state).then((state) => {
            this.setState(state);
        });
    }

    outputDueDate() {
        if(this.state.dueDate) {
            return moment.unix(this.state.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
        }
    }

    render() {
        const { address, fulfilled, balance, hasChildLabour, factory, client } = this.state;

        return (
            <div>
                <h1 className="text-center">Contract Status</h1>
                <h2 className="text-center">{address}</h2>
                <ul>
                    <li>Due Date: {this.outputDueDate()}</li>
                    <li>Fulfilled: {fulfilled ? "yes" : "no"}</li>
                    <li>Balance: {balance}</li>
                    <li>Has Child Labour: {hasChildLabour ? "yes" : "no"}</li>
                    <li>Factory: {factory}</li>
                    <li>Client: <Link to="/">{client}</Link></li>
                </ul>
            </div>
        )
    }
}
