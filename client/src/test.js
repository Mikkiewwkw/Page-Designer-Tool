import uniqueId from "lodash/uniqueId";
import React from "react";
import Sortable from "react-sortablejs";
import PropTypes from "prop-types";

// Functional Component
const SortableExample = ({ items, onChange }) => {
    let sortable = null; // sortable instance
    const reverseOrder = evt => {
        const order = sortable.toArray();
        onChange(order.reverse());
    };
    const listItems = items.map(val => (
        <li key={uniqueId()} data-id={val}>
            List Item: {val}
        </li>
    ));

    return (
        <div>
            <button type="button" onClick={reverseOrder}>
                Reverse Order
            </button>
            <Sortable
                options={{}}
                ref={c => {
                    if (c) {
                        sortable = c.sortable;
                    }
                }}
                tag="ul"
                onChange={(order, sortable, evt) => {
                    onChange(order);
                }}
            >
                {listItems}
            </Sortable>
        </div>
    );
};

SortableExample.propTypes = {
    items: PropTypes.array,
    onChange: PropTypes.func
};

export default SortableExample;
