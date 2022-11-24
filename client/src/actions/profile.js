import { GET_PROFILE, PROFILE_ERROR } from "./types";

import axios from "axios";
import setAlert from "./alert";

// - Get current users profile

export const getUserProfile = () => async (dispatch) => {
    try {
        const res = await axios.get("/profile/me");
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

// - Create or update a profile
export const createProfile =
    (formData, navigate, edit = false) =>
    async (dispatch) => {
        try {
            const res = await axios.post("/profile", formData);
            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });
            dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
            if (!edit) {
                navigate("/dashboard");
            }
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status },
            });
        }
    };
