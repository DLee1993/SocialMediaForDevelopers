import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserAlert from "./components/layout/userAlert";
// redux imports
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

const App = () => (
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

export default App;
