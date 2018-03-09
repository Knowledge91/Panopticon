import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { resetSession } from '../sessionStorage.js';

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar color="faded" light expand="md">
                    <NavbarBrand href="/">Panopticon</NavbarBrand>
                    <NavItem>
                        <NavLink href="/">Home</NavLink>
                    </NavItem>


                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            Welcome {this.props.client.name}, you have <strong>{this.props.client.balance} Ether</strong>.
                        </NavItem>
                        <NavItem>
                            <NavLink href="/" onClick={this.props.reset}>Reset</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}
