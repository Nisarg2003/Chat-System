import express from 'express'
import connectDb from './Config/connectDb.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import messageModel from './Models/messageModel.js';
import userModel from './Models/userModel.js';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import { sendMessage } from './Controller/ChatController.js';

const app = express();
app.use(cors())
connectDb()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
    
  });


const port = 8080;

app.use(express.json());
// app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secretKey',
}, (payload, done) => {
    const user = { username: payload.username };
    return done(null, user);
}));


app.use(passport.initialize());



app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({ username, password: hashedPassword });

    res.json({ message: 'User registered successfully' });
});


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username }, 'secretKey');

    res.json({ token });
});

app.get('/api/other-users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { username } = req.user;
    const users = await userModel.find({ username: { $ne: username } });
    const otherUsers = users.map((user) => user.username);
    res.json(otherUsers);
});


app.get('/api/messages/:sender/:receiver', async (req, res) => {
    const { sender, receiver } = req.params;
    try {
        const messages = await messageModel.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ createdAt: 1 }); // Sort messages by createdAt in ascending order
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/messages', passport.authenticate('jwt', { session: false }),sendMessage);

io.on("connection", (socket) => {
    console.log("A user connected");
  
    // Example: Handle socket events
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { io }