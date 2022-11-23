import { combineReducers } from "redux";
import alertReducer from './Alert'; 
import authReducer from './Auth'; 
import profileReducer from './Profile'; 

export default combineReducers({
    alertReducer,
    authReducer,
    profileReducer
})
