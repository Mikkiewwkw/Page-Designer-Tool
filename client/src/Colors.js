import React from "react";
import reactCSS from "reactcss";
import { ChromePicker } from "react-color";

let base64 = require("base-64");
let url = "https://test-api.mobileaxept.com/micro_service/page-properties";
let username = "spencer.grimes@mobileaxept.com";
let password = "Temp654321";
let headers = {
    Authorization: "Basic " + base64.encode(username + ":" + password),
    "Content-Type": "application/json"
};
const propertyArray = [
    "style.button-color",
    "style.main-background-color",
    "style.top-nav-color"
];
const length = propertyArray.length;
const propertyLibrary = {
    Background: "style.main-background-color",
    Header: "style.top-nav-color",
    SelectionButton: "style.button-color"
};
class ColorpickerComponent extends React.Component {
    render() {
        const {
            value,
            className,
            title,
            onClick,
            onColorChange,
            onTextboxChange,
            onClose,
            displayColorPicker,
            addonColor
        } = this.props;

        const styles = reactCSS({
            default: {
                color: {
                    width: "17px",
                    height: "17px",
                    borderRadius: "2px",
                    background: addonColor
                }
            }
        });

        return (
            <div className={className}>
                <h5>{title}</h5>
                <div className="input-group colorpicker-container">
                    <input
                        type="text"
                        className="form-control colorpicker-text"
                        value={value}
                        name={title}
                        onClick={onClick}
                        onChange={onTextboxChange}
                    />
                    <span className="input-group-addon">
                        <i>
                            <div
                                className="colorpicker-swatch"
                                onClick={onClick}
                            >
                                <div style={styles.color} />
                            </div>
                        </i>
                        {displayColorPicker ? (
                            <div className="colorpicker-popover">
                                <div
                                    className="colorpicker-cover"
                                    onClick={onClose}
                                    onBlur={onClose}
                                />
                                <ChromePicker
                                    color={addonColor}
                                    onChange={onColorChange}
                                />
                            </div>
                        ) : null}
                    </span>
                </div>
            </div>
        );
    }
}

