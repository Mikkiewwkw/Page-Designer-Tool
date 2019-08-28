import React from "react";
import uniqueId from "lodash/uniqueId";
import SortableList from "./SortableList";

let base64 = require("base-64");
let url = "https://test-api.mobileaxept.com/micro_service/page-properties";
let username = "spencer.grimes@mobileaxept.com";
let password = "Temp654321";

let headers = {
    Authorization: "Basic " + base64.encode(username + ":" + password),
    "Content-Type": "application/json"
};

class FundSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionList: [], //{ name: "apples", isChecked: false }, { name: "Banana", isChecked: false }
            optionsChecked: [],
            fundLibrary: {},
            isLoading: false,
            error: null,
            sortableArray: []
        };
    }

    componentDidMount() {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        this.setState({ isLoading: true });
        let fundLibrary = null;
        let fundListUrl =
            url + "?client_code=" + client_code + "&field=availableFundAccnos";
        fetch(fundListUrl, {
            method: "GET",
            headers: headers,
            mode: "cors"
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Can't fetch fund options ...");
                }
            })
            .then(data => {
                fundLibrary = data;
                this.setState({ fundLibrary: data });
                for (var element in data) {
                    let fundName = data[element];
                    let option_object = {
                        name: fundName,
                        accno: element,
                        isChecked: false
                    };
                    let new_array = this.state.optionList.concat(option_object);
                    this.setState({
                        optionList: new_array
                    });
                }

                let fundSelectionUrl =
                    url +
                    "?client_code=" +
                    client_code +
                    "&page_id=" +
                    pageId +
                    "&field=accnos";
                fetch(fundSelectionUrl, {
                    method: "GET",
                    headers: headers,
                    mode: "cors"
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Can't fetch selected funds ...");
                        }
                    })
                    .then(data => {
                        let accnosArray = data.value.split(",");
                        const length = accnosArray.length;
                        for (let i = 0; i < length; i++) {
                            let accno = accnosArray[i];
                            let fundName = fundLibrary[accno];
                            this.setState(prevState => ({
                                optionList: prevState.optionList.map(option =>
                                    option.name === fundName
                                        ? { ...option, isChecked: true }
                                        : option
                                )
                            }));
                            this.setState(prevState => ({
                                optionsChecked: [
                                    ...prevState.optionsChecked,
                                    { accno: accno, name: fundName }
                                ]
                            }));
                            this.setState(prevState => ({
                                sortableArray: [
                                    ...prevState.sortableArray,
                                    fundName
                                ]
                            }));
                        }

                        this.setState({ isLoading: false });
                    })
                    .catch(error => this.setState({ error, isLoading: false }));
            })
            .catch(error => this.setState({ error, isLoading: false }));
    }

    getKeyByValue = (object, value) => {
        return Object.keys(object).find(key => object[key] === value);
    };

    componentDidUpdate(prevProps, prevState) {
        //Can also use JSON.stringfy to convert two arrays into a string and compare them directly
        if (
            JSON.stringify(prevState.sortableArray) !==
            JSON.stringify(this.state.sortableArray)
        ) {
            let new_array = this.state.sortableArray.map(option =>
                this.getKeyByValue(this.state.fundLibrary, option)
            );

            let new_string = new_array.join(",");
            this.autoSaveOptions(new_string);
        }
    }

    autoSaveOptions = new_value => {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        const field = "accnos";
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

    onAddingOption = option => {
        const isChecked = option.target.checked;
        const name = option.target.name;
        const value = option.target.value;

        this.setState(prevState => ({
            optionList: prevState.optionList.map(option =>
                option.name === value
                    ? { ...option, isChecked: isChecked }
                    : option
            )
        }));

        if (isChecked) {
            this.setState(prevState => ({
                optionsChecked: [
                    ...prevState.optionsChecked,
                    { accno: name, name: value }
                ]
            }));
            this.setState(prevState => ({
                sortableArray: [...prevState.sortableArray, value]
            }));
        } else {
            const newoptionsChecked = this.state.optionsChecked.filter(
                option => option.name !== value
            );
            this.setState({ optionsChecked: newoptionsChecked });
            const newSortableArray = this.state.sortableArray.filter(
                option => option !== value
            );
            this.setState({ sortableArray: newSortableArray });
        }
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
        const option_list = this.state.optionList.map(option => (
            <label key={uniqueId()} className="checkbox-inline col-md-3">
                <input
                    type="checkbox"
                    name={option.accno}
                    value={option.name}
                    checked={option.isChecked}
                    onChange={this.onAddingOption}
                />
                {option.name}
            </label>
        ));

        return (
            <div id="giving-options" className="giving-options">
                <h3>Giving Options</h3>
                <div className="apperance">
                    <h4>Apperance</h4>
                    <span className="help-block" id="helpBlock">
                        Choose which funds are visible on the page
                    </span>

                    <form>
                        <div className="multi-selection-fund row">
                            {option_list}
                        </div>
                    </form>
                    <div className="ordering">
                        <h4>Ordering</h4>
                        <span className="help-block" id="helpBlock">
                            Choose which order the funds are displayed on the
                            page
                        </span>
                        <div id="simpleList" className="list-group">
                            <SortableList
                                items={this.state.sortableArray}
                                onChange={(order, sortable, evt) => {
                                    this.setState({ sortableArray: order });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FundSelection;
