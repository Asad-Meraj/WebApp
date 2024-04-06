import React, { useState, useEffect } from 'react';
import { Container, VStack, H1, H2, P } from '@northlight/ui';
import { ExcelDropzone, ExcelRow } from '../components/Dropzone/Dropzone';
import UserList from '../components/UserList/UserList';
import Form from '../components/Form/Form';
import { scores } from '../data';
import usersData from '.././data/users';
import { User } from '../components/UserList/UserList';
import { updateUserScore } from '../utils/excelUtils';
import Modal from '../modal/Modal';
import './Home.css';

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);


  useEffect(() => {
    // initial best scores for user
    const initialUsers: User[] = usersData.map(user => {
      const userScores = scores.filter(score => String(score.userId) === String(user._id));
      const bestScore = userScores.length > 0 ? Math.max(...userScores.map(score => score.score)) : 0;
      return {
        ...user,
        bestScore,
        allScores: userScores.map(score => score.score),
      };
    });
    const sortedUsers = initialUsers.sort((a, b) => a.name.localeCompare(b.name));
    sortedUsers.sort((a, b) => b.bestScore - a.bestScore);
    setUsers(sortedUsers);
  }, []);

  function handleSheetData(sheetData: ExcelRow[]) {
    const invalidRows = sheetData.filter(row => !row.name || isNaN(row.score));
    invalidRows.forEach(row => {
      console.error('Invalid row format:', row);
    });
    const usersMap = sheetData.reduce((map, row) => {
      const { name, score } = row;
      const currentUser = map.get(name);
      const bestScore = currentUser ? Math.max(currentUser.bestScore, score) : score;
      const allScores = currentUser ? [...currentUser.allScores, score] : [score];
      map.set(name, { name, bestScore, allScores });
      return map;
    }, new Map<string, User>());

    const updatedUsers = Array.from(usersMap.values());
    updatedUsers.sort((a, b) => b.bestScore - a.bestScore);
    setUsers(updatedUsers);
  }


  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };


  const handleFormSubmit = (newName: string, newScore: number) => {
    const newNameTrimmed = newName.trim();
    const newScoreNumber = parseFloat(newScore.toString());

    (!newNameTrimmed || isNaN(newScoreNumber) || newScoreNumber < 0) && (
      alert('Please enter both a valid name and score.')),
      updateUserScore(newNameTrimmed, newScoreNumber, users, setUsers);

    setNewName('');
    setNewScore('');
  };



  return (
    <Container className="container">
      <H1 className="heading">Mediatool exercise</H1>
      <div className="dropzone">
        <ExcelDropzone onSheetDrop={handleSheetData} label="Import excel file here" />
      </div>
      <div className="user-list">
        <UserList users={users} onUserClick={handleUserClick} />
      </div>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} content={selectedUser ? `All scores for ${selectedUser.name}: ${selectedUser.allScores.join(', ')}` : ''} />
      <div className="form">
        <Form onFormSubmit={handleFormSubmit} />
      </div>
    </Container>

  );
}

export default Home;
