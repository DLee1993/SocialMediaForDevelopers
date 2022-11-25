import React from "react";
import PropTypes from "prop-types";

// - This stops the localhost:3000/ from being in the URL for the social links (youtube etc)
const urlToRender = (link) => {
    if (!link.match(/^[a-zA-Z]+:\/\//)) {
        // - remember to append the start of the url then the link
        return "https://" + link;
    }
    return link;
};

const ProfileTop = ({
    profile: {
        status,
        company,
        location,
        website,
        social,
        user: { name, avatar },
    },
}) => {
    return (
        <div className='profile-top bg-primary p-2'>
            <img className='round-img my-1' src={avatar} alt='' />
            <h1 className='large'>{name}</h1>
            <p className='lead'>
                {status} {company && <span>at {company}</span>}
            </p>
            <p>{location && <span>{location}</span>}</p>
            <div className='icons my-1'>
                {website && (
                    <a href={urlToRender(website)} target='_blank' rel='noopener noreferrer'>
                        <i className='fas fa-globe fa-2x'></i>
                    </a>
                )}
                {social
                    ? Object.entries(social)
                          .filter(([_, value]) => value)
                          .map(([key, value]) => (
                              <a
                                  key={key}
                                  href={urlToRender(value)}
                                  target='_blank'
                                  rel='noopener noreferrer'
                              >
                                  <i className={`fab fa-${key} fa-2x`}></i>
                              </a>
                          ))
                    : null}
            </div>
        </div>
    );
};

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileTop;
