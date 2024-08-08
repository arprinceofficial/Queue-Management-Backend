const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();

// Set up CORS
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:4010',
    'http://localhost:4011',
    'https://queue.arprince.me',
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            callback(new Error(msg), false);
        }
    }
};

app.use(cors(corsOptions));

app.set('trust proxy', true);

const server = http.createServer(app);

// Attach Socket.IO to the server
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware to attach io instance to req object for socket.io
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Import routes
const userOfficRoutes = require('./routes/userOfficRoutes');
const officeRoutes = require('./routes/officeRoutes');
const userAgentRoutes = require('./routes/userAgentRoutes');
const agentRoutes = require('./routes/agentRoutes');

// Images files path
app.use('/images', express.static('assets/images'));
app.use('/profile_images', authMiddleware, express.static('assets/images/profile_images'));
app.use('/passport_images', authMiddleware, express.static('assets/images/passport_images'));

// Use middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
app.use('/api/office/',
    userOfficRoutes,
    officeRoutes,
);
app.use('/api/agent/',
    userAgentRoutes,
    agentRoutes,
);

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected id:', socket.id);

    // Handle events here... (emit for sending, on for receiving)
    // socket.emit('testMessage', 'Hello from the server!');
    // socket.on('testMessage', (data: any) => {
    //     console.log('Received message:', data);
    // });

    socket.on('disconnect', () => {
        console.log('User disconnected id:', socket.id);
    });
});

// Start the server
server.listen(process.env.APP_PORT, () => {
    console.log('Server running on port', process.env.APP_PORT);
});
