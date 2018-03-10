import React from 'react';
import { fulfillContract, contractInfo, weiToEther } from '../ethereum.js';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { DoubleDounce } from 'styled-spinkit';


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 500,
    },
    menu: {
        width: 200,
    },
    margin: {
        marginTop: 25,
        marginBottom: 25
    },
    button: {
        margin: theme.spacing.unit,
        width: "80%",
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
    root: {
        flexGrow: 1
    },
    center: {
        textAlign: "center"
    },
    card: {
        maxWidth: 345,
    },
    media: {
        minHeight: 100,
        width: 100,
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 30
    },
});

class ContractStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            address: this.props.match.params.address,
            dueDate: null,
            fulfilled: false,
            balance: 0,
            hasChildLabour: false,
            client: null,
            factory: null,
            loading: false
        }

        this.getContractBalance = this.getContractBalance.bind(this);
        this.getFactoryBalance = this.getFactoryBalance.bind(this);
        this.getUserBalance = this.getUserBalance.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        fulfillContract(this.state.address).then(() => {
            return contractInfo(this.state);
        }).then((state) => {
            this.state.loading = false;
            this.setState(state);
        });
    }

    outputDueDate() {
        if(this.state.dueDate) {
            return moment.unix(this.state.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
        }
    }

    getContractBalance() {
        if(this.state.fulfilled) {
            return 0;
        } else {
            return this.state.balance;
        }
    }

    getFactoryBalance() {
        if(this.state.fulfilled && !this.state.hasChildLabour) {
            return this.state.balance;
        } else {
            return 0;
        }
    }

    getUserBalance() {
        if(this.state.fulfilled && !this.state.hasChildLabour) {
            return this.state.balance;
        } else if(!this.state.fulfilled) {
            return this.state.balance;
        } else {
            return 0;
        }
    }

    render() {
        const { address, fulfilled, balance, hasChildLabour, factory, client, dueDate, loading } = this.state;
        const { classes } = this.props;

        let fulfillment = { media: "question.png", title: "Waiting for due date.", text: "" };
        console.log(fulfilled);
        if(fulfilled) {
            if(hasChildLabour) {
                fulfillment.media = "cross.png";
                fulfillment.text = "Contained child labour.";
                fulfillment.title = "Transfered money back to you";
            } else {
                fulfillment.media = "check.png";
                fulfillment.text = "Everything in order.";
                fulfillment.title = "Transfered money to Factory.";
            }
        }


        return (
            <div>
                {!loading ? (
            <div>
                <h2>Contract Status</h2>
                <Paper>
                    <br />
                    <h4 className={classes.center}>Contract - {address}</h4>"
                    <br />

                    <Divider />

                    <br />
                    <h4 className={classes.center}>Due Date:</h4>"
                    <br />
                    <div className={classes.center}>{this.outputDueDate()}</div>
                    <br />

                    <Divider />

                    <br />
                    <h4 className={classes.center}>Has Child Labour:</h4>"
                    <br />
                    <div className={classes.center}>{hasChildLabour ? "yes" : "no"}</div>
                    <br />

                    <Divider />

                    <br />
                    <h4 className={classes.center}>Balances:</h4>"
                    <br />

                    <Grid container className={classes.root} justify="space-around" spacing={40}>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.media}
                                image="../../media/user.png"
                                title="You"
                            />
                            <CardContent>
                                <Typography color="error" variant="title">
                                    You Balance:  {- weiToEther(this.getUserBalance())} Ether
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    <Link to="/">{client}</Link>
                                </Button>
                            </CardActions>
                        </Card>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.media}
                                image="../../media/document.png"
                                title="You"
                            />
                            <CardContent>
                                <Typography variant="title">
                                    Contract Balance:  {weiToEther(this.getContractBalance())} Ether
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    <Link to="/">{address}</Link>
                                </Button>
                            </CardActions>
                        </Card>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.media}
                                image="../../media/factory.png"
                                title="You"
                            />
                            <CardContent>
                                <Typography variant="title">
                                    Facotory Balance:  {
                                        weiToEther(this.getFactoryBalance())
                                    } Ether
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    <Link to="/">{factory}</Link>
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <br />

                    <Divider className={classes.margin} />

                    <br />
                    <h3 className={classes.center}>Fulfillment:</h3>"
                    <br />

                    <Grid container className={classes.root} justify="space-around" spacing={40}>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.media}
                                image={`../../media/${fulfillment.media}`}
                                title={fulfillment.title}
                            />
                            <CardContent>
                                <Typography variant="title">
                                    {fulfillment.title}
                                </Typography>
                                <Typography>
                                    {fulfillment.text}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </Paper>
            </div>
                ) : (
                <div>
                    <DoubleDounce size="100" />
                    <h2 className={classes.center}>Retrieving your Smart Contract from the Ethereum Blockchain...</h2>
                </div>
                )}
            </div>
        )
    }
}

export default withStyles(styles)(ContractStatus);
