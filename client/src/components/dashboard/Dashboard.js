import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getUserProfile } from "../../actions/profile";
import DashboardActions from "../../components/dashboard/DashboardActions";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

const Dashboard = ({ getUserProfile, auth: { user }, profile: { profile, loading } }) => {
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
};

const mapStateToProps = (state) => ({ auth: state.authReducer, profile: state.profileReducer });

export default connect(mapStateToProps, { getUserProfile })(Dashboard);
