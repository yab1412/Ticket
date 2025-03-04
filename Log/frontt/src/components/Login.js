import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Create a wrapper component to use hooks with class components
function LoginWithNavigate(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    successMessage: ''
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    console.log('Login attempt with:', { email, password });

    try {
      const response = await fetch('http://localhost:2000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        this.setState({ successMessage: 'Login successful!' });
        
        // Use navigate instead of history.push
        if (data.role === 'admin') {
          this.props.navigate('/admin-dashboard');
        } else {
          this.props.navigate('/user-dashboard');
        }
      } else {
        this.setState({ error: data.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      this.setState({ error: 'Login failed. Please try again.' });
    }
  };

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form className='form' onSubmit={this.handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={this.handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={this.handleChange} 
            required 
          />
          <button type="submit">Login</button>
        </form>
        {this.state.error && <p className="error">{this.state.error}</p>}
        {this.state.successMessage && <p className="success">{this.state.successMessage}</p>}
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    );
  }
}

// Export the wrapped component
export default LoginWithNavigate; 