import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from "./types";
import axios from "axios";
import setAlert from "./alert";
import setAuthToken from "../utils/setAuthToken";

//* - Load User
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get("/auth");
        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

//* - register a user

export const registerUser =
    ({ name, email, password }) =>
    async (dispatch) => {
        try {
            const res = await axios.post("/users", { name, email, password });
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
            dispatch(loadUser());
        } catch (error) {
            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, "danger"));
                });
            }
            dispatch({
                type: REGISTER_FAIL,
            });
        }
    };

//* - Login User

export const loginUser = (email, password) => async (dispatch) => {
    try {
        const res = await axios.post("/auth", { email, password });
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: LOGIN_FAIL,
        });
    }
};

//* - Logout User

export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT,
    });
};
