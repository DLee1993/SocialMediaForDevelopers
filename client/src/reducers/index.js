import { combineReducers } from "redux";
import alertReducer from './Alert'; 
import authReducer from './Auth'; 

export default combineReducers({
    alertReducer,
    authReducer
})
