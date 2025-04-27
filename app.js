document.getElementById('advice-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get the form values (name, investment amount, risk, and goal)
  const name = document.getElementById('name').value;
  const investment = document.getElementById('investment').value;
  const risk = document.getElementById('risk').value;
  const goal = document.querySelector('input[name="goal"]:checked').value;

  // Basic validation to check if all fields are filled
  if (!name || !investment || !risk || !goal) {
    alert('Please fill out all fields.');
    return;
  }

  // Create a request payload object
  const userData = {
    name: name,
    investment: investment,
    risk: risk,
    goal: goal
  };

  // Send the data to the backend using Fetch API (POST request)
  fetch('http://localhost:5000/api/advice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)  // Send the data as JSON
  })
  .then(response => response.json())  // Parse the response to JSON
  .then(data => {
    // Once the data is returned from the backend, display the result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <p><strong>Advice for ${data.data.name}:</strong></p>
      <p>Investment Amount: $${data.data.investment}</p>
      <p><strong>Risk Profile:</strong> ${data.data.risk}</p>
      <p><strong>Investment Goal:</strong> ${data.data.goal}</p>
      <p><strong>Message from our advisor:</strong> ${data.message}</p>
    `;
  
    // Display the sentiment analysis result
    const sentimentDiv = document.getElementById('sentiment-result');
    sentimentDiv.innerHTML = `<p><strong>Sentiment Analysis:</strong> ${data.sentiment}</p>`;  // Display sentiment
  })
  

  // .then(data => {
  //   // Once the data is returned from the backend, display the result
  //   const resultDiv = document.getElementById('result');
  //   resultDiv.innerHTML = `
  //     <p><strong>Advice for ${data.data.name}:</strong></p>
  //     <p>Investment Amount: $${data.data.investment}</p>
  //     <p><strong>Risk Profile:</strong> ${data.data.risk}</p>
  //     <p><strong>Investment Goal:</strong> ${data.data.goal}</p>
  //     <p><strong>Message from our advisor:</strong> ${data.message}</p>
  //   `;
  // })
  .catch(error => {
    console.error('Error fetching data:', error);
    alert('There was an error processing your request. Please try again.');
  });
});





  
  






