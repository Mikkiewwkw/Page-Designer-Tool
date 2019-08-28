import React from "react";
import uniqueId from "lodash/uniqueId";
import FundSelection from "./FundSelection";
import Frequency from "./frequency";
import Logo from "./Logo";
import Label from "./Label";
import Nav from "./Nav";
import Colors from "./Colors";
import Layout from "./Layout";
// import LogoColorManager from "./Logo_Color_Manager";

const App = () => {
    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row">
                    <Nav />
                    <div className="containter col-lg-10 col-md-10 col-sm-10 col-xs-10">
                        <main>
                            <div className="content-container col-md-8">
                                <h2>Page Setting</h2>
                                <FundSelection
                                    key={uniqueId()}
                                    clientCode="194"
                                    pageId="sgr-null"
                                />
                                <hr></hr>
                                <Frequency
                                    key={uniqueId()}
                                    clientCode="194"
                                    pageId="null"
                                />
                                <hr></hr>
                                <Logo
                                    prefix="194/"
                                    bucketName="max-client-logos"
                                    clientCode="194"
                                    pageId="sgr-null"
                                />
                                <hr></hr>
                                <Colors
                                    key={uniqueId()}
                                    clientCode="194"
                                    pageId="sgr-null"
                                />
                                <hr></hr>
                                <Label
                                    key={uniqueId()}
                                    clientCode="194"
                                    pageId="null"
                                />
                                <hr></hr>
                                <Layout
                                    key={uniqueId()}
                                    clientCode="194"
                                    pageId="null"
                                    field="donateLayout"
                                />
                                <hr></hr>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
