import React from 'react';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
  return alerts
    ? alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))
    : null;
};

const mapStateToProps = ({ alert }) => ({
  alerts: alert,
});

export default connect(mapStateToProps)(Alert);
