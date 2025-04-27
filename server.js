import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import Sentiment from 'sentiment';



const app = express();
const port = 5000;  // Backend running on port 5000

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost', // Your MySQL server address
  user: 'root',      // Your MySQL username
  password: 'Aashi@2004',      // Your MySQL password
  database: 'finance_advisory'  // Your MySQL database name
});

// Check the MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);  // Exit if MySQL connection fails
  }
  console.log('Connected to MySQL');
});

// A simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// A POST route to handle form submissions
app.post('/api/advice', (req, res) => {
  const userData = req.body;

  // Check if all necessary fields are provided
  if (!userData || !userData.name || !userData.investment || !userData.risk || !userData.goal) {
    return res.status(400).json({ message: 'Please provide all necessary fields' });
  }

  // Generate the advice message based on risk and goal
  let adviceMessage = '';

  if (userData.risk === 'low') {
    adviceMessage = 'We recommend starting with low-risk investments like bonds or index funds.';
  } else if (userData.risk === 'moderate') {
    adviceMessage = 'A balanced approach with a mix of stocks and bonds is a good strategy for you.';
  } else {
    adviceMessage = 'Consider higher-risk, higher-return options like stocks and mutual funds.';
  }

  if (userData.goal === 'retirement') {
    adviceMessage += ' Since you are saving for retirement, consider long-term, stable investments.';
  } else if (userData.goal === 'growth') {
    adviceMessage += ' For long-term growth, you might want to focus on diversified stocks and growth funds.';
  } else if (userData.goal === 'short-term') {
    adviceMessage += ' For short-term gains, it is recommended to invest in less volatile options like bonds or short-term funds.';
  }

  // Log the final advice message
  console.log("Generated Advice Message:", adviceMessage);

  // Initialize sentiment analysis
  const sentiment = new Sentiment();
  
  // Analyze the sentiment of the name or any other text (e.g., the goal or advice message)
  const sentimentResult = sentiment.analyze(userData.name);

  // Add sentiment analysis to the advice message
  let sentimentText = '';
  if (sentimentResult.score > 0) {
    sentimentText = 'The user seems positive about their financial goals.';
  } else if (sentimentResult.score < 0) {
    sentimentText = 'The user seems negative about their financial goals.';
  } else {
    sentimentText = 'The user seems neutral about their financial goals.';
  }

  // Log sentiment result
  console.log("Sentiment Result:", sentimentResult);

  // Ensure investment is a valid number
  const investment = parseFloat(userData.investment);
  if (isNaN(investment)) {
    return res.status(400).json({ message: 'Investment should be a valid number.' });
  }

  // Log the values being inserted
  const query = 'INSERT INTO user_advice (name, investment, risk, goal, advice_message, sentiment_message) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [
    userData.name,
    investment,  // Ensuring it's a valid number
    userData.risk,
    userData.goal,
    adviceMessage,
    sentimentText  // Sentiment message
  ];

  // Execute the query to insert data into MySQL
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return res.status(500).json({ message: 'Error processing your request. Please try again later.' });
    }

    console.log("Data inserted successfully:", result);

    // Send the response back to the frontend with the advice message
    res.json({
      message: adviceMessage,
      sentiment: sentimentText,  // Adding the sentiment result
      data: userData  // Sending back the user data for reference
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});




// Sentiment analysis setup using node-nlp
const sentimentAnalyzer = new SentimentAnalyzer({ language: 'en' });

// Perform sentiment analysis on the advice message
const sentimentResult = sentimentAnalyzer.getSentiment(adviceMessage);

// Determine the sentiment message based on the score
let sentimentMessage = '';
if (sentimentResult.score > 0) {
  sentimentMessage = 'The user seems positive about their financial goals.';
} else if (sentimentResult.score < 0) {
  sentimentMessage = 'The user seems negative about their financial goals.';
} else {
  sentimentMessage = 'The user’s sentiment is neutral.';
}
res.json({
  message: adviceMessage,
  sentiment: sentimentMessage,  // Send the sentiment analysis result back
  data: userData
});





//mainnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
// import express from 'express';
// import mysql from 'mysql2';
// import cors from 'cors';

// const app = express();
// const port = 5000;  // Backend running on port 5000

// // Middleware to parse JSON requests
// app.use(express.json());

// // Enable CORS (Cross-Origin Resource Sharing)
// app.use(cors());

