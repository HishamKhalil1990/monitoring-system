export default function(req,res){
    // const text = req.body
    // const subject = 'الفروع التي لم تستطع التحديث '
    // // import module
    // const nodemailer = require('nodemailer')
    // // declared variables
    // const emailService = "GMAIL" // email provider 
    // const toEmail = "H.Ibraheem@abuodehbros.com" // email reciver
    // const fromEmail = "alertmsg.abuodeh1@gmail.com" // email sender user
    // const fromEmailPass = "Aa@123456" // email sender password
    // const sendEmail = (text,subject) => {
    //     const transporter = nodemailer.createTransport({
    //         service : emailService,
    //         auth : {
    //             user : fromEmail,
    //             pass : fromEmailPass
    //         }
    //     });
    //     const emailOptions = {
    //         from : fromEmail,
    //         to : toEmail,
    //         subject : subject,
    //         text : text,
    //     }
    //     transporter.sendMail(emailOptions,(error,info) => {
    //         if (error) throw error;
    //     })
    // }
    // sendEmail(text,subject)
    res.send('done')
}