import { useState } from "react"
import "../Styles/Seach.css"

const SearchComponent =({users, onSearch})=> {
  const [searchText, setSearchText] = useState("")
  console.log(searchText);


  const handleSearch = () => {
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
    );
    onSearch(filteredUsers);
    console.log(filteredUsers);
  };
  
  const searchByEnter =(event)=>{
    if(event.key==="Enter"){
      event.preventDefault();
      handleSearch()
    }
  }
  


  return (
    <div>
      <input className="searchbar"
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={searchByEnter}
      />
      <button className="searchBtn" onClick={handleSearch} >Search</button>
      
    </div>
  );


}

export default SearchComponent