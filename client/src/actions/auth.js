import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from "./types";
import axios from "axios";
import setAlert from "./alert";
import setAuthToken from "../utils/setAuthToken";

//info - Load User
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

//info - register a user

export const registerUser = (formData) => async (dispatch) => {
    try {
        const res = await axios.post("/users", formData);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });
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

export default registerUser;
