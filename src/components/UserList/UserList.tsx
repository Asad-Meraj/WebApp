import React from 'react';

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
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} onClick={() => onUserClick(user)}>
            {user.name} - Best Score: {user.bestScore}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
