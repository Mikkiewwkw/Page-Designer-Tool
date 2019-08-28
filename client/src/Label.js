import React from "react";
import uniqueId from "lodash/uniqueId";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let base64 = require("base-64");
let url = "https://test-api.mobileaxept.com/micro_service/page-properties";
let username = "spencer.grimes@mobileaxept.com";
let password = "Temp654321";

let headers = {
    Authorization: "Basic " + base64.encode(username + ":" + password),
    "Content-Type": "application/json"
};
// let headers = new Headers();
// headers.append(
//     "Authorization",
//     "Basic " + base64.encode(username + ":" + password)
// );
// headers.append("Access-Control-Allow-Origin", "*");
// headers.append()

const propertyArray = [
    "pageTitle",
    "fundLabel",
    "title",
    "postFundSelectionHtml"
];
const length = propertyArray.length;
const propertyLibrary = {
    "Page Title": "pageTitle",
    "Panel Title": "title",
    "Selection Title": "fundLabel",
    "Additional Text": "postFundSelectionHtml"
};

class Textbox extends React.Component {
    render() {
        const { name, helptext, onChange, onSubmit, value } = this.props;
        return (
            <div>
                <label htmlFor={name} className="form-label">
                    {name}
                </label>
                <span className="help-block" id="helpBlock">
                    {helptext}
                </span>
                <form className="form-inline" onSubmit={onSubmit}>
                    <div
                        className="form-group md-2"
                        style={{ marginRight: "5px" }}
                    >
                        <input
                            type="text"
                            className="form-control"
                            id="inputHelpBlock"
                            value={value}
                            name={name}
                            onChange={onChange}
                            placeholder={name}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
                <br />
            </div>
        );
    }
}

class Label extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageText: "",
            panelText: "",
            selectionText: "",
            additionalText: "",
            isLoading: false,
            error: null
        };
    }

    componentDidMount() {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        this.setState({ isLoading: true });
        for (let i = 0; i < length; i++) {
            // let body = {
            //     client_code: "194",
            //     pageId: "null",
            //     field: propertyArray[i]
            // };
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
                    if (data.prop_key.includes("pageTitle")) {
                        this.setState({
                            pageText: data.value,
                            isLoading: false
                        });
                    } else if (data.prop_key.includes("fundLabel")) {
                        this.setState({
                            selectionText: data.value,
                            isLoading: false
                        });
                    } else if (data.prop_key.includes("title")) {
                        this.setState({
                            panelText: data.value,
                            isLoading: false
                        });
                    } else if (
                        data.prop_key.includes("postFundSelectionHtml")
                    ) {
                        this.setState({
                            additionalText: data.value,
                            isLoading: false
                        });
                    }
                })
                .catch(error => this.setState({ error, isLoading: false }));
        }
    }

    handleChange = event => {
        if (event.target.name === "Page Title") {
            this.setState({ pageText: event.target.value });
        } else if (event.target.name === "Panel Title") {
            this.setState({ panelText: event.target.value });
        } else if (event.target.name === "Selection Title") {
            this.setState({ selectionText: event.target.value });
        } else if (event.target.name === "Addtional Text") {
            this.setState({ additionalText: event.target.value });
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        console.log(event.target);
        const data = new FormData(event.target);
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        let keyValPair = [];
        for (var p of data) {
            keyValPair = p;
            console.log(keyValPair);
        }
        const fieldName = keyValPair[0];
        console.log(fieldName);
        const field = propertyLibrary[fieldName];
        console.log(field);
        const new_value = keyValPair[1];

        // let newUrl =
        //     url +
        //     "client_code=" +
        //     client_code +
        //     "&pageId=" +
        //     pageId +
        //     "&field=" +
        //     field +
        //     "&new_value=" +
        //     new_value;

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
                    return response.json();
                } else {
                    throw new Error("Something went wrong ...");
                }
            })
            .then(data => {
                console.log(data);
                toast.success("Upload successfully", { autoClose: 3000 });
            })
            .catch(error => console.log(error));

        // alert("You submitted successfully");
    };
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
            <div id="labels" className="labels">
                <h3>Label</h3>
                <ToastContainer />
                <div className="label-page">
                    <Textbox
                        name="Page Title"
                        helptext="This changes the title of the tab"
                        value={this.state.pageText}
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                    />
                </div>
                <div className="label-panel">
                    <Textbox
                        name="Panel Title"
                        helptext="This changes the title at the top of the page"
                        value={this.state.panelText}
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                    />
                </div>
                <div className="label-selection">
                    <Textbox
                        name="Selection Title"
                        helptext="This is the label applied above the fund select dropdown menu"
                        value={this.state.selectionText}
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                    />
                </div>
                <div className="additional-text">
                    <h4>Additional Text</h4>
                    <span className="help-block" id="helpBlock">
                        Additional Text below the fund selection
                    </span>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group md-2">
                            <textarea
                                className="form-control"
                                name="Addtional Text"
                                rows="5"
                                value={this.state.additionalText}
                                onChange={this.handleChange}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                value={this.state.additionalText}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Label;
