import axios from 'axios';
import { useEffect, useState } from 'react';
import SearchComponent from './Search';
import "../Styles/Dashboard.css"
import Pagination from './Pagination';

const DashBoard = () => {
  const [usersData, setUsersData] = useState([]);
  const [editing, setEditing] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearchOn, setIsSearchOn] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [Selected, setSelected] = useState(false)
  // console.log(selectedUsers.length);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        const data = response.data;
        setUsersData(data);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  const handleEdit = (userId) => {
    setEditing((prevEditing) => ({ ...prevEditing, [userId]: true }));
    setEditedValues((prevEditedValues) => ({
      ...prevEditedValues,
      [userId]: {
        name: usersData.find((user) => user.id === userId).name,
        email: usersData.find((user) => user.id === userId).email,
        role: usersData.find((user) => user.id === userId).role,
      },
    }));
  };

  const handleInputChange = (userId, field, value) => {
    setEditedValues((prevEditedValues) => ({
      ...prevEditedValues,
      [userId]: { ...prevEditedValues[userId], [field]: value },
    }));
  };

  const deleteUser = (userId) => {
    setUsersData((prevUsersData) => prevUsersData.filter((user) => user.id !== userId));
    setFilteredUsers((prevFilteredUsers) => prevFilteredUsers.filter((user) => user.id !== userId));

    console.log(`User with userId ${userId} has been deleted`);
  };

  const saveChanges = (userId) => {
    console.log(editedValues);
    setEditing(false);
  };

  const handleCheckedUsers = (e, userId) => {
    e.stopPropagation();

    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        setSelected(false);
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        setSelected(true);
        return [...prevSelectedUsers, userId];
      }
    });
  };

 
  const deleteSelectedUsers = () => {
    setUsersData((prevUsersData) => prevUsersData.filter((user) => !selectedUsers.includes(user.id)));
    setFilteredUsers((prevFilteredUsers) => prevFilteredUsers.filter((user) => !selectedUsers.includes(user.id)));
    setFilteredUsers([]);
    setSelectedUsers([]); 
    setCurrentPage(1); 
    document.getElementById('selectAllCheckbox').checked = false;

  };
  

  const handleAllUsers = () => {
    
    if (selectedUsers.length === usersData.slice((currentPage - 1) * 10, currentPage * 10).length) {
      setSelectedUsers([]);
    } else {
      
      setSelectedUsers(usersData.slice((currentPage - 1) * 10, currentPage * 10).map((user) => user.id));
    }
  };
  

  const handleSearch = (filteredUsers) => {
    setFilteredUsers(filteredUsers)
    setIsSearchOn(true)
    setCurrentPage(1);
    console.log('Filtered Users:', filteredUsers);
  };

  return (
    <>
      <div className="searchBar">
        <div style={{ width: '75%' }}>
          <SearchComponent users={usersData} onSearch={handleSearch} />
        </div>

        <button className='deleteAllBtn' onClick={() => deleteSelectedUsers()}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 72 72" style={{ fill: '#FA5252' }}>
            <path d="M 32 13 C 30.895 13 30 13.895 30 15 L 30 16 L 17 16 C 14.791 16 13 17.791 13 20 C 13 21.973645 14.432361 23.602634 16.3125 23.929688 L 18.707031 52.664062 C 19.053031 56.811062 22.520641 60 26.681641 60 L 45.318359 60 C 49.479359 60 52.945969 56.811062 53.292969 52.664062 L 55.6875 23.929688 C 57.567639 23.602634 59 21.973645 59 20 C 59 17.791 57.209 16 55 16 L 42 16 L 42 15 C 42 13.895 41.105 13 40 13 L 32 13 z M 24.347656 24 L 47.652344 24 L 45.396484 51.082031 C 45.352484 51.600031 44.918438 52 44.398438 52 L 27.601562 52 C 27.081562 52 26.647469 51.600031 26.605469 51.082031 L 24.347656 24 z"></path>
          </svg>
        </button>
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th><input type="checkbox" onClick={() => handleAllUsers()} id='selectAllCheckbox'/></th>
            <th className='colTitle'>Name</th>
            <th className='colTitle'>Email</th>
            <th className='colTitle'>Role</th>
            <th className='colTitle'>Actions</th>
          </tr>
        </thead>

        <tbody>
          {isSearchOn ? filteredUsers.map((user) => (
            <tr style={{ backgroundColor: selectedUsers.includes(user.id) ? "#d3d3d3" : "" }} key={user.id}>
              <th>
                <input type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => e.stopPropagation()}
                  onClick={(e) => handleCheckedUsers(e, user.id)} />
              </th>
              <th>
                {editing[user.id] ? (
                  <input className='editInput'
                    type="text"
                    value={editedValues[user.id]?.name || user.name}
                    onChange={(e) => handleInputChange(user.id, 'name', e.target.value)}
                  />
                ) : (
                  <span> {user.name}</span>
                )}
              </th>
              <th>
                {editing[user.id] ? (
                  <input className='editInput'
                    type="text"
                    value={editedValues[user.id]?.email || user.email}
                    onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}
                  />
                ) : (
                  <span> {user.email}</span>
                )}
              </th>
              <th>
                {editing[user.id] ? (
                  <input className='editInput'
                    type="text"
                    value={editedValues[user.id]?.role || user.role}
                    onChange={(e) => handleInputChange(user.id, "role", e.target.value)}
                  />
                ) : (
                  <span> {user.role}</span>
                )}
              </th>
              <th>
                {editing[user.id] ? (
                  <button className='actionBtn save' onClick={() => saveChanges(user.id)} key={`edit-${user.id}`}>
                    Save
                  </button>
                ) : (
                  <button className='actionBtn save' onClick={() => handleEdit(user.id)} key={`edit-${user.id}`}>
                    ✎
                  </button>
                )}
                <button className='actionBtn' onClick={() => deleteUser(user.id)} key={`delete-${user.id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M14.984 2.486c-.551.009-.992.462-.984 1.014v0.5h-5.5c-.268-.004-.525.1-.716.288s-.298.444-.298.712h-1.486c-.361-.005-.696.184-.878.496s-.182.696 0 1.008c.182.311.517.501.878.496h18c.361.005.696-.184.878-.496s.182-.696 0-1.008c-.182-.311-.517-.501-.878-.496h-1.486c0-.268-.108-.524-.298-.712s-.448-.292-.716-.288h-5.5v-0.5c0-.270-.102-.531-.293-.722s-.452-.296-.723-.292zM6 9l1.793 15.234c.118 1.007.97 1.766 1.984 1.766h10.445c1.014 0 1.865-.759 1.984-1.766L24 9z" />
                  </svg>
                </button>
              </th>
            </tr>
          )) : usersData.slice((currentPage - 1) * 10, currentPage * 10).map((user) => (
            <tr style={{ backgroundColor: selectedUsers.includes(user.id) ? "#d3d3d3" : "" }} key={user.id}>
              <th>
                <input type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => e.stopPropagation()}
                  onClick={(e) => handleCheckedUsers(e, user.id)} />
              </th>
              <th>
                {editing[user.id] ? (
                  <input className='editInput'
                    type="text"
                    value={editedValues[user.id]?.name || user.name}
                    onChange={(e) => handleInputChange(user.id, 'name', e.target.value)}
                  />
                ) : (
                  <span> {user.name}</span>
                )}
              </th>
              <th>
                {editing[user.id] ? (
                  <input className='editInput'
                    type="text"
                    value={editedValues[user.id]?.email || user.email}
                    onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}
                  />
                ) : (
                  <span> {user.email}</span>
                )}
              </th>
              <th>
                {editing[user.id] ? (
                  <input className='editInput'
                    type="text"
                    value={editedValues[user.id]?.role || user.role}
                    onChange={(e) => handleInputChange(user.id, "role", e.target.value)}
                  />
                ) : (
                  <span> {user.role}</span>
                )}
              </th>
              <th>
                {editing[user.id] ? (
                  <button className='actionBtn save' onClick={() => saveChanges(user.id)} key={`edit-${user.id}`}>
                    Save
                  </button>
                ) : (
                  <button className='actionBtn save' onClick={() => handleEdit(user.id)} key={`edit-${user.id}`}>
                    ✎
                  </button>
                )}
                <button className='actionBtn' onClick={() => deleteUser(user.id)} key={`delete-${user.id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M14.984 2.486c-.551.009-.992.462-.984 1.014v0.5h-5.5c-.268-.004-.525.1-.716.288s-.298.444-.298.712h-1.486c-.361-.005-.696.184-.878.496s-.182.696 0 1.008c.182.311.517.501.878.496h18c.361.005.696-.184.878-.496s.182-.696 0-1.008c-.182-.311-.517-.501-.878-.496h-1.486c0-.268-.108-.524-.298-.712s-.448-.292-.716-.288h-5.5v-0.5c0-.270-.102-.531-.293-.722s-.452-.296-.723-.292zM6 9l1.793 15.234c.118 1.007.97 1.766 1.984 1.766h10.445c1.014 0 1.865-.759 1.984-1.766L24 9z" />
                  </svg>
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='footer'>
      <div className='selectedCount'><span>{`${selectedUsers.length} selected of ${usersData.length}`}</span></div>
      <Pagination users={isSearchOn ? filteredUsers : usersData} currentPg={currentPage} setCurrentPg={setCurrentPage}
      style={{ width: '75%' }}
       />
 

      </div>
        </>
  );
};

export default DashBoard;
