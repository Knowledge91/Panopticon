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
import RestoreIcon from 'material-ui-icons/Restore';
import FavoriteIcon from 'material-ui-icons/Favorite';
import LocationOnIcon from 'material-ui-icons/LocationOn';
import Grid from 'material-ui/Grid';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';

const styles = theme => ({
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
    white: {
        color: "white",
    },
    logo: {
        height: 60,
        margin: "auto",
    },
    marginTop: {
        marginTop: 25
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
});

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        const sessionState = getSession();
        if(sessionState) {
            this.state = sessionState;
        } else {
            this.state = resetSession();
        }

        this.state.instructionStep = this.getInstructionStep(this.props.location.pathname);

        this.selectFactory = this.selectFactory.bind(this);
        this.updateState = this.updateState.bind(this);
        this.addContractAddressToFactory = this.addContractAddressToFactory.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            const instructionStep = this.getInstructionStep(location.pathname);
            this.setState({instructionStep});
        });
    }

    getInstructionStep(pathname) {
        switch(pathname) {
            case "/":
                return 0;
            case "/contract":
                return 1;
            default:
                return 2;
        }
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
        location.reload();
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

    getInstruction(i) {
        switch(i) {
            case 0:
                return (
                    <span>
                        1.) This is your Dashboard. It shows you a table of all factories you can interact with. Every factory has a name, a balance, a price and an "address" in the Ethereum Blockchain (Every contract and even you yourself have an address.). If you wish you can click one of the factory addresses to get more information about the company. In the demo, we included two companies from which company B has infants working in their facilities. <br />
                        In the first step, you should "contract" company A, which contains no child work, by clicking on the "Shopping Cart" button to create a new contract.
                    </span>
                )
            case 1:
                return (
                    <span>
                        2.) In the second step, you will see the factory and yourself as the contracting parties. You now will have to define the definition of the agreement. <br />
                        Choose a minimum age that you require from every worker in the factory and a duration after which (on fulfillment) the factory will receive their money. After that sign the contract by clicking on the "Sign" button. This will generate a Smart Contract and upload it to the Blockchain. The contract generation might take some time, so please be patient.
                    </span>

                )
            case 2:
                return (
                    <span>
                        3.) In the last step, we give you an overview of the contract status. A depending on the due date the contract might be still in progress. You should notice that we are dealing with three parties: The factory (which wants to be paid), the contract (which has been paid by you, and governs the further procedure of the payment) and you. The balance is given under the Balance headline, with the corresponding addresses in the Ethereum Blockchain. Under the header "Fulfillment" you will see a resume of the contract consisting in one of the three possible states: still in progress, everything in order (factory has been paid) or we detected child work so we refunded your money!. <br />
                        Now go back to the Dashboard, by clicking on the home button (in the upper-left corner, the home next to the "Panopticon" writing) and try to set up a contract with Company B, which as you can check, by clicking on its address, will contain child work. This time try to focus on the balance movements. You can check your balance at all times on the top by refreshing the page. Your balance is slowly increasing because we are mining Etherum for you.
                    </span>
                )
            default:
                return 'unkown';
        }
    }

    render() {
        const { classes, history } = this.props;
        const { factories, client, instructionStep } = this.state;
        const steps = ["Select Factory A", "Set Contract Conditions", "See Contract Status"];

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

                <Grid container className={classes.root, classes.marginTop} justify="center" direction="column">
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

                        <Stepper activeStep={instructionStep}>
                            {steps.map((label, index) => {
                                 const props = {};
                                 const labelProps = {};
                                 return (
                                     <Step key={label} {...props}>
                                         <StepLabel {...labelProps}>{label}</StepLabel>
                                     </Step>
                                 );
                            })}
                        </Stepper>
                        <Typography className={classes.instructions} variation="variation">
                            {this.getInstruction(instructionStep)}
                        </Typography>

                        <br />
                        <br />

                        <Grid container justify="space-between" className={classes.bottom}>
                            <img src="../../media/logo.png" className={classes.logo}/>
                            <img src="../../media/cuatrecasas.jpg" className={classes.logo}/>
                        </Grid>

                    </div>
                </Grid>
            </div>
        )
    }
};

export default withRouter(withStyles(styles)(App));
