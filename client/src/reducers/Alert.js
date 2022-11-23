import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
const initialState = [];

const alertReducer = (state = initialState, action) => {
    //*S - the payload is what is send to the reducer i.e. if we send only the id then the payload is the id
    //*S - the type is set to our action calls i.e. set_alert and remove_alert will be called to set and remove alerts on the frontend

    //* - destructure action to save on typing out action.payload/id etc.
    const { type, payload } = action;
    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter((alert) => alert.id !== payload);
        default:
            return state;
    }
};

export default alertReducer;
