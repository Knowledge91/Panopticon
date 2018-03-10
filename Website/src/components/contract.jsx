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
        width: 200,
    },
    menu: {
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
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
        deployPanopticonContract(this.props.client.address, this.props.factory.address).then((address) => {
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
        const { classes } = this.props;
        const loading = this.state.loading;
        return (
            <div>
            {!loading ? (
                <div>
                    <h1 className="text-center">
                        Contract
                    </h1>
                    <h2>Between {this.props.client.name} and {this.props.factory.name}</h2>
                    <form>
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
                        <br />
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
                        <br />
                        <Button className={classes.button} variant="raised" color="primary">
                            Sign
                            <Icon className={classes.rightIcon}>send</Icon>
                        </Button>
                    </form>
                </div>
            ) : (
                <DoubleDounce size="100" />
            )}
                </div>
        )
    }
}

export default withRouter(withStyles(styles)(Contract));
