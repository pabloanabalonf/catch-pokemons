(function (){
	var app = angular.module('gameApp', ['btford.socket-io']);

	app.controller('GameController', ['$scope', 'socket', function ($scope, socket){
		$scope.load = true;
		$scope.players = [];
		$scope.player = {}; //GAME OBJECT
		$scope.playerReady = false;
		$scope.nameSend = false;
		$scope.message = "";

		//Game Variables
		var containerGame;
		var canvas;
		var ctx;
		var bgReady;
		var bgImage;
		var heroReady;
		var heroImage;
		var monsterReady;
		var monsterImage;
		var monster = {}; //GAME OBJECT
		var w;
		var index;
		var modifier = 0.017;
		var playMove;
		/* CREATE THE CANVAS */
		containerGame = document.getElementById("container-game");
		canvas = document.createElement('canvas');
		ctx = canvas.getContext("2d");
		canvas.width = 512;
		canvas.height = 480;
		containerGame.appendChild(canvas);
		/* INCLUDE DE IMAGES */
		bgReady = false;
		bgImage = new Image();
		bgImage.onload = function(){
			bgReady = true;
		};
		bgImage.src = "../images/background.png";

		heroReady = false;
		heroImage = new Image();
		heroImage.onload = function(){
			heroReady = true;
		};
		heroImage.src = "../images/hero.png";
		monsterReady = false;
		monsterImage = new Image();
		monsterImage.onload = function(){
			monsterReady = true;
		};
		monsterImage.src = '../images/monster.png';
		//Send canvas dimensions
		socket.emit('newGame', {'canvas': {'width': canvas.width, 'height': canvas.height}});

		//Return index of player
		var getIndex = function(){
			var i;
			for (i = 0; i < $scope.players.length; i++){
				if($scope.players[i].name_player == $scope.player.name_player){
					return i;
				}
			}
			i = 0;
			return i;
		};

		/* RENDER OBJECTS */
		var render = function(){
			if(bgReady){
				ctx.drawImage(bgImage, 0, 0);
			}
			if(monsterReady){
				ctx.drawImage(monsterImage, monster.x, monster.y);
			}
			for (var y = 0; y < $scope.players.length; y++){
				if(heroReady){
					if($scope.players[y]){
						ctx.drawImage(heroImage, $scope.players[y].x, $scope.players[y].y);
						ctx.fillStyle = "white";
						ctx.font = '10pt Helvetica';
						ctx.textAlign = "center";
						ctx.fillText($scope.players[y].name_player, $scope.players[y].x + 20, $scope.players[y].y + 42);
					}
				}
			}
		};

		/* UPDATE MOVE PLAYER */
		var main = function(){
			if($scope.player.keysDown){
				var distance = $scope.player.speed * modifier;

				//check index
				if(!$scope.players[index]){
					index = getIndex();
				}
				//check name_player
				if($scope.players[index].name_player != $scope.player.name_player){
					index = getIndex();
				}else{
					playMove = false;
					if(38 in $scope.player.keysDown){
						if(($scope.player.y - distance) >= 0){
							$scope.players[index].y -= distance;
							$scope.player.y -= distance;
							playMove = true;
						}
					}
					if(40 in $scope.player.keysDown){
						if(($scope.player.y + distance) <= (canvas.height-32)){
							$scope.players[index].y += distance;
							$scope.players.y += distance;
							playMove = true;
						}
					}
					if(37 in $scope.player.keysDown){
						if(($scope.player.x - distance) >= 0){
							$scope.players[index].x -= distance;
							$scope.players.x -= distance;
							playMove = true;
						}
					}
					if(39 in $scope.player.keysDown){
						if(($scope.player.x + distance) <= (canvas.width-32)){
							$scope.players[index].x += distance;
							$scope.players.x += distance;
							playMove = true;
						}
					}

					if($scope.player.x <= (monster.x +32) && monster.x <= ($scope.player.x +32) && $scope.player.y <= (monster.y +32) && monster.y <= ($scope.player.y +32)){
						$scope.players[index].monster_caught += 1;
						$scope.player.monster_caught += 1;
						socket.emit('monsterCatch', {'index': index});
					}
					if(playMove){
						socket.emit('updateMove', {'player': $scope.player, 'index': index});
					}
				}
			}
			render();
			requestAnimationFrame(main);
		};

		/* PLAYER INPUT */
		var keyDownEvent = function (e){
			e.preventDefault();
			$scope.player.keysDown[e.keyCode] = true;
		};

		var keyUpEvent = function (e){
			e.preventDefault();
			delete $scope.player.keysDown[e.keyCode];
		};

		var addKeyEvents = function(){
			addEventListener("keydown", keyDownEvent, false);
			addEventListener("keyup", keyUpEvent, false);
		};

		var removeKeyEvents = function (){
			removeEventListener("keydown", keyDownEvent);
			removeEventListener("keyup", keyUpEvent);
		};

		/**** SOCKET.IO EVENTS *****/

		/* START THE GAME */
		socket.forward('play', $scope);
		$scope.$on('socket:play', function (event, dataSocket){
			$scope.players = dataSocket.players;
			monster = dataSocket.monster;
			w = window;
			requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
			main();
			//remove loagind.gif
			$scope.load = false;
		});

		/* JOIN TO THE GAME */
		$scope.addNewPlayer = function (){
			$scope.nameSend = true;
			socket.emit('newPlayer', {
				"name_player": $scope.player.name,
				"x": canvas.width / 2,
				"y": canvas.height / 2
			});
		};
		/* NAME CHOSEN ALREADY EXISTS */
		socket.forward('nameExists', $scope);
		$scope.$on('socket:nameExists', function (event, dataSocket){
			if(dataSocket.exist){
				$scope.nameSend = false;
				$scope.message = dataSocket.message;
			}
		});

		/* NEW PLAYER READY TO PLAY */
		socket.forward('newPlayerReady', $scope);
		$scope.$on('socket:newPlayerReady', function (event, dataSocket){
			//Add player to array
			$scope.players.push(dataSocket.player);
			//if $scope.player.name still exists mean that is an user that not playing yet
			if($scope.player.name){
				//if you are the new player, you receive an index and the event listener for input
				if(dataSocket.player.name_player == $scope.player.name){
					$scope.playerReady = true;
					$scope.player = $scope.players[dataSocket.index];
					$scope.player.keysDown = {};
					index = dataSocket.index;
					addKeyEvents();
				}
			}
		});

		/* RESET MONSTER POSITION */
		socket.forward('reset', $scope);
		$scope.$on('socket:reset', function (event, dataSocket){
			monster = dataSocket.monster;
			$scope.players[dataSocket.index].monster_caught = dataSocket.monster_caught;
		});

		/* GET MOVEMENT OF PLAYERS */
		socket.forward('updateMovePlayers', $scope);
		$scope.$on('socket:updateMovePlayers', function (event, dataSocket){
			$scope.players[dataSocket.index] = dataSocket.player;
		});

		/* PLAYER DISCONETC */
		socket.forward('playerDisconnect', $scope);
		$scope.$on('socket:playerDisconnect', function (event, dataSocket){
			if($scope.playerReady) $scope.players.splice(dataSocket.index_player, 1);
		});

		/* MONSTER NOT CAPTURED IN 10 SECONDS, THEREFORE WE RESET POSITION */
		socket.forward('monsterNoCatch', $scope);
		$scope.$on('socket:monsterNoCatch', function (event, dataSocket){
			monster = dataSocket.monster;
		});

		/* GET SESSIONS EXPIRED OF PLAYERS */
		socket.forward('sessionsExpired', $scope);
		$scope.$on('socket:sessionsExpired', function (event, dataSocket){
			if(dataSocket.players.length > 0){
				for (var x = 0; x < dataSocket.players.length; x++){
					//if you are a player with expired session, reset variables and remove player input
					if(dataSocket.players[x].name_player == $scope.player.name_player){
						$scope.player = {
							"name": ""
						};
						$scope.playerReady = false;
						$scope.nameSend = false;
						removeKeyEvents();
						$scope.message = "Your session has expired :(\nLog in if you wanna play again.";
					}
					//Remove player from $scope.players
					for(var z = 0; z < $scope.players.length; z++){
						if(!$scope.players[z]) continue;
						if($scope.players[z].name_player == dataSocket.players[x].name_player){
							$scope.players.splice(z, 1);
						}
					}
				}
			}
		});
	}]);

	app.factory('socket', function (socketFactory){
		return socketFactory();
	});
})();