import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
    heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class Dashboard extends React.Component {
    render() {
        const { classes, factories, selectFactory } = this.props;
        return (
            <div>
                <h2>Factories</h2>
                <Typography variation="title">
                    Welcome to the CUATRECASAS demo for the Global Legal Hackathon. <br />
                    In this demo, we want to present you how Smart Contracts within the Ethereum Blockchain can help cooperation and factories to ensure safe workplaces.
                </Typography>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Ethereum Factory Address</TableCell>
                                <TableCell>Balance</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Current Contracts</TableCell>
                                <TableCell>Contract Factory</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {factories.map(f => {
                                 return (
                                     <TableRow key={f.address}>
                                         <TableCell><Link to={`/factory/${f.address}`}>{f.name}</Link></TableCell>
                                         <TableCell><Link to={`/factory/${f.address}`}>{f.address}</Link></TableCell>
                                         <TableCell>{f.balance} Ether</TableCell>
                                         <TableCell>{f.price} Ether</TableCell>
                                         <TableCell >{f.contracts.length} x contracts:<ul>
                                             {f.contracts.map(c => {
                                             return ( <li key={c}><Link to={`/contract/${c}`}>{c}</Link></li> )
                                             })}
                                         </ul>
                                        </TableCell>
                                         <TableCell>
                                             <IconButton className={classes.menuButton} color="inherit" aria-label="Contract Now">
                                                 <Link to="/contract" onClick={() => {selectFactory(f)}}>
                                                     <Icon>add_shopping_cart</Icon>
                                                 </Link>
                                             </IconButton>
                                         </TableCell>
                                     </TableRow>
                                 );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
};

export default withStyles(styles)(Dashboard);
