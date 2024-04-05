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


const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Assuming you have a User interface and users state
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  

  useEffect(() => {
    // Calculate initial best scores for each user
    const initialUsers: User[] = usersData.map(user => {
      const userScores = scores.filter(score => String(score.userId) === String(user._id));
      const bestScore = userScores.length > 0 ? Math.max(...userScores.map(score => score.score)) : 0;
      return {
        ...user,
        bestScore,
        allScores: userScores.map(score => score.score),
      };
    });

    // Sort users alphabetically by name
    const sortedUsers = initialUsers.sort((a, b) => a.name.localeCompare(b.name));

    // Sort users array in descending order based on bestScore
    sortedUsers.sort((a, b) => b.bestScore - a.bestScore);

    setUsers(sortedUsers);
  }, []);

  function handleSheetData(sheetData: ExcelRow[]) {
    // If there are any invalid rows, handle them accordingly
    const invalidRows = sheetData.filter(row => !row.name || isNaN(row.score));
    invalidRows.forEach(row => {
      console.error('Invalid row format:', row);
      // Optionally, you can handle invalid rows here, like skipping them or showing an error message
    });
  
    // Process only valid rows further
    const usersMap = new Map<string, User>(); // Map to store user objects
  
    // Iterate through valid rows to update user scores
    sheetData.forEach(row => {
      const { name, score } = row;
      if (usersMap.has(name)) {
        // If user already exists, update the best score if the new score is higher
        const currentUser = usersMap.get(name)!;
        if (score > currentUser.bestScore) {
          currentUser.bestScore = score;
        }
        currentUser.allScores.push(score); // Update allScores array
      } else {
        // If user does not exist, add them to the map
        usersMap.set(name, { name, bestScore: score, allScores: [score] });
      }
    });
  
    // Convert the map values to an array of User objects
    const updatedUsers = Array.from(usersMap.values());
  
    // Sort users by best score in descending order
    updatedUsers.sort((a, b) => b.bestScore - a.bestScore);
  
    // Update state with the new user data
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
    const newScoreNumber = parseFloat(newScore.toString()); // No need to trim a number
  
    if (!newNameTrimmed || isNaN(newScoreNumber) || newScoreNumber < 0) {
      alert('Please enter both a valid name and score.');
      return;
    }
  
    // Call the updateUserScore function with the trimmed name and parsed score
    updateUserScore(newNameTrimmed, newScoreNumber, users, setUsers);
    // Clear the form fields
    setNewName('');
    setNewScore('');
  };
  


  return (
    <Container maxW="6xl" padding="4">
      <H1 marginBottom="4">Mediatool exercise</H1>
      <ExcelDropzone onSheetDrop={handleSheetData} label="Import excel file here" />
      <VStack marginTop="4" align="left">
        <H2>Ranking</H2>
        <UserList users={users} onUserClick={handleUserClick} />
      </VStack>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} content={selectedUser ? `All scores for ${selectedUser.name}: ${selectedUser.allScores.join(', ')}` : ''} />
      <Form onFormSubmit={handleFormSubmit} />
    </Container>
  );
}

export default Home;
