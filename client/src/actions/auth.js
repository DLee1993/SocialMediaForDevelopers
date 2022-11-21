import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";
import axios from "axios";
import setAlert from "./alert";

//info - register a user

export const registerUser =
    (formData) =>
    async (dispatch) => {
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