class Colors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoading: false,
            displayBackgroundColorPicker: false,
            Background: "",
            // Background_colorText: "#00aabb",
            displayHeaderColorPicker: false,
            Header: "",
            // Header_colorText: "#00aabb",
            displaySelectionColorPicker: false,
            SelectionButton: ""
            // Selection_colorText: "#00aabb"
        };
    }

    componentDidMount() {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        this.setState({ isLoading: true });
        for (let i = 0; i < length; i++) {
            let newUrl =
                url +
                "?client_code=" +
                client_code +
                "&page_id=" +
                pageId +
                "&field=" +
                propertyArray[i];

            // console.log(newUrl);
            fetch(newUrl, {
                method: "GET",
                headers: headers,
                mode: "cors"
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Something went wrong ...");
                    }
                })
                .then(data => {
                    // console.log(data);
                    if (data.prop_key.includes("button-color")) {
                        this.setState({
                            SelectionButton: data.value,
                            isLoading: false
                        });
                    } else if (data.prop_key.includes("top-nav-color")) {
                        this.setState({ Header: data.value, isLoading: false });
                    } else if (
                        data.prop_key.includes("main-background-color")
                    ) {
                        this.setState({
                            Background: data.value,
                            isLoading: false
                        });
                        // this.props.getBackgroundColor(data.value);
                    }
                })
                .catch(error => this.setState({ error, isLoading: false }));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let new_value = null;
        let field = null;
        if (prevState.Background !== this.state.Background) {
            // console.log("Update Background");
            // this.props.getBackgroundColor(this.state.Background);
            new_value = this.state.Background;
            field = propertyLibrary["Background"];
            this.autoSaveColor(field, new_value);
        } else if (prevState.Header !== this.state.Header) {
            // console.log("Update Header");
            new_value = this.state.Header;
            field = propertyLibrary["Header"];
            this.autoSaveColor(field, new_value);
        } else if (prevState.SelectionButton !== this.state.SelectionButton) {
            // console.log("Update SelectionButton");
            new_value = this.state.SelectionButton;
            field = propertyLibrary["SelectionButton"];
            this.autoSaveColor(field, new_value);
        }
    }

    handleClick = name => {
        return e => {
            if (name === "Background") {
                this.closeAll();
                this.setState({
                    displayBackgroundColorPicker: !this.state
                        .displayBackgroundColorPicker
                });
            } else if (name === "Header") {
                this.closeAll();
                this.setState({
                    displayHeaderColorPicker: !this.state
                        .displayHeaderColorPicker
                });
            } else if (name === "Selection Button") {
                this.closeAll();
                this.setState({
                    displaySelectionColorPicker: !this.state
                        .displaySelectionColorPicker
                });
            }
        };
    };

    closeAll = () => {
        this.setState({
            displayBackgroundColorPicker: false
        });
        this.setState({
            displayHeaderColorPicker: false
        });
        this.setState({
            displaySelectionColorPicker: false
        });
    };

    handleClose = name => {
        return e => {
            if (name === "Background") {
                this.setState({
                    displayBackgroundColorPicker: false
                });
            } else if (name === "Header") {
                this.setState({
                    displayHeaderColorPicker: false
                });
            } else if (name === "Selection Button") {
                this.setState({
                    displaySelectionColorPicker: false
                });
            }
        };
    };

    autoSaveColor = (field, new_value) => {
        // console.log("autosaved color");
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        let body = {
            client_code: client_code,
            page_id: pageId,
            field: field,
            new_value: new_value
        };

        fetch(url, {
            method: "POST",
            headers: headers,
            mode: "cors",
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                } else {
                    throw new Error("Something went wrong ...");
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => console.log(error));
    };
    //Can also use handleChange but that will change the state everytime we call on drag events
    handleBackgroundChange = color => {
        this.setState({
            Background: color.hex
            // Background_colorText: color.hex
        });
    };

    handleHeaderChange = color => {
        this.setState({
            Header: color.hex
            // Header_colorText: color.hex
        });
    };

    handleSelectionChange = color => {
        this.setState({
            SelectionButton: color.hex
            // Selection_colorText: color.hex
        });
    };

    handleTextboxChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === "Background") {
            this.setState({ Background: value });
        } else if (name === "Header") {
            this.setState({ Header: value });
        } else if (name === "Selection Button") {
            this.setState({ SelectionButton: value });
        }
    };

    // handleChangeComplete = () => {
    //
    // }
    // if (event.target.name === "Background") {
    //     this.setState({ Background: color.hex });
    // } else if (event.target.name === "Header") {
    //     this.setState({ Header: color.hex });
    // } else if (event.target.name === "Selection Button") {
    //     this.setState({ SelectionButton: color.hex });
    // } else {
    //     //do nothing
    // }

    render() {
        if (this.state.error) {
            return <p>{this.state.error.message}</p>;
        }
        if (this.state.isLoading) {
            return (
                <div className="loader" id="loader-1">
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }
        return (
            <div id="colors" className="colors">
                <h3>Colors</h3>
                <span className="help-block" id="helpBlock">
                    Change the color of the page
                </span>
                <ColorpickerComponent
                    className="background-color"
                    value={this.state.Background}
                    title="Background"
                    onTextboxChange={this.handleTextboxChange}
                    onColorChange={this.handleBackgroundChange}
                    onClick={this.handleClick("Background")}
                    displayColorPicker={this.state.displayBackgroundColorPicker}
                    onClose={this.handleClose("Background")}
                    addonColor={this.state.Background}
                />
                <ColorpickerComponent
                    className="header-color"
                    value={this.state.Header}
                    title="Header"
                    onTextboxChange={this.handleTextboxChange}
                    onColorChange={this.handleHeaderChange}
                    onClick={this.handleClick("Header")}
                    displayColorPicker={this.state.displayHeaderColorPicker}
                    onClose={this.handleClose("Header")}
                    addonColor={this.state.Header}
                />
                <ColorpickerComponent
                    className="selection-button-color"
                    value={this.state.SelectionButton}
                    title="Selection Button"
                    onTextboxChange={this.handleTextboxChange}
                    onColorChange={this.handleSelectionChange}
                    onClick={this.handleClick("Selection Button")}
                    displayColorPicker={this.state.displaySelectionColorPicker}
                    onClose={this.handleClose("Selection Button")}
                    addonColor={this.state.SelectionButton}
                />
            </div>
        );
    }
}

export default Colors;
