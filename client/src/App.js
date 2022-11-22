import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserAlert from "./components/layout/userAlert";
// redux imports
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { loadUser } from "./actions/auth";
import "./App.css";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Fragment>
                    <Navbar />
                    <UserAlert />
                    <Routes>
                        <Route exact path='/' element={<Landing />} />
                        <Route exact path='/register' element={<Register />} />
                        <Route exact path='/login' element={<Login />} />
                    </Routes>
                </Fragment>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
