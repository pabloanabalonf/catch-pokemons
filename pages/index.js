import React from 'react';
import io from 'socket.io-client';
import _ from 'lodash';
import { initStore } from '../redux/store';
import withRedux from 'next-redux-wrapper';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import Page from '../components/Page';
import Title from '../components/Title';
import Container from '../components/Container';
import Aside from '../components/Aside';
import {
  updatePlayerName,
  newGame,
  monsterNoCatch,
  newPlayer,
  removeOldSessions,
  updatePlayerInfo,
  playerDisconnect,
  imageLoaded,
  keyDownEvent as keyDownEventAction,
  keyUpEvent as keyUpEventAction,
  clearKeysDown
} from '../redux/actionsDispatcher';
import getImages from '../components/images';
import canvasDimensions from '../canvas';

const CanvasWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

let requestAnimationFrame;
const modifier = 0.017;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleNameExists = this.handleNameExists.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleMonsterNoCatch = this.handleMonsterNoCatch.bind(this);
    this.handleNewPlayer = this.handleNewPlayer.bind(this);
    this.handleSessionExpired = this.handleSessionExpired.bind(this);
    this.handleUpdatePlayerInfo = this.handleUpdatePlayerInfo.bind(this);
    this.handlePlayerDisconnect = this.handlePlayerDisconnect.bind(this);
    this.state = {
      errorNameInput: ''
    };
    this.renderGame = this.renderGame.bind(this);
    this.main = this.main.bind(this);
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('nameExists', this.handleNameExists);
    this.socket.on('play', this.handlePlay);
    this.socket.on('monsterNoCatch', this.handleMonsterNoCatch);
    // use the same funcion for 'resetMonsterPosition' event
    this.socket.on('resetMonsterPosition', this.handleMonsterNoCatch);
    this.socket.on('newPlayerReady', this.handleNewPlayer);
    this.socket.on('updatePlayerInfo', this.handleUpdatePlayerInfo);
    this.socket.on('playerDisconnect', this.handlePlayerDisconnect);
    this.socket.on('removeOldSessions', this.handleSessionExpired);
    this.socket.emit('newGame');
    this.ctx = this._canvas.getContext('2d');
    this.images = getImages(this.props.imageLoaded);
  }

  handleSubmitForm(name) {
    this.socket.emit('newPlayer', name);
    this.props.updatePlayerName(name);
  }

  handleNameExists(errorNameInput) {
    this.setState({ errorNameInput });
    this.props.updatePlayerName('');
  }

  handleMonsterNoCatch(monster) {
    this.props.monsterNoCatch(monster);
  }

  handleNewPlayer({ name, info }) {
    this.props.newPlayer(name, info);
    if (name === this.props.name) {
      this.addKeyEvents();
    }
  }

  handleSessionExpired(playersDeleted) {
    if (_.includes(playersDeleted, this.props.name)) {
      this.setState({
        errorNameInput: 'Your session has expired'
      });
      this.props.updatePlayerName('');
      this.props.clearKeysDown();
      this.removeKeyEvents();
    }
    this.props.removeOldSessions(playersDeleted);
  }

  handlePlay({ players, monster }) {
    this.props.newGame(players, monster);
    requestAnimationFrame = window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || window.mozRequestAnimationFrame;
    this.main();
  }

  handleUpdatePlayerInfo({ name, info }) {
    this.props.updatePlayerInfo(name, info);
  }

  handlePlayerDisconnect(name) {
    this.props.playerDisconnect(name);
  }

  renderGame() {
    const players = this.props.players;
    const monster = this.props.monster;
    if (this.props.images.mapImageLoaded) {
      this.ctx.drawImage(
        this.images.map,
        0,
        0,
        512,
        (480 * this.images.map.height) / this.images.map.width
      );
    }
    if (this.props.images.monsterImageLoaded) {
      this.ctx.drawImage(
        this.images.monster,
        monster.x,
        monster.y
      );
    }

    if (this.props.images.masterImageLoaded) {
      Object.keys(players).forEach((player) => {
        this.ctx.drawImage(
          this.images.master,
          players[player].x,
          players[player].y
        );
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10pt Helvetica';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          player,
          players[player].x + 20,
          players[player].y + 42
        );
      });
    }
  }

  keyDownEvent = (e) => {
    e.preventDefault();
    if (_.includes([38, 40, 37, 39], e.keyCode)) {
      this.props.keyDownEventAction(e.keyCode);
    }
  }

  keyUpEvent = (e) => {
    e.preventDefault();
    if (_.includes([38, 40, 37, 39], e.keyCode)) {
      this.props.keyUpEventAction(e.keyCode);
    }

  };

  addKeyEvents = () => {
    addEventListener('keydown', this.keyDownEvent, false);
    addEventListener('keyup', this.keyUpEvent, false);
  }


  removeKeyEvents = () => {
    removeEventListener('keydown', this.keyDownEvent);
    removeEventListener('keyup', this.keyUpEvent);
  };

  main() {
    if (this.props.keysDown && this.props.players[this.props.name]) {
      const playerInfo = this.props.players[this.props.name];
      const distance = playerInfo.speed * modifier;
      let isPlayerActive = false;
      let changeMonsterPosition = false;
      if (this.props.keysDown[38]) {
        if ((playerInfo.y - distance) >= 0) {
          playerInfo.y -= distance;
          isPlayerActive = true;
        }
      }
      if (this.props.keysDown[40]) {
        if((playerInfo.y + distance) <= (canvasDimensions.height - 32)){
          playerInfo.y += distance;
          isPlayerActive = true;
        }
      }
      if (this.props.keysDown[37]) {
        if ((playerInfo.x - distance) >= 0) {
          playerInfo.x -= distance;
          isPlayerActive = true;
        }
      }
      if (this.props.keysDown[39]) {
        if ((playerInfo.x + distance) <= (canvasDimensions.width - 32)) {
          playerInfo.x += distance;
          isPlayerActive = true;
        }
      }
      if (playerInfo.x <= (this.props.monster.x + 32)
        && this.props.monster.x <= (playerInfo.x + 32)
        && playerInfo.y <= (this.props.monster.y + 32)
        && this.props.monster.y <= (playerInfo.y + 32)) {
        playerInfo.capturedMonsters += 1;
        changeMonsterPosition = true
      }
      if (isPlayerActive) {
        this.props.updatePlayerInfo(this.props.name, playerInfo);
        this.socket.emit(
          'updatePosition',
          {
            name: this.props.name,
            info: playerInfo,
            changeMonsterPosition
          }
        );
      }
    }
    this.renderGame();
    requestAnimationFrame(this.main);
  };

  render () {
    return (
      <Page>
        <Title />
        <Container>
          <CanvasWrapper>
            <canvas
              width={canvasDimensions.width}
              height={canvasDimensions.height}
              ref={(input) => { this._canvas = input; }}
              style={{
                border: 0,
                boxShadow: '3px 2px 10px 0 rgba(0, 0, 0, 0.1)',
                borderRadius: '4px'
              }} />
          </CanvasWrapper>
          <Aside
            name={this.props.name}
            error={this.state.errorNameInput}
            updatePlayerName={this.props.updatePlayerName}
            handleSubmitForm={this.handleSubmitForm}
            players={this.props.players}
          />
        </Container>
      </Page>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    name: state.name,
    players: state.players,
    monster: state.monster,
    images: state.images,
    keysDown: state.keysDown
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePlayerName: bindActionCreators(updatePlayerName, dispatch),
    newGame: bindActionCreators(newGame, dispatch),
    monsterNoCatch: bindActionCreators(monsterNoCatch, dispatch),
    newPlayer: bindActionCreators(newPlayer, dispatch),
    removeOldSessions: bindActionCreators(removeOldSessions, dispatch),
    updatePlayerInfo: bindActionCreators(updatePlayerInfo, dispatch),
    playerDisconnect: bindActionCreators(playerDisconnect, dispatch),
    imageLoaded: bindActionCreators(imageLoaded, dispatch),
    keyDownEventAction: bindActionCreators(keyDownEventAction, dispatch),
    keyUpEventAction: bindActionCreators(keyUpEventAction, dispatch),
    clearKeysDown: bindActionCreators(clearKeysDown, dispatch)
  };
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(HomePage);
