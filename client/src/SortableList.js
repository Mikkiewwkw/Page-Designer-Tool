import uniqueId from "lodash/uniqueId";
import React from "react";
import Sortable from "react-sortablejs";
import PropTypes from "prop-types";

// Functional Component
const SortableList = ({ items, onChange }) => {
    let sortable = null; // sortable instance
    const listItems = items.map(val => (
        <li key={uniqueId()} data-id={val} className="list-group-item">
            {val}
        </li>
    ));
    const reverseOrder = event => {
        const order = sortable.toArray();
        onChange(order.reverse());
    };

    return (
        <div>
            <div className="form-group row">
                <div className="col-sm-10 col-md-12">
                    <button
                        name="button"
                        className="btn btn-primary"
                        type="button"
                        onClick={reverseOrder}
                    >
                        Reverse Order
                    </button>
                </div>
            </div>
            <Sortable
                options={{
                    animation: 150,
                    ghostClass: "blue-background-class"
                }}
                tag="ul"
                ref={c => {
                    if (c) {
                        sortable = c.sortable;
                    }
                }}
                onChange={(order, sortable, evt) => {
                    onChange(order);
                }}
            >
                {listItems}
            </Sortable>
        </div>
    );
};

SortableList.propTypes = {
    items: PropTypes.array,
    onChange: PropTypes.func
};

export default SortableList;
