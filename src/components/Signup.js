import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Signup extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    role: 'user', 
    error: '',
    successMessage: ''
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, role } = this.state;

    try {
      const response = await fetch('https://ticket-back-7juy.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
        this.setState({ successMessage: 'Signup successful! Go back to login page' }); 
      } else {
        const errorMessage = await response.text(); 
        this.setState({ error: errorMessage });
      }
    } catch (error) {
      this.setState({ error: 'Signup failed. Please try again.' });
    }
  };

  render() {
    return (
      <div className='container'>
        <h2>Signup</h2>
        <form className='form' onSubmit={this.handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={this.handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={this.handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
          <select name="role" onChange={this.handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className='button' type="submit">Signup</button>
        </form>
        {this.state.error && <p>{this.state.error}</p>}
        {this.state.successMessage && <p>{this.state.successMessage}</p>} {/* Display success message */}
        Already have an account? <Link to="/">Login</Link>
      </div>
    );
  }
}

export default Signup; 