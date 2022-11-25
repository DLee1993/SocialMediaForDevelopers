import { combineReducers } from "redux";
import alertReducer from './Alert'; 
import authReducer from './Auth'; 
import profileReducer from './Profile'; 
import postReducer from './Post'; 

export default combineReducers({
    alertReducer,
    authReducer,
    profileReducer,
    postReducer
})
