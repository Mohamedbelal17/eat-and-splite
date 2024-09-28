import { Children, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  // ----
  const [Add, SetAddFriend] = useState(initialFriends);
  const [close, SetClose] = useState(false);
  function handleclose() {
    SetClose(!close);
  }

  const [Selectedfriend, SetSelectedfriend] = useState(null);

  function handleSleceted(friend) {
    SetSelectedfriend((cur) => (cur?.id == friend.id ? null : friend));

    // (cur) => (cur.id === Selectedfriend.id ? null : friend)
  }

  function handleAdd(friend) {
    SetAddFriend((Add) => [...Add, friend]);
    SetClose(!close);
  }

  // update function
  function hadnleSplitBill(value) {
    SetAddFriend((friends) =>
      friends.map((friend) =>
        friend.id === Selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    SetSelectedfriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friendlist
          Add={Add}
          handleSleceted={handleSleceted}
          Selectedfriend={Selectedfriend}
        />
        {close ? (
          <>
            <FormAdd close={close} handleAdd={handleAdd} SetClose={SetClose} />
            <Button onClick={handleclose}>close</Button>{" "}
          </>
        ) : (
          <Button onClick={handleclose}>Add Friend</Button>
        )}
      </div>
      {Selectedfriend && (
        <FormSplit
          Selectedfriend={Selectedfriend}
          hadnleSplitBill={hadnleSplitBill}
          key={Selectedfriend.id}
        />
      )}
    </div>
  );
}

function Friendlist({ Add, handleSleceted, Selectedfriend }) {
  const firneds = Add;

  return (
    <ul>
      {firneds.map((el) => (
        <Friend
          friend={el}
          key={el.id}
          handleSleceted={handleSleceted}
          Selectedfriend={Selectedfriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSleceted, Selectedfriend }) {
  const isSelected = friend.id == Selectedfriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {-1 * friend.balance}$
        </p>
      ) : friend.balance == 0 ? (
        <p>You and {friend.name} are even</p>
      ) : (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}

      {isSelected ? (
        <Button onClick={() => handleSleceted(friend)}>close</Button>
      ) : (
        <Button onClick={() => handleSleceted(friend)}>Select</Button>
      )}
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAdd({ handleAdd }) {
  const [name, SetName] = useState("");
  const [img, SetImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !img) return;
    const id = crypto.randomUUID();
    const newfriends = {
      name,
      image: `${img}?=${crypto.randomUUID()}`,
      balance: 0,
      id,
    };
    handleAdd(newfriends);
    SetName("");
    SetImg("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => SetName(e.target.value)}
      ></input>
      <label>🖼 Image URL</label>
      <input
        type="text"
        value={img}
        onChange={(e) => SetImg(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplit({ Selectedfriend, hadnleSplitBill }) {
  const [bill, SetBill] = useState("");
  function handleBill(e) {
    SetBill(e);
  }

  const [your, Setyour] = useState("");
  function handleYour(e) {
    Setyour(e);
  }

  const [who, SetWho] = useState("you");
  function handleWho(e) {
    SetWho(e);
  }
  const paidbill = bill ? bill - your : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!your || !bill) return;
    hadnleSplitBill(who == "you" ? paidbill : -your);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {Selectedfriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => handleBill(Number(e.target.value))}
      />
      <label>🚶‍♂️ Your expense</label>
      <input
        type="text"
        value={your}
        onChange={(e) =>
          handleYour(
            Number(e.target.value) > bill ? your : Number(e.target.value)
          )
        }
      />
      <label>👭 {Selectedfriend.name}'s expense</label>
      <input type="text" disabled value={paidbill} />
      <label>🤑 who will paying the pill?</label>
      <select onChange={(e) => handleWho(e.target.value)} value={who}>
        <option value="you">you</option>
        <option value={Selectedfriend.name}>{Selectedfriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
export default App;
