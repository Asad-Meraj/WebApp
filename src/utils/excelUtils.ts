import { ExcelRow } from '../components/Dropzone/Dropzone';
import { User } from '../components/UserList/UserList';
import users from '../data/users';


// Validate Excel rows
export function validateExcelRows(rows: ExcelRow[]): ExcelRow[] {
  return rows.filter(row => row.name && !isNaN(row.score));
}

// Process Excel data and return user objects
export function processExcelData(rows: ExcelRow[]): User[] {
  const usersMap = rows.reduce((map, row) => {
    const { name, score } = row;
    const user = map.get(name) || { name, bestScore: -Infinity, allScores: [] };
    user.bestScore = Math.max(user.bestScore, score);
    user.allScores.push(score);
    map.set(name, user);
    return map;
  }, new Map<string, User>());

  return Array.from(usersMap.values());
}


// Update user score
export function updateUserScore(newName: string, newScore: number, users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) {
  setUsers(prevUsers => {
    const existingUserIndex = prevUsers.findIndex((user: User) => user.name === newName);
    const updatedUsers = [...prevUsers];
    const existingUser = existingUserIndex !== -1 ? updatedUsers.splice(existingUserIndex, 1)[0] : null;

    const newUser: User = {
      name: newName,
      bestScore: existingUser ? Math.max(...existingUser.allScores, newScore) : newScore,
      allScores: existingUser ? [...existingUser.allScores, newScore] : [newScore],
    };

    updatedUsers.unshift(newUser);
    updatedUsers.sort((a: User, b: User) => b.bestScore - a.bestScore);
    return updatedUsers;
  });
}
