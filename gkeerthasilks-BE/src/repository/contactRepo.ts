import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const sendQuery = async (request: Request, response: Response) => {
    try {

        // Check if environment variables are properly set
        if (!process.env.BE_EMAIL || !process.env.BE_PASSWORD) {
            return response.status(500).json({ error: "Email credentials missing. Please check server logs." });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.BE_EMAIL,
                pass: process.env.BE_PASSWORD, // Ensure this is correct
            },
        });

        let mailOptions;

        if (request?.body?.mobileNumber) {
            // Sending a query email
            mailOptions = {
                from: process.env.BE_EMAIL,
                to: process.env.BE_EMAIL, // Receiving email
                subject: "Query About Course",
                html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2 style="color:#a4204d;">You have a new query from the Learn-Tech website</h2>
              
                  <p style="font-size: 16px; color: #555;"><strong>Name :</strong> ${request?.body?.name}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Email ID :</strong> ${request.body?.email}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Mobile Number :</strong> ${request?.body?.mobileNumber}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Whatsapp Number :</strong> ${request?.body?.whatsappNumber}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Domain :</strong> ${request?.body?.domain || "<em>No Domain Mentioned</em>"}</p>
                  <p style="font-size: 16px; color: #555;"><strong>Query :</strong> ${request?.body?.query || "<em>No Query Provided</em>"}</p>
              
                  <hr style="border: 1px solid #ddd; margin: 20px 0;"/>
              
              
                </div>
              `
              
            };
        } else {
            mailOptions = {
                from: process.env.BE_EMAIL,
                to: process.env.BE_EMAIL, // Receiving email
                subject: "User Review",
                text: `You have a new review from:
                    Name: ${request?.body?.name}
                    EmailId: ${request?.body?.email}
                    Review: ${request?.body?.review || "No Review Provided"}`,
            };
        }

        await transporter.sendMail(mailOptions);

        return response.status(200).json({ message: "Email sent successfully!" });

    } catch (error: any) {
        
        if (!response.headersSent) {
            return response.status(500).json({ error: "Failed to send email. Check server logs for details." });
        }
    }
};

export default { sendQuery };
