import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
};

const authReducer = (state = initialState, action) => {
    //*S - the payload is what is send to the reducer i.e. if we send only the id then the payload is the id
    //*S - the type is set to our action calls i.e. set_alert and remove_alert will be called to set and remove alerts on the frontend

    //* - destructure action to save on typing out action.payload/id etc.
    const { type, payload } = action;
    switch (type) {
        case USER_LOADED:
            return { ...state, isAuthenticated: true, loading: false, user: payload };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem("token", payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false };
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem("token");
            return { ...state, token: null, isAuthenticated: false, loading: false, user: null };
        default:
            return state;
    }
};

export default authReducer;
