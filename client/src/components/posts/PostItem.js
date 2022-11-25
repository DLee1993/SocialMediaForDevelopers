import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";

const PostItem = ({ auth, post: { _id, text, name, user, likes, comments, date } }) => {
    return (
        <div className='post bg-white p-1 my-1'>
            <div>
                <a href='profile.html'>
                    <img
                        className='round-img'
                        src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
                        alt=''
                    />
                    <h4>{name}</h4>
                </a>
            </div>
            <div>
                <p className='my-1'>{text}</p>
                <p className='post-date'>
                    Posted on <Moment format='DD-MM-YYYY'>{date}</Moment>
                </p>
                <button type='button' className='btn btn-light'>
                    <i className='fas fa-thumbs-up'></i>
                    {likes.length > 0 && <span style={{ marginLeft: "15px" }}>{likes.length}</span>}
                </button>
                <button type='button' className='btn btn-light'>
                    <i className='fas fa-thumbs-down'></i>
                </button>
                <Link to={`/post/${_id}`} className='btn btn-primary'>
                    Comments{" "}
                    {comments.length > 0 && (
                        <span className='comment-count' style={{ marginLeft: "15px" }}>
                            {comments.length}
                        </span>
                    )}
                </Link>
                {!auth.loading && user === auth.user._id && (
                    <button type='button' className='btn btn-danger'>
                        <i className='fas fa-times'></i>
                    </button>
                )}
            </div>
        </div>
    );
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.authReducer });

export default connect(mapStateToProps, {})(PostItem);
