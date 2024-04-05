import React, { useState, FormEvent } from 'react';

interface FormProps {
  onFormSubmit: (newName: string, newScore: number) => void;
}

const Form: React.FC<FormProps> = ({ onFormSubmit }) => {
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newNameTrimmed = newName.trim();
    const newScoreNumber = parseFloat(newScore.trim());

    if (!newNameTrimmed || isNaN(newScoreNumber) || newScoreNumber < 0) {
      alert('Please enter both a valid name and score.');
      return;
    }
    
    onFormSubmit(newNameTrimmed, newScoreNumber);
    setNewName('');
    setNewScore('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Score"
        value={newScore}
        onChange={(e) => setNewScore(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
