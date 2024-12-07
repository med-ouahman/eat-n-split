import { useState } from "react";
import "./App.css";

const friendsData = [
  {
    name: "Aziz",
    img: "images/ali-morshedlou-WMD64tMfc4k-unsplash.jpg",
    balance: 0,
  },
  {
    name: "Brahim",
    img: "images/front-end developer cool image.jpg",
    balance: 0
  },
  {
    name: "Mohamed",
    img: "/images/harps-joseph-tAvpDE7fXgY-unsplash.jpg",
    balance: 0
  }
];

function App() {
  const [selected, setSelected] = useState(null);
  const [friends, setFriends] = useState(friendsData);
  const [addNew, setAddNew] = useState(false);

  const onClose = ({name}) => {
    
    if (name === selected.name)
      setSelected(null);
  }

  return (
    <div className="App">
      <div className="friends-container">
        {friends.map(friend => (
          <Friend {...friend} onSelect={setSelected} key={Math.random()} selected={selected} onClose={onClose} />
        ))}

        {!addNew && <button id="add-friend-btn" onClick={() => setAddNew(true)}>
          Add friend
        </button>}
        {
          addNew && <AddFriend friends={friends} onSetFriends={setFriends} /> 
        }
        {
          addNew && <button id="close" onClick={() => setAddNew(false)}>Close</button>
        }
      </div>

      { selected !== null &&
      <SplitBill {...selected} onSetFriends={setFriends} friends={friends} onSelect={setSelected} />
      }
    </div>
  );
}

function Friend({ name, img, balance, onSelect, selected, onClose}) {

  const isSelected = selected?.name === name;
  return (
    <div className={`friend ${isSelected ? "selected": ""}`}>
      <div className="img-container">
        <img src={img} alt={name}/>
      </div>
      <div className="friend-info">
        <h3 className="name">{name}</h3>
        {
          balance >= 0 ? <p className="green">{name} owes you ${balance}.</p>
          : <p className="red">You owe {name} ${-balance}.</p>
        }
      </div>
      {!isSelected && <button 
      className="select-friend"
      onClick={() => onSelect({name, balance})}
      >
        Select
      </button>}
      {
        isSelected && <button 
        className="select-friend"
        onClick={() => onClose({name})}
        >
          Close
        </button>
      }
    </div>
  );
}

function SplitBill({ name, onSetFriends, friends, onSelect}) {
  const [bill, setBill] = useState(0);
  const [friendeExpenses, setFriendExpenses] = useState(0);
  const [whoPays, setWhoPays] = useState("You");

let owes = 0;
  const onSplitBill = () => {
    let expenses = bill - friendeExpenses;
    if (expenses > bill || friendeExpenses > bill || expenses + friendeExpenses > bill)
      return ;
    if (whoPays === "You")
      owes = friendeExpenses;
    else
      owes = -expenses;
    const updated = friends.map(friend => friend.name === name ? {...friend, balance: friend.balance + owes}: friend);
    onSetFriends(updated);
    onSelect(null);
}

  return (
    <div className="split-bill">
      <h2>Split a bill with {name}</h2>
      <div className="inputs">
      <div className="bill-value">
        <p>Bill value</p>
        <input type="text" value={bill} onChange={(e) => setBill(+e.target.value)}/>
      </div> 
      <div className="expenses">
        <p>Your expenses</p>
        <input type="number" value={bill - friendeExpenses} min={0} onChange={() => null}/>
      </div> 
      <div className="expenses">
        <p>{name}'s expenses</p>
        <input type="number" max={bill} min={0} value={friendeExpenses}
          onChange={(e) => setFriendExpenses(+e.target.value)}/>
      </div> 
      <div className="expenses">
        <p>Who is paying the bill</p>
        <select value={whoPays} onChange={() => setWhoPays(whoPays === name ? "You" : name)}>
          <option value="you">You</option>
          <option value={name}>{name}</option>
        </select>
      </div>
      </div>
      <button
        onClick={onSplitBill}
      >Split bill</button>
    </div>
  );
}

function AddFriend({friends, onSetFriends}) {
  const [name, setName] = useState("");
  const [img, setImage] = useState("");

  const addFriend = () => {
    const defaultImg = "stock-vector-profile-picture-avatar-icon-vector-1760295569.jpg";

    if (!name.trim())
      return ;
    const newFriend = {
      name: name,
      img: img || defaultImg,
      balance: 0,
    }
    onSetFriends([...friends, newFriend]);
    setImage("");
    setName("");
  }

  return (
    <div className="add-friend">
      <div className="friend-name">
        <label>Friend name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="friend-img">
        <label>
          Image URL
        </label>
        <input type="url" value={img} onChange={(e) => setImage(e.target.value)}/>
      </div>
      <button onClick={addFriend}>
        Add
      </button>
    </div>
  );
}

export default App;