import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getUserProfile } from "../../actions/profile";
import PropTypes from "prop-types";

const Dashboard = ({ getUserProfile}) => {
    useEffect(() => {
        getUserProfile();
    },[getUserProfile]);

    return <div>dashboard</div>;
};

Dashboard.propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object,
};

const mapStateToProps = (state) => ({ auth: state.authReducer, profile: state.profile });

export default connect(mapStateToProps, { getUserProfile })(Dashboard);
