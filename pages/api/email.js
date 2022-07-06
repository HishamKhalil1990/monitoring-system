export default function(req,res){
    const text = req.body
    const subject = 'الفروع التي لم تستطع التحديث '
    // import module
    const nodemailer = require('nodemailer')
    // declared variables
    const host = "mail.abuodehbros.com" // email provider 
    const fromEmail = "alerts@abuodehbros.com" // email sender user
    const fromEmailPass = "Aa@123456" // email sender password
    const sendEmail = (text,subject) => {
        const transporter = nodemailer.createTransport({
            host: host,
            port: 587,
            secure: false,
            requireTLS: true,
            auth : {
                user : fromEmail,
                pass : fromEmailPass
            },
            tls: { 
                minVersion: 'TLSv1', // -> This is the line that solved my problem
                rejectUnauthorized: false,
            }
        });
        const emailOptions = {
            from : fromEmail,
            to : "r.wathaify@elrayhanjo.com,Z.nawafleh@elrayhanjo.com",
            subject : subject,
            cc : "m.abuizhery@abuodehbros.com,m.sawalha@abuodehbros.com",
            text : text,
        }
        transporter.sendMail(emailOptions,(error,info) => {
            if (error) throw error;
        })
    }
    sendEmail(text,subject)
    res.send('done')
}