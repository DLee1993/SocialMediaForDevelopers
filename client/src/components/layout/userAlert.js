import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const userAlert = ({ alerts }) =>
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ));

userAlert.propTypes = {
    alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({ alerts: state.alertReducer });

export default connect(mapStateToProps)(userAlert);
