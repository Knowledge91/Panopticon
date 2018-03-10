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
import ReactCountdownClock from 'react-countdown-clock';

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
            const dueDate = moment.unix(this.state.dueDate);
            const timeDiffSeconds = dueDate.diff(moment.now(), 'seconds');
            if(timeDiffSeconds > 0) {
                return     (
                    <div>
                    <h4>Is in:</h4>
                    <ReactCountdownClock seconds={timeDiffSeconds}
                    color="#000"
                    alpha={0.9}
                    size={300}
                    onComplete={() => {location.reload()}} />
                    </div>
                )
            } else {
                return (
                    <div>
                    <h4>Was on: {moment.unix(this.state.dueDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}</h4>
                    </div>
                )
            }
        }
    }

    render() {
        const { address, fulfilled, balance, hasChildLabour, factory, client, dueDate, loading } = this.state;
        const { classes } = this.props;

        let fulfillment = { media: "question.png", title: "Waiting for due date.", text: "" };
        let userBalance = - weiToEther(balance);
        let contractBalance = weiToEther(balance);
        let factoryBalance = 0;

        const dueDateMoment = moment.unix(dueDate);
        const timeDiffSeconds = dueDateMoment.diff(moment.now(), 'seconds');
        if(timeDiffSeconds < 0) {
            if(!fulfilled) {
                fulfillment.media = "cross.png";
                fulfillment.text = "Contained child labour.";
                fulfillment.title = "Transfered money back to you";
                userBalance = 0;
            } else {
                fulfillment.media = "check.png";
                fulfillment.text = "Everything in order.";
                fulfillment.title = "Transfered money to Factory.";
                factoryBalance = weiToEther(balance);
            }
            contractBalance = 0;
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
                    <h4 className={classes.center}>Balances (& Addresses):</h4>"
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
                                    You Paid: {userBalance} Ether
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
                                    The Contract yields: {contractBalance} Ether
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    <Link to={`/contract/${address}`}>{address}</Link>
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
                                    Facotory received:  {factoryBalance} Ether
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
