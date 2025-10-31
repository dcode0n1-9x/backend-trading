import nodemailer from 'nodemailer'
import { config } from '../generalconfig'

export  const transporter = nodemailer.createTransport({
    host: config.NODEMAILER.HOST,
    port: 465,
    auth: {
        user: config.NODEMAILER.USER,
        pass: config.NODEMAILER.PASS
    }
})

