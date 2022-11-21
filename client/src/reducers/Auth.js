import { REGISTER_SUCCESS, REGISTER_FAIL } from "../actions/types";
const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
};

const authReducer = (state = initialState, action) => {
    //NOTES - the payload is what is send to the reducer i.e. if we send only the id then the payload is the id
    //NOTES - the type is set to our action calls i.e. set_alert and remove_alert will be called to set and remove alerts on the frontend

    //info - destructure action to save on typing out action.payload/id etc.
    const { type, payload } = action;
    switch (type) {
        case REGISTER_SUCCESS:
            localStorage.setItem("token", payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false };
        case REGISTER_FAIL:
            localStorage.removeItem("token");
            return { ...state, token: null, isAuthenticated: false, loading: false };
        default:
            return state;
    }
};

export default authReducer;
