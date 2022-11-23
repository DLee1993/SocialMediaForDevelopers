import { GET_PROFILE, PROFILE_ERROR } from "./types";

import axios from "axios";
//* import setAlert from "./alert";

//* - Get current users profile

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
