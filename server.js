const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const gameIO = require('./socketGameController');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

io.on('connection', socket => {
  console.log('socket.io connected');
  gameIO.connection(io, socket);
});

gameIO.handleMonsterNoCatch(io);
gameIO.handleOldSessions(io);

app.use('/public', express.static(`${__dirname}/public`));

nextApp.prepare()
  .then(() => {
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
