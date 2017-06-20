const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const socketGame = require('./socketGameController');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// socket.io server
io.on('connection', socket => {
  socketGame.game(io, socket);
});

socketGame.handleMonsterNoCatch(io);
socketGame.handleOldSessions(io);

app.use('/public', express.static(`${__dirname}/public`));

nextApp.prepare()
  .then(() => {
    app.get('/messages', (req, res) => {
      res.json(messages)
    });

    app.get('*', (req, res) => {
      return nextHandler(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000')
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
