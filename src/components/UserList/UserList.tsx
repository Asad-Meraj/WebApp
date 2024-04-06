import React from 'react';
import './UserList.css'

export interface User {
  _id?: number;
  name: string;
  bestScore: number;
  allScores: number[];
}

interface UserListProps {
  users: User[];
  onUserClick: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserClick }) => {
  return (
    <div className="user-list-container">
      <h2 className="list-heading">User List</h2>
      <ul className="list">
        {users.map(user => (
          <li key={user._id} className="list-item" onClick={() => onUserClick(user)}>
            <span className="user-name">{user.name}</span> - Best Score: <span className="best-score">{user.bestScore}</span>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default UserList;
