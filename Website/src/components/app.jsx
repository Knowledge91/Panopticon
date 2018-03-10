import React from 'react';
import { Route, Link } from 'react-router-dom';
import Dashboard from './dashboard.jsx';
import Contract from './contract.jsx';
import ContractStatus from './contractStatus.jsx';
import Factory from './factory.jsx';
import { getBalance, getFactoriesInfo } from '..//ethereum.js'
import { getSession, saveSession, resetSession } from '../sessionStorage.js';
// material-ui
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    center: {
        textAlign: "center",
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

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
        const { classes } = this.props;
        const { factories, client } = this.state;
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Panopticon
                        </Typography>
                        <Typography variant="subheading" color="inherit" className={classes.flex}>
                            Your balance: <strong>{client.balance} Ether</strong>.
                        </Typography>
                        <Button color="inherit" onClick={this.reset}>Reset</Button>
                    </Toolbar>
                </AppBar>
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
                    render={
                        ({match}) => {
                            const address = match.params.address;
                            // select factory
                            for(var factory of factories) {
                                if(factory.address == address) {
                                    break;
                                }
                            }
                            return <Factory factory={factory}/>;
                        }
                    }
                />
            </div>
        )
    }
};

export default withStyles(styles)(App);
