import React from 'react';
import { Link } from 'react-router-dom';

export default class Factory extends React.Component {
    constructor(props) {
        super(props);
        this.getFactoryRows = this.getFactoryRows.bind(this);
    }

    getFactoryRows() {
        let factoryRows = [];
        for(let factory of this.props.factories) {
            factoryRows.push(
                <tr key={factory.address}>
                    <th scope="row">{factory.address}</th>
                    <td>{factory.name}</td>
                    <td>{factory.balance} Ether</td>
                    <td>{factory.price} Ether</td>
                    <td>
                        Count: {factory.contracts.length} <br />
                        <ul>
                            {factory.contracts.map((address, i) => {
                                 let to = `/contract/${address}`;
                                 return <li key={address}><Link to={to}>{address}</Link></li>
                            })}
                        </ul>
                    </td>
                    <td><Link to="/contract" onClick={() => {this.props.selectFactory(factory)}}>Contract</Link></td>
                </tr>
            )
        }
        return factoryRows;
    }


    render() {
        return (
            <div>
                <h1 className="text-center">Factorys</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Factory</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Price</th>
                            <th scope="col">Current Contracts</th>
                            <th scope="col">Contract</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getFactoryRows()}
                    </tbody>
                </table>
            </div>
        );
    }
};
