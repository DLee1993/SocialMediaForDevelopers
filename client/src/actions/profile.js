import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE } from "./types";

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

// - Add Experience
export const addExperience = (formData, navigate) => async (dispatch) => {
    try {
        const res = await axios.put("/profile/experience", formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Experience Added", "success"));
        navigate("/dashboard");
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

// - Add Education
export const addEducation = (formData, navigate) => async (dispatch) => {
    try {
        const res = await axios.put("/profile/education", formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Education Added", "success"));
        navigate("/dashboard");
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

// - Delete an experience
export const deleteExperience = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Experience Deleted", "danger"));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

// - Delete an education
export const deleteEducation = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert("Education Deleted", "danger"));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

// - Delete Account and Profile
export const deleteAccount = () => async (dispatch) => {
    if (window.confirm("Are you sure? This can not be undone")) {
        try {
            await axios.delete('/profile');
            dispatch({
                type: CLEAR_PROFILE,
            });
            dispatch({
                type: ACCOUNT_DELETED,
            });
            dispatch(setAlert("Your Account has been deleted", "danger"));
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status },
            });
        }
    }
};
