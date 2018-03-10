import React from 'react';
import { Route, Link } from 'react-router-dom';
import Dashboard from './dashboard.jsx';
import Contract from './contract.jsx';
import ContractStatus from './contractStatus.jsx';
import Factory from './factory.jsx';
import { getBalance, getFactoriesInfo } from '..//ethereum.js'
import { getSession, saveSession, resetSession } from '../sessionStorage.js';
import { withRouter } from 'react-router-dom';
// material-ui
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import RestoreIcon from 'material-ui-icons/Restore';
import FavoriteIcon from 'material-ui-icons/Favorite';
import LocationOnIcon from 'material-ui-icons/LocationOn';

const styles = {
    body: {
        marginTop: 40,
        margin: "auto",
        width: "95%"
    },
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
    white: {
        color: "white",
    },
    bottom: {
        position: "fixed",
        bottom: 0,
        width: "100%"
    }
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
        console.log('select');  
        console.log(factory);
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

    handleChange = (event, bottomNav) => {
        this.setState({ bottomNav });
    };


    render() {
        const { classes, history } = this.props;
        const { factories, client, bottomNav } = this.state;

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <Link className={classes.white} to="/"><Icon>home</Icon></Link>
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

                <div className={classes.body}>
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

                <BottomNavigation
                    value={bottomNav}
                    onChange={this.handleChange}
                    showLabels
                    className={classes.bottom}
                >
                    <BottomNavigationAction label="Dashboard" icon={<Icon>home</Icon>} onClick={() => {history.push("/")}} />
                    {/* <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} /> */}
                </BottomNavigation>
            </div>
        )
    }
};

export default withRouter(withStyles(styles)(App));
