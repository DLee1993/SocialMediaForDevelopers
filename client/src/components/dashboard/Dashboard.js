import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getUserProfile, deleteAccount } from "../../actions/profile";
import DashboardActions from "../../components/dashboard/DashboardActions";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({ getUserProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) => {
    useEffect(() => {
        getUserProfile();
    }, [getUserProfile]);

    return loading && profile === null ? (
        <Spinner />
    ) : (
        <div className='container'>
            <Fragment>
                <h1 className='large text-primary'>Dashboard</h1>
                <p className='lead'>
                    <i className='fas fa-user'></i> Welcome {user && user.name}
                </p>
                {profile !== null ? (
                    <Fragment>
                        <DashboardActions />
                        <Experience experience={profile.experience} />
                        <Education education={profile.education} />
                        <div className='my-2'>
                            <button className='btn btn-danger' onClick={() => deleteAccount()}>
                                <i className='fas fa-user-minus'></i> Delete Account
                            </button>
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Link to='/create-profile' className='btn btn-primary my-1'>
                            Create Profile
                        </Link>
                    </Fragment>
                )}
            </Fragment>
        </div>
    );
};

Dashboard.propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object,
    deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({ auth: state.authReducer, profile: state.profileReducer });

export default connect(mapStateToProps, { getUserProfile, deleteAccount })(Dashboard);
