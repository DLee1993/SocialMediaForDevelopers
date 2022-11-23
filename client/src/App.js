import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserAlert from "./components/layout/userAlert";
import Dashboard from "./components/dashboard/Dashboard";
//* redux imports
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { loadUser } from "./actions/auth";
import "./App.css";
import PrivateRoute from "./components/routing/PrivateRoute";

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
                        <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} />
                    </Routes>
                </Fragment>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
