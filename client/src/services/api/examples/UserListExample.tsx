import React, { useState } from 'react';
import { useUsers, useCreateUser, useDeleteUser, useApiError } from '../hooks';
import { User } from '../userService';

const UserListExample: React.FC = () => {
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'student' as User['role'],
  });

  // Query hooks
  const { data: usersResponse, isLoading, error } = useUsers({ role: 'student' });
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  // Error handling
  const apiError = useApiError(error);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUser.mutateAsync(newUser);
      setNewUser({ firstName: '', lastName: '', email: '', role: 'student' });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (apiError) {
    return <div>Error: {apiError.message}</div>;
  }

  const users = usersResponse?.data || [];

  return (
    <div className="user-list-example">
      <h2>User Management Example</h2>
      
      {/* Create User Form */}
      <div className="create-user-form">
        <h3>Create New User</h3>
        <form onSubmit={handleCreateUser}>
          <div>
            <label>
              First Name:
              <input
                type="text"
                value={newUser.firstName}
                onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Last Name:
              <input
                type="text"
                value={newUser.lastName}
                onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Role:
              <select
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as User['role'] }))}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <button 
            type="submit" 
            disabled={createUser.isPending}
          >
            {createUser.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="user-list">
        <h3>Users ({users.length})</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="users-grid">
            {users.map((user: User) => (
              <div key={user.id} className="user-card">
                <h4>{`${user.firstName} ${user.lastName}`}</h4>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={deleteUser.isPending}
                  className="delete-btn"
                >
                  {deleteUser.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

            {/* Note: Add CSS styles to your global stylesheet or use a CSS-in-JS solution */}
    </div>
  );
};

export default UserListExample; 