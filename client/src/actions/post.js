import axios from "axios";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

export const getPosts = () => async (dispatch) => {
    try {
        const res = await axios.get("/posts");
        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

export const addLike = (id) => async (dispatch) => {
    const res = await axios.put(`posts/like/${id}`);
    try {
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

export const removeLike = (id) => async (dispatch) => {
    const res = await axios.put(`posts/unlike/${id}`);
    try {
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};
