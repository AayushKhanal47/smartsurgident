"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("[email] EMAIL_USER/EMAIL_PASS not set — skipping email send");
        return;
    }
    try {
        await transporter.sendMail({
            from: `"Smart Surgident" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    }
    catch (error) {
        console.error("[email] Failed to send email:", error);
    }
};
exports.sendEmail = sendEmail;
