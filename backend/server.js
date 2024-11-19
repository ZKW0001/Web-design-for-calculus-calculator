const express = require('express');
const bodyParser = require('body-parser');
const nerdamer = require("nerdamer/all.min");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/calculate', (req, res) => {
    try {
        const { expression, operation } = req.body;
        
        let result;
        let cleanExpression = expression.replace(/\s/g, ''); // Remove all whitespace

        if (operation === 'derivative') {
            cleanExpression = cleanExpression.replace(/d\/dx/i, '').replace(/^$$|$$$/g, '');
            result = nerdamer(`diff(${cleanExpression}, x)`).text('latex');
        } else if (operation === 'integral') {
            cleanExpression = cleanExpression.replace(/∫/g, '').replace(/^$$|$$$/g, '');
            result = nerdamer(`integrate(${cleanExpression}, x)`).text('latex');
        } else {
            // For basic calculations, just return the original expression
            result = cleanExpression;
        }
        
        res.json({ result });
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({ error: 'Calculation error' });
    }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});