import React from "react";
import uniqueId from "lodash/uniqueId";

let base64 = require("base-64");
let url = "https://test-api.mobileaxept.com/micro_service/page-properties";
let username = "spencer.grimes@mobileaxept.com";
let password = "Temp654321";
let headers = {
    Authorization: "Basic " + base64.encode(username + ":" + password),
    "Content-Type": "application/json"
};

class RadioOption extends React.Component {
    render() {
        const {
            id,
            className,
            optionName,
            isChecked,
            value,
            onChange
        } = this.props;
        return (
            <div className={className}>
                <div className="radio">
                    <label htmlFor={"optionsRadios" + id}>
                        <input
                            id={"optionsRadios" + id}
                            type="radio"
                            name={optionName}
                            value={value}
                            onChange={onChange}
                            checked={isChecked}
                        />
                        {optionName}
                    </label>
                </div>
            </div>
        );
    }
}

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layoutOptions: [
                {
                    className: "fundSelectionFirst",
                    name: "Fund Seletion First",
                    value: "1",
                    isChecked: false
                },
                {
                    className: "amountFirst",
                    name: "Amount First",
                    value: "2",
                    isChecked: false
                }
            ],
            isLoading: false,
            error: null
        };
    }

    // isEquivalent = (a,b) => {
    //   var aProps = Object.getOwnPro
    // }

    componentDidMount() {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        const field = this.props.field;
        this.setState({ isLoading: true });
        let newUrl =
            url +
            "?client_code=" +
            client_code +
            "&page_id=" +
            pageId +
            "&field=" +
            field;
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
                this.setState(prevState => ({
                    layoutOptions: prevState.layoutOptions.map(option =>
                        option.value === data.value
                            ? { ...option, isChecked: true }
                            : option
                    )
                }));
                this.setState({ isLoading: false });
            })
            .catch(error => this.setState({ error, isLoading: false }));
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.layoutOptions[0].isChecked === false &&
            this.state.layoutOptions[0].isChecked === true
        ) {
            let new_value = prevState.layoutOptions[0].value;
            this.autoSaveOption(new_value);
        } else if (
            prevState.layoutOptions[1].isChecked === false &&
            this.state.layoutOptions[1].isChecked === true
        ) {
            let new_value = prevState.layoutOptions[1].value;
            this.autoSaveOption(new_value);
        }
    }

    autoSaveOption = new_value => {
        // console.log("autosaved layoutOption");
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        const field = this.props.field;
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

    handleChange = option => {
        const isChecked = option.target.checked;
        // console.log(isChecked);
        const value = option.target.value;
        console.log(value);

        this.setState({ layoutChosen: value });
        this.setState(
            prevState => ({
                layoutOptions: prevState.layoutOptions.map(option =>
                    option.value === value
                        ? { ...option, isChecked: isChecked }
                        : { ...option, isChecked: !isChecked }
                )
            }),
            function() {
                console.log(
                    "fundSelectionFirst",
                    this.state.layoutOptions[0].isChecked
                );
                console.log(
                    "amountFirst",
                    this.state.layoutOptions[1].isChecked
                );
            }
        );
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
        const optionList = this.state.layoutOptions.map((option, i) => (
            <RadioOption
                id={i}
                key={uniqueId()}
                className={option.className}
                optionName={option.name}
                value={option.value}
                isChecked={option.isChecked}
                onChange={this.handleChange}
            />
        ));
        return (
            <div id="layout" className="layout">
                <h3>Layout</h3>
                <span className="help-block" id="helpBlock">
                    Choose the page layout
                </span>
                {optionList}
            </div>
        );
    }
}

export default Layout;
