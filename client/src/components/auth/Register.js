import React, { useState } from "react";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
      e.preventDefault(); 
      if(password !== confirmPassword) return console.log('passwords do not match'); 
      console.log(formData)
    }

    return (
        <div className='container'>
            <h1 className='large text-primary'>Sign Up</h1>
            <p className='lead'>
                <i className='fas fa-user'></i> Create Your Account
            </p>
            <form className='form' onSubmit={onSubmit}>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='Name'
                        name='name'
                        value={name}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='email'
                        placeholder='Email Address'
                        name='email'
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                    />
                    <small className='form-text'>
                        This site uses Gravatar so if you want a profile image, use a Gravatar email
                    </small>
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        minLength='6'
                        value={password}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        name='confirmPassword'
                        minLength='6'
                        value={confirmPassword}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <input type='submit' className='btn btn-primary' value='Register' />
            </form>
            <p className='my-1'>
                Already have an account? <a href='login.html'>Sign In</a>
            </p>
        </div>
    );
};

export default Register;
