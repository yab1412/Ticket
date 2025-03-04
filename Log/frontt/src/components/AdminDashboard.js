import React, { Component } from 'react';

class AdminDashboard extends Component {
  state = {
    tickets: [],
    error: null
  };

  componentDidMount() {
    this.fetchAllTickets();
  }

  fetchAllTickets = async () => {
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

  handleStatusChange = async (ticketId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:2000/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      // Refresh tickets after status update
      await this.fetchAllTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      this.setState({ error: 'Failed to update ticket status' });
    }
  };

  render() {
    const { tickets, error } = this.state;
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <h3>All Tickets</h3>
        {error && <p className="error">{error}</p>}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>User</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.status}</td>
                <td>{ticket.userId?.email || 'Unknown'}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={ticket.status}
                    onChange={(e) => this.handleStatusChange(ticket._id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AdminDashboard; 