import React, { Component } from 'react';

class UserDashboard extends Component {
  state = {
    tickets: [],
    title: '',
    description: '',
    status: 'Open',
    error: null
  };

  componentDidMount() {
    this.fetchUserTickets();
  }

  fetchUserTickets = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:2000/api/tickets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      this.setState({ tickets: data });
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      this.setState({ error: 'Failed to fetch tickets' });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, status } = this.state;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:2000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      await this.fetchUserTickets();
      this.setState({ title: '', description: '', status: 'Open' });
    } catch (error) {
      console.error('Error creating ticket:', error);
      this.setState({ error: 'Failed to create ticket' });
    }
  };

  render() {
    const { tickets, error } = this.state;
    return (
      <div>
        <h2>User Dashboard</h2>
        <h3>Your Tickets</h3>
        {error && <p className="error">{error}</p>}
        <ul>
          {tickets.map(ticket => (
            <li key={ticket._id}>
              <strong>{ticket.title}</strong> - Status: {ticket.status}
              <p>{ticket.description}</p>
              <small>Created: {new Date(ticket.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
        <h3>Create Ticket</h3>
        <form className='form' onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={this.state.title}
            onChange={this.handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={this.state.description}
            onChange={this.handleChange}
            required
          />
          <select
            name="status"
            value={this.state.status}
            onChange={this.handleChange}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="submit">Create Ticket</button>
        </form>
      </div>
    );
  }
}

export default UserDashboard; 