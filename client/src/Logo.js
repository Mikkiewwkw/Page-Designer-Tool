import React from "react";
import uniqueId from "lodash/uniqueId";
import downloadS3 from "./s3config";
// import S3FileUpload from "react-s3";
// import { uploadFile } from "react-s3";
// import axios from "axios";
import Dropzone from "./Dropzone";
require("dotenv").config(); //need this

let base64 = require("base-64");
let url = "https:"; //replace your url here
let username = "";//replace your user name
let password = ""; //replace your password
let headers = {
    Authorization: "Basic " + base64.encode(username + ":" + password),
    "Content-Type": "application/json"
};

var AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: "", //replace access keyID
    secretAccessKey: "", //replace secretAccessKey
    region: "" //replace region
});
const s3 = new AWS.S3();

class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropZone: false,
            // backgroundColor: null,
            choice: "",
            options: [],
            error: null,
            isLoading: false //Need to somehow set up the initial state so that the user can see the current stage of the logo
        };
    }

    handleChange = option => {
        const value = option.target.value;
        this.setState({ choice: value });
    };

    async componentDidMount() {
        this.setState({ isLoading: true });
        try {
            const result = await downloadS3(
                this.props.prefix,
                this.props.bucketName
            );
            await this.getBackgroundColor();
            this.setState({ options: result, isLoading: false });
        } catch (error) {
            this.setState({ error: error, isLoading: false });
        }
    }

    getBackgroundColor = () => {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        const field = "style.main-background-color";
        let newUrl =
            url +
            "?client_code=" +
            client_code +
            "&page_id=" +
            pageId +
            "&field=" +
            field;
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
                console.log(data);
                this.setState({ backgroundColor: data.value });
            })
            .catch(error => this.setState({ error: error, isLoading: false }));
    };

    handleClick = () => {
        this.setState(prevState => ({ showDropZone: !prevState.showDropZone }));
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

        var list = this.state.options;
        const allURL = list.map(key =>
            s3.getSignedUrl("getObject", {
                Bucket: this.props.bucketName,
                Key: key,
                Expires: 300
            })
        );

        const logoList = allURL.map(url => (
            <div key={uniqueId()} className="container col-md-12">
                <label className="radio-inline">
                    <input
                        type="radio"
                        name="inlineRadioOptions"
                        value={url}
                        onChange={this.handleChnage}
                    />
                    <img className="logoImage" src={url} alt="" />
                </label>
            </div>
        ));

        const backgroundColor = {
            background: this.state.backgroundColor
        };
        return (
            <div id="logo" className="logo">
                <h3>Logo</h3>
                <span className="help-block" id="helpBlock">
                    Choose page logo
                </span>
                <div className="logo-options" style={backgroundColor}>
                    {logoList}
                </div>
                <br />
                <form className="logo-upload form-group row">
                    <div className="col-sm-10 col-md-12">
                        <button
                            name="button"
                            className="btn btn-primary"
                            type="submit"
                            onClick={this.handleClick}
                        >
                            Add a new logo
                        </button>
                    </div>
                </form>
                <Dropzone prefix={this.props.prefix} />
            </div>
        );
    }
}

export default Logo;
