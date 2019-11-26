const upload = require("../libs/multer");
const nodemailer = require("nodemailer");
const fs = require("fs");


const handle = (promise) => {
    return promise
    .then((data) => ([data, undefined]))
    .catch((error) =>Promise.resolve([undefined, error]));
}

const mailerController = {
    sendMail: (req, res) => {
        //we cant access the req.body here
        upload(req, res, async(err) => {
            if(err){
                res.status(500).json({
                    data: err
                })
            }else{
                //we can access the req.body safely
                console.log(req.body)

                const {title, body, email} = req.body;
                const image = req.file;

                const contentHTML = `
                    <h1>Problem: ${title}</h1>
                    <p>Client Email: ${email} </p>


                    <div>
                        <p>Problem Description</p>
                        <div>${body}</div>
                        
                        <img src="cid:unique@kreata.ee" />
                    </div>
                `;



                
                const transporter = nodemailer.createTransport({
                    host: "<MAILJET_HOST>",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "<MAILJET_USER>",
                        pass: "<MAILJET_PASS>"
                    }
                });


                const [SMTPResponse, SMTPResponseError] = await handle(
                    transporter.sendMail({
                        envelope: {
                            from: "'SMTP Server' <YOUR_HOSTNAME_OR_EMAIL>",
                            to: "<EMAIL>, Mailer <EMAIL>"
                        },
                        subject: "IT Problem Tut site",
                        html: contentHTML,
                        attachments: [{
                            filename: image.filename,
                            path: `./temp/${image.filename}`,
                            cid: "cid:unique@kreata.ee"
                        }]
                    })
                );


                 //delete the file after sending the email or after an error   
                if(SMTPResponse){
                    res.status(200).json({
                        data:  "email received, we will reach you as soon as we can: " + SMTPResponse.messageId 
                    });
                }    

                if(SMTPResponseError){
                    res.status(500).json({
                        data: SMTPResponseError
                    });
                }
            
            }
        })
    }
}

module.exports = mailerController;