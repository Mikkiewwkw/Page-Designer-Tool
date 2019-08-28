import React from "react";
import uniqueId from "lodash/uniqueId";
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

const propertyArray = ["showRecurring", "showOneTime"];
const length = propertyArray.length;

class Checkbox extends React.Component {
    render() {
        const { isChecked, onCheckboxChange, name, value } = this.props;

        return (
            <label
                key={uniqueId()}
                className="checkbox-inline"
                htmlFor="frequency-selection"
            >
                <input
                    value={value}
                    checked={isChecked}
                    onChange={onCheckboxChange}
                    onBlur={onCheckboxChange}
                    type="checkbox"
                />
                {name}
            </label>
        );
    }
}

class FrequencyOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            frequencyOptions: [
                { name: "Weekly", isChecked: false, value: "-WEEKLY-" },
                {
                    name: "Every Other Week",
                    isChecked: false,
                    value: "-EVERY-OTHER-WEEK-"
                },
                {
                    name: "Twice Monthly",
                    isChecked: false,
                    value: "-TWICE_MONTHLY-"
                },
                { name: "Monthly", isChecked: false, value: "-MONTHLY-" }
            ],
            frequencyOptionsChecked: [],
            totalFrequencyOptionsChecked: 0,
            errorMessage: `Must have at least ${props.minCount} checkbox selected.`
        };
        this.addFrequencyOptions = this.addFrequencyOptions.bind(this);
    }

    componentDidMount() {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        const field = "frequencyChoices";
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
                const dataArray = data.value.split(",");
                const length = dataArray.length;

                this.setState({ totalFrequencyOptionsChecked: length });
                for (let i = 0; i < length; i++) {
                    this.setState(prevState => ({
                        frequencyOptions: prevState.frequencyOptions.map(
                            frequency =>
                                frequency.value === dataArray[i]
                                    ? { ...frequency, isChecked: true }
                                    : frequency
                        )
                    }));
                    this.setState(prevState => ({
                        frequencyOptionsChecked: [
                            ...prevState.frequencyOptionsChecked,
                            dataArray[i]
                        ]
                    }));
                }
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            JSON.stringify(prevState.frequencyOptionsChecked) !==
            JSON.stringify(this.state.frequencyOptionsChecked)
        ) {
            let new_string = this.state.frequencyOptionsChecked.join();
            this.autoSaveFrequencyOptions(new_string);
        }
    }

    autoSaveFrequencyOptions = new_value => {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        const field = "frequencyChoices";
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

    addFrequencyOptions(event) {
        let { totalFrequencyOptionsChecked } = this.state;
        const isChecked = event.target.checked;
        const value = event.target.value;

        if (event.type === "change") {
            if (event.currentTarget.checked) {
                totalFrequencyOptionsChecked += 1;
                this.setState({
                    totalFrequencyOptionsChecked: totalFrequencyOptionsChecked
                });
            } else {
                totalFrequencyOptionsChecked -= 1;
                this.setState(
                    {
                        totalFrequencyOptionsChecked: totalFrequencyOptionsChecked
                    },
                    () =>
                        this.state.totalFrequencyOptionsChecked < 1
                            ? toast.error(this.state.errorMessage, {
                                autoClose: 5000
                            })
                            : null
                );
            }
        }

        this.setState(prevState => ({
            frequencyOptions: prevState.frequencyOptions.map(option =>
                option.value === value
                    ? { ...option, isChecked: isChecked }
                    : option
            )
        }));

        if (isChecked) {
            this.setState(prevState => ({
                frequencyOptionsChecked: [
                    ...prevState.frequencyOptionsChecked,
                    value
                ]
            }));
        } else {
            const newfrequencyOptionsChecked = this.state.frequencyOptionsChecked.filter(
                option => option !== value
            );
            this.setState(
                {
                    frequencyOptionsChecked: newfrequencyOptionsChecked
                },
                console.log(this.state.frequencyOptionsChecked)
            );
        }
    }

    render() {
        const { errorMessage } = this.state;

        return (
            <div className="frequency-option">
                <h4>Frequency Options</h4>
                <div className="multi-selection-frequency-option">
                    <div>
                        <p
                            className={
                                this.state.totalFrequencyOptionsChecked <
                                this.props.minCount
                                    ? "errorMessageTransition"
                                    : "hiddenDiv"
                            }
                        >
                            {errorMessage}
                        </p>
                        {this.state.frequencyOptions.map(option => (
                            <Checkbox
                                key={uniqueId()}
                                value={option.value}
                                isChecked={option.isChecked}
                                onCheckboxChange={this.addFrequencyOptions}
                                name={option.name}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

class Frequency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            frequencyList: [
                {
                    name: "One-time",
                    dataBaseName: "showOneTime",
                    isChecked: false
                },
                {
                    name: "Recurring",
                    dataBaseName: "showRecurring",
                    isChecked: false
                }
            ],

            showRecurring: false,
            showOneTime: false,

            visible: false,
            isLoading: false,
            error: null
        };
    }

    componentDidMount() {
        const client_code = this.props.clientCode;
        const pageId = this.props.pageId;
        this.setState({ isLoading: true });
        for (let i = 0; i < length; i++) {
            const field = propertyArray[i];
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
                    let isChecked = null;
                    if (data.value === "True") {
                        isChecked = true;
                    } else {
                        isChecked = false;
                    }

                    if (data.prop_key.includes("showRecurring")) {
                        this.setState({ showRecurring: isChecked });
                        this.setState({ visible: isChecked });
                        this.setState(prevState => ({
                            frequencyList: prevState.frequencyList.map(option =>
                                option.dataBaseName === "showRecurring"
                                    ? { ...option, isChecked: isChecked }
                                    : option
                            )
                        }));
                    } else if (data.prop_key.includes("showOneTime")) {
                        this.setState({ showOneTime: isChecked });
                        this.setState(prevState => ({
                            frequencyList: prevState.frequencyList.map(option =>
                                option.dataBaseName === "showOneTime"
                                    ? {
                                        ...option,
                                        isChecked: isChecked
                                    }
                                    : option
                            )
                        }));
                    }
                })

                .catch(error =>
                    this.setState({ error: error, isLoading: false })
                );
        }
        this.setState({ isLoading: false });
    }

    componentDidUpdate(prevProps, prevState) {
        let new_value = null;
        let field = null;
        if (prevState.showRecurring !== this.state.showRecurring) {
            new_value = this.state.showRecurring;
            field = "showRecurring";
            this.autosaveFrequency(field, new_value);
        } else if (prevState.showOneTime !== this.state.showOneTime) {
            new_value = this.state.showOneTime;
            field = "showOneTime";
            this.autosaveFrequency(field, new_value);
        }
    }

    autosaveFrequency = (field, new_value) => {
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

    addFrequency = event => {
        const isChecked = event.target.checked;
        const value = event.target.value;

        this.setState(prevState => ({
            frequencyList: prevState.frequencyList.map(option =>
                option.name === value
                    ? { ...option, isChecked: isChecked }
                    : option
            )
        }));

        if (isChecked) {
            if (value === "Recurring") {
                this.setState({ visible: true });
                this.setState({ showRecurring: isChecked });
            } else if (value === "One-time") {
                this.setState({ showOneTime: isChecked });
            }
        } else {
            if (value === "Recurring") {
                this.setState({ visible: false });
                this.setState({ showRecurring: isChecked }); //Need a better way to solve this
                if (!this.state.showOneTime) {
                    toast.error("Must select at least one frequency option", {
                        autoClose: 5000
                    });
                }
            } else if (value === "One-time") {
                console.log(this.state.showOneTime);
                this.setState({ showOneTime: isChecked }); //Need a better way to solve this
                if (!this.state.showRecurring) {
                    toast.error("Must select at least one frequency option", {
                        autoClose: 5000
                    });
                }
            }
        }
    };

    render() {
        const frequency_list = this.state.frequencyList.map(frequency => (
            <label
                key={uniqueId()}
                className="checkbox-inline"
                htmlFor="frequency-selection"
            >
                <input
                    type="checkbox"
                    value={frequency.name}
                    checked={frequency.isChecked}
                    onChange={this.addFrequency}
                />
                {frequency.name}
            </label>
        ));

        return (
            <div className="frequency">
                <h4>Frequency</h4>
                <span className="help-block" id="helpBlock">
                    Choose which frequency option are available to the user
                </span>
                <div className="multi-selection-frequency">
                    {frequency_list}
                    <ToastContainer />
                    <div
                        className={
                            this.state.visible
                                ? "frequencyTransition"
                                : "hiddenDiv"
                        }
                    >
                        <FrequencyOptions
                            minCount={1}
                            clientCode="194"
                            pageId="null"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Frequency;
