import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Navigation from './components/navigation.jsx';
import Dashboard from './components/dashboard.jsx';
import Contract from './components/contract.jsx';
import ContractStatus from './components/contractStatus.jsx';
import Factory from './components/factory.jsx'; 
import { getBalance, getFactoriesInfo } from './ethereum.js'
import { getSession, saveSession, resetSession } from './sessionStorage.js';

import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
    constructor(props) {
        super(props);

        const sessionState = getSession();
        if(sessionState) {
            this.state = sessionState;
        } else {
            this.state = resetSession();
        }

        this.selectFactory = this.selectFactory.bind(this);
        this.updateState = this.updateState.bind(this);
        this.addContractAddressToFactory = this.addContractAddressToFactory.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        const client = this.state.client;
        getBalance(client.address).then((balance) => {
            client.balance = balance;
            this.state.client = client;
            return getFactoriesInfo(this.state.factories);
        }).then((factories) => {
            this.state.factories = factories;
            this.setState(this.state);
        });
    }

    updateState(state) {
        saveSession(state);
        this.setState(state);
    }

    reset() {
        this.setState(resetSession);
    }

    selectFactory(factory) {
        this.setState({
            selectedFactory: factory
        });
    }

    addContractAddressToFactory(contractAddress, _factory) {
        for(let factory of this.state.factories) {
            if ( factory.address == _factory.address ) {
                factory.contracts.push(contractAddress);
            }
        }
        this.updateState(this.state);
    }

    render() {
        return (
            <div>
                <Navigation client={this.state.client} reset={this.reset} />
                <Route
                    exact
                    path='/'
                    render={() => <Dashboard factories={this.state.factories} selectFactory={this.selectFactory}/>}
                />
                <Route
                    exact
                    path='/contract'
                    render={() => <Contract client={this.state.client} factory={this.state.selectedFactory} addContractAddressToFactory={this.addContractAddressToFactory} />}
                />
                <Route
                    path='/contract/:address'
                    component={ContractStatus}
                />
                <Route
                    path='/factory/:address'
                    component={Factory}
                />
            </div>
        )
    }
};

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('app')
);


