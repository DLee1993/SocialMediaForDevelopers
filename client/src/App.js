import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserAlert from "./components/layout/userAlert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
// redux imports
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
                        <Route path='/profiles' element={<Profiles />}/>
                        <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} />
                        <Route
                            path='/create-profile'
                            element={<PrivateRoute component={CreateProfile} />}
                        />
                        <Route
                            path='/edit-profile'
                            element={<PrivateRoute component={EditProfile} />}
                        />
                        <Route
                            path='/add-experience'
                            element={<PrivateRoute component={AddExperience} />}
                        />
                        <Route
                            path='/add-education'
                            element={<PrivateRoute component={AddEducation} />}
                        />
                    </Routes>
                </Fragment>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
