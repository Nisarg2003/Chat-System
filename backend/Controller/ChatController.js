import messageModel from "../Models/messageModel.js";
import { io } from '../server.js'


export const sendMessage  =  async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        const newMessage = await messageModel.create({ sender, receiver, message });

        io.emit('message', newMessage);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
