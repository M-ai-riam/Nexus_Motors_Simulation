const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Replace these with your email credentials
const EMAIL_USER = 'mariamshah0514@gmail.com';
const EMAIL_PASS = '225shah_Atif';
const WINNER_ANNOUNCE_TO = 'mariamshah0514@gmail.com';



// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Redirect root to the main HTML file in public
app.get('/', (req, res) => {
    res.redirect('/nexus_motors_simulation.html');
});

app.use(cors());
app.use(express.json());

app.post('/announce-winner', async (req, res) => {
    const { teamName, profit, stockPrice } = req.body;
    if (!teamName || profit == null || stockPrice == null) {
        return res.status(400).json({ message: 'Missing winner info.' });
    }

    // Setup nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: WINNER_ANNOUNCE_TO,
        subject: 'Nexus Motors Simulation Winner',
        text: `🏆 The winning team is ${teamName}!\nProfit: $${profit}M\nStock Price: $${stockPrice}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Winner email sent successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send email.', error: err.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Open http://localhost:3000/nexus_motors_simulation.html in your browser.');
});
