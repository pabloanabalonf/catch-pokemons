var socketio = require('socket.io');
var _ = require('lodash');
var players = [];
var monster = {};
var canvas = {};

exports.listen = function (server){
	var io = socketio.listen(server);

	io.on('connection', function (socket){
		handleNewGame(io, socket);
		handleNewPlayer(io, socket);
		handleUpdateMovePlayer(io, socket);
		handleMonsterCatch(io, socket);
		handleDisconnect(io, socket);
	});

	handleMonsterNoCatch(io);
	handleOldSessions(io);
};


function handleNewGame (io, socket){
	socket.on('newGame', function (data){
		canvas = data.canvas;
		//if the monster is not created yet...
		if(!monster.x && !monster.y){
			monster.x = 32 + (Math.random() * (canvas.width - 64));
			monster.y = 32 + (Math.random() * (canvas.height - 64));
			monster.updated = Date.now();
		}
		socket.emit('play', {players: players, monster: monster});
	});
}

function handleNewPlayer(io, socket){
	socket.on('newPlayer', function (data){
		var player = {
			"name_player": data.name_player,
			"speed": 256, //movement in pixels per second
			"x": data.x,
			"y": data.y,
			"monster_caught": 0,
			"updated": Date.now()
		};
		//check if name exists with lodash
		var playerFound = _.find(players, {name_player: data.name_player});
		if(!playerFound){
			players.push(player);
			//get collection index with lodash
			var index = _.findIndex(players, {'name_player': data.name_player});
			//give 'name_player' and 'index_player' variables to socket for handle 'disconnect' event
			socket.name_player = data.name_player;
			socket.index_player = index;
			//emit event to all users connected
			io.emit("newPlayerReady", {'player': player, 'index': index});
		}else{
			//player name exists, choose another
			socket.emit('nameExists', {exist: true, message: "Name "+data.name_player+" already exist"});
		}
	});

}

function handleUpdateMovePlayer(io, socket){
	socket.on('updateMove', function (data){
		//check if data exists
		try{
			if(data.player){
				//check if index player exists
				if(players[data.index]){
					//check if index player match with data received
					if(players[data.index].name_player == data.player.name_player){
						//user still playing 
						players[data.index].updated = Date.now();
						//new position
						players[data.index].x = data.player.x;
						players[data.index].y = data.player.y;
						//emit event for all users less for to the user who fire this event
						socket.broadcast.emit('updateMovePlayers', {'player': players[data.index], 'index':data.index});
					}
				}
			}
		}catch(err){
			console.log('Error: '+err);
		}
		
	});
}

function handleMonsterCatch(io, socket){
	socket.on('monsterCatch', function (data){
		//Add point to the user
		players[data.index].monster_caught += 1;
		//new monster position
		monster.x = 32 + (Math.random() * (canvas.width - 64));
		monster.y = 32 + (Math.random() * (canvas.height - 64));
		//reset monster update
		monster.updated = Date.now();
		io.emit('reset', {'index': data.index, 'monster_caught': players[data.index].monster_caught, 'monster': monster});
	});
}

function handleDisconnect(io, socket){
	socket.on('disconnect', function (){
		//if player gone, we delete of collection
		if(socket.name_player && socket.index_player >= 0){
			players.splice(socket.index_player, 1);
			io.emit('playerDisconnect', {'player':{'name_player':socket.name_player, 'index_player': socket.index_player}});
		}
	});
}

function handleMonsterNoCatch(io){
	//If no one caught the monster in 10 seconds, will reset his position
	setInterval(function (){
		var timeMonsterNoCaught = Date.now() - monster.updated;
		if(timeMonsterNoCaught > 10000){
			monster.x = 32 + (Math.random() * (canvas.width - 64));
			monster.y = 32 + (Math.random() * (canvas.height - 64));
			monster.updated = Date.now();
			io.emit('monsterNoCatch', {'monster': monster});
		}
	}, 10000);
}

function handleOldSessions(io){
	//If player doesn't move in 20 secons, expire his session
	setInterval(function (){
		var playersDelete = [];
		for (var i = 0; i < players.length; i++){
			//Always check if index still exists
			if(!players[i]) continue;
			var playerUpdate = Date.now() - players[i].updated;
			if(playerUpdate > 20000){
				playersDelete.push(players[i]);
				players.splice(i, 1);
			}
		}
		//Emit event to all user
		io.emit('sessionsExpired', {'players': playersDelete});
	}, 20000);
}