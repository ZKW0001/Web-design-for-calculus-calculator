const express = require('express'); 
const bodyParser = require('body-parser');
const nerdamer = require("nerdamer/all.min");
const cors = require('cors');

const app = express();

app.use(cors()); // Enable cross-origin resource sharing
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define a POST route '/calculate' for handling calculus calculations
app.post('/calculate', (req, res) => {
    try {
        const { expression, operation } = req.body;
        
        let result;
        let cleanExpression = expression.replace(/\s/g, ''); // Remove all whitespace characters from the expression
        
        // Check if the operation is a derivative or integral
        if (operation === 'derivative') {
            cleanExpression = cleanExpression.replace(/d\/dx/i, '').replace(/^$$|$$$/g, ''); // Remove 'd/dx' and any leading/trailing '$$'
            result = nerdamer(`diff(${cleanExpression}, x)`).text('latex'); // Use nerdamer to calculate the derivative
        } else if (operation === 'integral') {
            cleanExpression = cleanExpression.replace(/∫/g, '').replace(/^$$|$$$/g, ''); // Remove '∫' and any leading/trailing '$$'
            result = nerdamer(`integrate(${cleanExpression}, x)`).text('latex'); // Use nerdamer to calculate the integral
        } else {
            result = cleanExpression; // Return empty expression if no operation is specified
        }
        
        res.json({ result }); // Send the result back to the client
    } catch (error) {
        console.error('Calculation error:', error); // Log the error to the console
        res.status(500).json({ error: 'Calculation error' }); // Send an error response to the client
    }
});


const PORT = process.env.PORT || 8001; // Define the port number 8001

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
