let users = [];

const addUser = (data) => {
  const { username, email } = data;
  if (!username || !email) return;
  if (users.find((user) => user.email === email)) return;
  const temp = [data, ...users];
  users = [...temp];
  return users;
};

const deleteUser = (id) => {
  const temp = users.filter((user) => user.id !== id);
  users = [...temp];
  return users;
};

module.exports = {
  addUser,
  deleteUser
};
