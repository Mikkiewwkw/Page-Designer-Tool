import React from "react";
// import Scrollspy from "react-scrollspy";

class NavItem extends React.Component {
    render() {
        const { titleName, refer } = this.props;
        return (
            <li className="nav-item p-1">
                <a href={"#" + refer}>
                    <span className="title">{titleName}</span>
                </a>
            </li>
        );
    }
}

class Nav extends React.Component {
    render() {
        return (
            <nav
                id="myScrollspy"
                className="col-lg-2 col-md-2 col-sm-2 col-xs-2"
            >
                <div className="sidebar-sticky">
                    <div className="sidebar-inner">
                        <ul
                            className="nav flex-column nav-pills nav-stacked"
                            data-spy="affix"
                        >
                            <NavItem
                                titleName="Giving Options"
                                refer="giving-options"
                            />
                            <NavItem titleName="Logo" refer="logo" />
                            <NavItem titleName="Colors" refer="colors" />
                            <NavItem titleName="Label" refer="label" />
                            <NavItem titleName="Layout" refer="layout" />
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Nav;
