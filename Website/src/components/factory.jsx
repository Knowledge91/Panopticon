import React from 'react';
import { withRouter } from 'react-router-dom';

class Factory extends React.Component {
    constructor(props) {
        super(props);

        this.getWorkerRows = this.getWorkerRows.bind(this);
    }

    getWorkerRows() {
        let rows = [];
        console.log(this.props);
        for(let worker of this.props.factory.workers) {
            rows.push(
                <tr key={worker.name}>
                    <td>{worker.name}</td>
                    <td>{worker.age}</td>
                </tr>
            )
        }
        return rows;
    };

    render() {
        const { name } = this.props.factory;
        return (
            <div>
                <h1 className="text-center">Factory</h1>
                <h2 className="text-center">{name}</h2>

                <h3 className="text-center">Workers</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getWorkerRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default withRouter(Factory);
