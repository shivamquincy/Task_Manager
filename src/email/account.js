const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
 host: "smtp.gmail.com",
 port: 465,
 secure: true, // true for 465, false for other ports
 auth: {
    user: 'singh.shvam26@gmail.com', // your Gmail account
    pass: 'wnei zlpy taeg gptz', // your app password
 },
});
async function sendEmail(recipientEmail, subject, message) {
    const mailOptions = {
        from: 'singh.shvam26@gmail.com',
        to: recipientEmail,
        subject: subject,
        text: message
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error occurred while sending email: ', error.message);
    }
}

module.exports = sendEmail;
