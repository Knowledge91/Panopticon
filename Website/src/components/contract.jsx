import React from 'react';
import { Link } from 'react-router-dom';
import { unlockCoinbase, deployPanopticonContract, panopticonContractInfo, fulfillPanopticonContract } from '../ethereum.js';
import { withRouter } from 'react-router-dom';
import { DoubleDounce } from 'styled-spinkit';
// material-ui
import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Divider from 'material-ui/Divider';

const ages = [14, 16, 18];
const durations = [30, 60, 120, 300];

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
    }
});

class Contract extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            minAge: 14,
            duration: 60,
            loading: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.deployContract = this.deployContract.bind(this);
    }

    deployContract() {
        this.setState({ loading: true });
        deployPanopticonContract(this.props.client.address, this.props.factory, this.state.minAge, this.state.duration).then((address) => {
            if(address) {
                this.props.addContractAddressToFactory(address, this.props.factory);
                this.props.history.push(`/contract/${address}`);
            }
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    render() {
        const { classes, client, factory } = this.props;
        const loading = this.state.loading;
        return (
            <div>
            {!loading ? (
                <div>
                    <h2>
                        Contract
                    </h2>
                    <Paper>
                        <form>
                            <br />
                            <h3 className={classes.center}>Contracting Parties:</h3>"
                            <br />

                            <Grid container className={classes.root} justify="space-around" spacing={40}>
                                <div />
                                <FormControlLabel value="other" control={<Radio />} label={`You - ${client.address}`} checked/>
                                <FormControlLabel value="other" control={<Radio />} label={`Factory - ${factory.address}`} checked/>
                                <div />
                            </Grid>

                            <Divider className={classes.margin} />

                            <br />
                            <h3 className={classes.center}>Conditions:</h3>"
                            <br />

                            <Grid container className={classes.root} justify="space-around" spacing={40}>
                            <TextField
                                id="select-minAge"
                                select
                                label="Minimum Age"
                                className={classes.textField}
                                value={this.state.minAge}
                                onChange={this.handleChange('minAge')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Please select the minimum age in years."
                                margin="normal"
                            >
                                {ages.map(age => (
                                    <MenuItem key={age} value={age}>
                                        {age}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="select-currency"
                                select
                                label="Duration"
                                className={classes.textField}
                                value={this.state.duration}
                                onChange={this.handleChange('duration')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Please select the duration in seconds."
                                margin="normal"
                            >
                                {durations.map(duration => (
                                    <MenuItem key={duration} value={duration}>
                                        {duration} s ( {duration/60} min )
                                    </MenuItem>
                                ))}
                            </TextField>
                            </Grid>

                            <Divider className={classes.margin} />

                            <br />
                            <h3 className={classes.center}>Confirmation:</h3>"
                            <br />

                            <Grid container justify="center">
                                <Button className={classes.button} variant="raised" color="primary" onClick={this.deployContract}>
                                    Sign
                                    <Icon className={classes.rightIcon}>send</Icon>
                                </Button>
                            </Grid>
                            <br />
                        </form>
                    </Paper>
                </div>
            ) : (
                <div>
                    <DoubleDounce size="100" />
                    <h2 className={classes.center}>Submitting your Smart Contract to the Ethereum Blockchain. <br />This operation may take a few seconds... </h2>
                </div>
            )}
                </div>
        )
    }
}

export default withRouter(withStyles(styles)(Contract));
