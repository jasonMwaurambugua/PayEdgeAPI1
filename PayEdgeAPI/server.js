
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3007; // Use the port from .env or default to 3007

// Mock database for demonstration (replace with a real database)
const users = [
  { 
    id: 1,
    username: 'jason',
    email: 'jason@example.com',
    password: '1234',
    phoneNumber1: '1234567890',
    phoneNumber2: '0987654321',
    balance: 1000,
    commuterWallet: 1000,
    shoppingWallet: 500
   },

  { 
    id: 2,
    username: 'cecilia',
    email: 'cecilia@example.com',
    password: '1234',
    phoneNumber1: '1234567890',
    phoneNumber2: '0987654321',
    balance: 1500,
    commuterWallet: 2000,
    shoppingWallet: 1000
 },

  { 
    id: 3,
    username: 'john', 
    email: 'john@example.com',
    password: '1234', 
    phoneNumber1: '1234567890',
    phoneNumber2: '0987654321',
    balance: 800, 
    commuterWallet: 1500, 
    shoppingWallet: 200 
},

  { 
    id: 4,
     username: 'jane',
     email: 'jane@example.com',
     password: '1234',
     phoneNumber1: '1234567890',
     phoneNumber2: '0987654321', 
     balance: 11800,
     commuterWallet: 4500,
     shoppingWallet: 200
     },
];

const notifications = [

  { id: 1,
     userId: 1,
      time: '09:00',
       message: 'Payment received from',
        sender: 'Alice', 
        recipient: 'Jason Mbugua',
         date: '2024-06-25',
          transactionReference: 'TXN001',
           cost: '$100', 
           balance: '$900'
         },

  {
     id: 2,
     userId: 2,
      time: '10:00',
       message: 'Payment sent to',
        sender: 'Cecilia Ndung\'u', 
        recipient: 'Bob', 
        date: '2024-06-26',
         transactionReference: 'TXN002', 
         cost: '$200',
          balance: '$1300' 
        },

  { id: 1,
     userId: 1,
      time: '09:00',
       message: 'Payment received from',
        sender: 'Alice', 
        recipient: 'Jason Mbugua',
         date: '2024-06-25',
          transactionReference: 'TXN001',
           cost: '$100',
            balance: '$900'
         },

  { id: 2,
     userId: 2,
      time: '10:00',
       message: 'Payment sent to',
        sender: 'Cecilia Ndung\'u', recipient: 'Bob',
         date: '2024-06-26', 
         transactionReference: 'TXN002',
          cost: '$200',
           balance: '$1300'
         },
];

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Endpoint to get user information
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Endpoint to login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.json(user);
  } else {
    res.status(400).json({ error: 'Invalid email or password' });
  }
});

// Endpoint to signup
app.post('/api/signup', (req, res) => {
  const { username, email, phoneNumber1, phoneNumber2, password } = req.body;
  const userExists = users.some((u) => u.email === email);

  if (userExists) {
    res.status(400).json({ error: 'User already exists' });
  } else {
    const newUser = {
      id: users.length + 1,
      username,
      email,
      phoneNumber1,
      phoneNumber2,
      password,
      balance: 0,
      commuterWallet: 0,
      shoppingWallet: 0,
    };
    users.push(newUser);
    res.json(newUser);
  }
});

// Endpoint to initiate a transaction between users
app.post('/api/transactions', (req, res) => {
  const { senderId, recipientId, amount } = req.body;

  const sender = users.find((u) => u.id === senderId);
  const recipient = users.find((u) => u.id === recipientId);

  if (!sender || !recipient) {
    res.status(400).json({ error: 'Invalid sender or recipient' });
  } else if (sender.balance < amount) {
    res.status(400).json({ error: 'Insufficient balance' });
  } else {
    sender.balance -= amount;
    recipient.balance += amount;

    res.json({ message: `Transaction successful. Sender's new balance:
         ${sender.balance}. Recipient's new balance: ${recipient.balance}.`, sender, recipient });
  }
});

// Endpoint to transfer money from bank to commuter wallet
app.post('/api/bank-to-commuter', (req, res) => {
  const { userId, amount } = req.body;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(400).json({ error: 'Invalid user' });
  } else if (user.balance < amount) {
    res.status(400).json({ error: 'Insufficient balance in bank account' });
  } else {
    user.balance -= amount;
    user.commuterWallet += amount;

    res.json({ message: `Transfer from bank to commuter wallet successful. New bank balance:
         ${user.balance}. New commuter wallet balance: ${user.commuterWallet}.`, user });
  }
});

// Endpoint to transfer money from bank to shopping wallet
app.post('/api/bank-to-shopping', (req, res) => {
  const { userId, amount } = req.body;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(400).json({ error: 'Invalid user' });
  } else if (user.balance < amount) {
    res.status(400).json({ error: 'Insufficient balance in bank account' });
  } else {
    user.balance -= amount;
    user.shoppingWallet += amount;

    res.json({ message: `Transfer from bank to shopping wallet successful. New bank balance: 
        ${user.balance}. New shopping wallet balance: ${user.shoppingWallet}.`, user });
  }
});

// Endpoint to deposit from M-Pesa to commuter wallet
app.post('/api/mpesa-to-commuter', (req, res) => {
  const { userId, amount, mpesaPin } = req.body;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(400).json({ error: 'Invalid user' });
  } else {
    user.commuterWallet += amount;
    res.json({ message: `Deposit from M-Pesa to commuter wallet successful. New commuter wallet balance: ${user.commuterWallet}.`, user });
  }
});

// Endpoint to deposit from PayEdge agent to commuter wallet
app.post('/api/agent-to-commuter', (req, res) => {
  const { userId, agentNumber, storeNumber, pin, amount } = req.body;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(400).json({ error: 'Invalid user' });
  } else {
    user.commuterWallet += amount;
    res.json({ message: `Deposit from PayEdge agent to commuter wallet successful. New PayEdge commuter wallet balance is Ksh ${user.commuterWallet}.`, user });
  }
});

// Endpoint to get notifications
app.get('/api/notifications/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userNotifications = notifications.filter((n) => n.userId === userId);

  if (userNotifications.length > 0) {
    res.json(userNotifications);
  } else {
    res.status(404).json({ error: 'No notifications found for this user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

