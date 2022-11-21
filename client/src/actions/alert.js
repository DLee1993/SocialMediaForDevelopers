import { REMOVE_ALERT, SET_ALERT } from "./types";
import { v4 as generateID } from "uuid";

const setAlert = (msg, alertType) => (dispatch) => {
    const id = generateID();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id },
    });
    setTimeout(() => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id,
        });
    }, 3000);
};

export default setAlert;