// // MySQL Database connection
// const db = mysql.createConnection({
//   host: 'localhost', // Your MySQL server address
//   user: 'root',      // Your MySQL username
//   password: 'Aashi@2004',      // Your MySQL password
//   database: 'finance_advisory'  // Your MySQL database name
// });

// // Check MySQL connection
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     process.exit(1);  // Exit if MySQL connection fails
//   }
//   console.log('Connected to MySQL');
// });

// // A POST route to handle form submissions and advice generation
// app.post('/api/advice', (req, res) => {
//   const userData = req.body;

//   // Log the received data
//   console.log("Received Data:", userData);

//   // Check if all necessary fields are provided
//   if (!userData || !userData.name || !userData.investment || !userData.risk || !userData.goal) {
//     return res.status(400).json({ message: 'Please provide all necessary fields' });
//   }

//   // Generate the advice message
//   let adviceMessage = '';

//   if (userData.risk === 'low') {
//     adviceMessage = 'We recommend starting with low-risk investments like bonds or index funds.';
//   } else if (userData.risk === 'moderate') {
//     adviceMessage = 'A balanced approach with a mix of stocks and bonds is a good strategy for you.';
//   } else {
//     adviceMessage = 'Consider higher-risk, higher-return options like stocks and mutual funds.';
//   }

//   if (userData.goal === 'retirement') {
//     adviceMessage += ' Since you are saving for retirement, consider long-term, stable investments.';
//   } else if (userData.goal === 'growth') {
//     adviceMessage += ' For long-term growth, you might want to focus on diversified stocks and growth funds.';
//   } else if (userData.goal === 'short-term') {
//     adviceMessage += ' For short-term gains, it is recommended to invest in less volatile options like bonds or short-term funds.';
//   }

//   console.log("Generated Advice Message:", adviceMessage);

//   // Ensure investment is a valid number
//   const investment = parseFloat(userData.investment);
//   if (isNaN(investment)) {
//     return res.status(400).json({ message: 'Investment should be a valid number.' });
//   }

//   // SQL query to insert data into MySQL
//   const query = 'INSERT INTO user_advice (name, investment, risk, goal, advice_message) VALUES (?, ?, ?, ?, ?)';
//   const values = [
//     userData.name,
//     investment, // Ensuring it's a valid number
//     userData.risk,
//     userData.goal,
//     adviceMessage
//   ];

//   console.log("Query Values:", values);

//   // Execute the query to insert data into MySQL
//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Error inserting data into MySQL:', err);
//       return res.status(500).json({ message: 'Error processing your request. Please try again later.' });
//     }

//     console.log("Data inserted successfully:", result);

//     // Send the response back to the frontend with the advice message
//     res.json({
//       message: adviceMessage,
//       data: userData  // Sending back the user data for reference
//     });
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Backend server running on http://localhost:${port}`);
// });



//basiccccccccccccccccccccccccc
// import express from 'express';
// import cors from 'cors';

// const app = express();
// const port = 5000;  // Backend running on port 5000

// // Middleware to parse JSON requests
// app.use(express.json());

// // Enable CORS (Cross-Origin Resource Sharing)
// app.use(cors());

// // A simple route for testing
// app.get('/', (req, res) => {
//   res.json({ message: 'Hello from the backend!' });
// });

// // A POST route to handle form submissions
// app.post('/api/advice', (req, res) => {
//   const userData = req.body;

//   // Check if user data is provided and valid
//   if (!userData || !userData.name || !userData.investment) {
//     return res.status(400).json({ message: 'Please provide name and investment amount' });
//   }

//   // Logic to classify investment and provide personalized advice
//   let adviceMessage = '';

//   if (userData.investment < 10000) {
//     adviceMessage = `As a new investor, we recommend you start with low-risk investments, such as bonds or index funds.`;
//   } else if (userData.investment >= 10000 && userData.investment <= 50000) {
//     adviceMessage = `With an investment of $${userData.investment}, you could consider a balanced approach with a mix of stocks and bonds.`;
//   } else {
//     adviceMessage = `With an investment of $${userData.investment}, you can diversify into higher-risk, higher-return options like stocks or mutual funds.`;
//   }

//   // Send back the personalized response
//   res.json({
//     message: adviceMessage, // This should send the correct personalized message based on the investment
//     data: userData          // Sending back the user data for reference
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Backend server running on http://localhost:${port}`);
// });



