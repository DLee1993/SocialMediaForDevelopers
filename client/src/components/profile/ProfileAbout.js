import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
    profile: {
        bio,
        skills,
        user: { name },
    },
}) => {
    return (
        <div className='profile-about bg-light p-2'>
            {bio && (
                <Fragment>
                    <h2 className='text-primary'>{name.trim().split(' ')[0]}'s Bio</h2>
                    <p>{bio}</p>
                    <div className='line'></div>
                </Fragment>
            )}
            <h2 className='text-primary'>Skill Set</h2>
            <div className='skills'>
                {skills
                    ? Object.entries(skills)
                          .filter(([_, value]) => value)
                          .map(([key, value]) => (
                              <div className='p-1' key={key}>
                                  <i className='fa fa-check'></i> {value}
                              </div>
                          ))
                    : null}
            </div>
        </div>
    );
};

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
