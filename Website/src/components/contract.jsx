import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { unlockCoinbase, deployPanopticonContract, panopticonContractInfo, fulfillPanopticonContract } from '../ethereum.js';
import { withRouter } from 'react-router-dom';
import { DoubleDounce } from 'styled-spinkit';

class Contract extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            minAge: 14,
            loading: false
        }

        this.selectMinAge = this.selectMinAge.bind(this);
        this.deployContract = this.deployContract.bind(this);
    }

    deployContract() {
        this.setState({ loading: true });
        deployPanopticonContract(this.props.client.address, this.props.factory.address).then((address) => {
            if(address) {
                console.log("deployed");
                this.props.addContractAddressToFactory(address, this.props.factory);
                this.props.history.push(`/contract/${address}`);
            }
        });
    }

    selectMinAge(event) {
        this.setState({ minAge: event.target.value });
    }

    render() {
        const loading = this.state.loading;
        return (
            <div>
            {!loading ? (
                <div>
                    <h1 className="text-center">
                        Contract
                    </h1>
                    <h2>Between {this.props.client.name} and {this.props.factory.name}</h2>
                    <Form>
                        <FormGroup>
                            <Label for="minAge">Minimum Age: </Label>
                            <Input type="select" name="minAge" value={this.state.minAge} onChange={this.selectMinAge}>
                                <option>14</option>
                                <option>16</option>
                                <option>18</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Button onClick={this.deployContract}>Deploy</Button>
                        </FormGroup>
                    </Form>
                </div>
            ) : (
                <DoubleDounce size="100" />
            )}
                </div>
        )
    }
}

export default withRouter(Contract);
