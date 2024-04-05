import { ExcelRow } from '../components/Dropzone/Dropzone';
import { User } from '../components/UserList/UserList';
import users from '../data/users';


// Function to validate Excel rows
export function validateExcelRows(rows: ExcelRow[]): ExcelRow[] {
  return rows.filter(row => row.name && !isNaN(row.score));
}

// Function to process Excel data and return user objects
export function processExcelData(rows: ExcelRow[]): User[] {
  const usersMap = new Map<string, User>();

  rows.forEach(row => {
    const { name, score } = row;
    if (usersMap.has(name)) {
      const currentUser = usersMap.get(name)!;
      if (score > currentUser.bestScore) {
        currentUser.bestScore = score;
      }
      currentUser.allScores.push(score);
    } else {
      usersMap.set(name, { name, bestScore: score, allScores: [score] });
    }
  });

  return Array.from(usersMap.values());
}

// Function to update user score
export function updateUserScore(newName: string, newScore: number, users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) {
  setUsers(prevUsers => {
    const existingUserIndex = prevUsers.findIndex((user: User) => user.name === newName);
    if (existingUserIndex !== -1) {
      const updatedUsers = [...prevUsers];
      const existingUser = updatedUsers[existingUserIndex];
      existingUser.allScores.push(newScore);
      existingUser.bestScore = Math.max(...existingUser.allScores);
      updatedUsers[existingUserIndex] = existingUser;
      // Remove the existing user from the array and add them again at the correct position
      updatedUsers.splice(existingUserIndex, 1);
      updatedUsers.unshift(existingUser);
      return updatedUsers;
    } else {
      const newUser: User = {
        name: newName,
        bestScore: newScore,
        allScores: [newScore],
      };
      const updatedUsers = [...prevUsers, newUser];
      updatedUsers.sort((a: User, b: User) => b.bestScore - a.bestScore);
      return updatedUsers;
    }
  });
}

