export default function(req,res){
    const text = req.body
    const subject = 'الفروع التي لم تستطع التحديث '
    // import module
    const nodemailer = require('nodemailer')
    // declared variables
    const host = "owa1.abuodehbros.com" // email provider 
    const email = "H.Ibraheem@abuodehbros.com"
    const fromEmail = "alerts@abuodehbros.com" // email sender user
    const fromEmailPass = "Aa@123456" // email sender password
    const sendEmail = (text,subject,email) => {
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
            to : email,
            subject : subject,
            text : text,
        }
        transporter.sendMail(emailOptions,(error,info) => {
            if (error) throw error;
        })
    }
    sendEmail(text,subject,email)
    res.send('done')
}