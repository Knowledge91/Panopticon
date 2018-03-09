import React from 'react';
import { withRouter } from 'react-router-dom';

class Factory extends React.Component {
    render() {
        return (
            <div>
                <h1 className="text-center">Factory</h1>
            </div>
        )
    }
}

export default withRouter(Factory);
