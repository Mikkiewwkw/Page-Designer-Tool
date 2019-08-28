import React from "react";
import uniqueId from "lodash/uniqueId";
import Logo from "./Logo";
import Colors from "./Colors";

class LogoColorManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "#00aabb"
        };
    }

    getBackgroundColor = color => {
        console.log(color);
        this.setState({ backgroundColor: color });
    };

    render() {
        return (
            <div className="logo_color_manager">
                <Logo
                    prefix="194/"
                    bucketName="max-client-logos"
                    clientCode="194"
                    pageId="sgr-null"
                    backgroundColor={this.state.backgroundColor}
                />
                <hr></hr>
                <Colors
                    key={uniqueId()}
                    clientCode="194"
                    pageId="sgr-null"
                    getBackgroundColor={this.getBackgroundColor}
                />
            </div>
        );
    }
}

export default LogoColorManager;
