import React from 'react';
import io from 'socket.io-client';
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
  newGame
} from '../redux/actionsDispatcher';
import canvasDimensions from '../canvas';

const CanvasWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleNameExists = this.handleNameExists.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
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
    this.socket.emit('newGame');
    this.ctx = this._canvas.getContext('2d');
    this.bgImage = new Image();
    this.bgReady = false;
    this.bgImage.onload = function(){
      this.bgReady = true;
    };
    this.bgImage.src = '/public/background.png';

    this.heroImage = new Image();
    this.heroReady = false;
    this.heroImage.onload = function(){
      this.heroReady = true;
    };
    this.heroImage.src = '/public/hero.png';
    this.monsterImage = new Image();
    this.monsterReady = false;
    this.monsterImage.onload = () => {
      this.monsterReady = true;
    };
    this.monsterImage.src = '/public/monster.png';
  }

  handleSubmitForm(name) {
    this.socket.emit('newPlayer', name);
    this.props.updatePlayerName(name);
  }

  handleNameExists(errorNameInput) {
    this.setState({ errorNameInput });
    this.props.updatePlayerName('');
  }

  handlePlay({ players, monster }) {
    this.props.newGame(players, monster);
    this.requestAnimationFrame = window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || window.mozRequestAnimationFrame;
    this.main();
  }

  renderGame() {
    const players = this.props.players;
    const monster = this.props.monster;
    if (this.bgReady) {
      this.ctx.drawImage(this.bgImage, 0, 0);
    }
    if (this.monsterReady) {
      this.ctx.drawImage(
        this.monsterImage,
        monster.x,
        monster.y
      );
    }

    if (this.heroReady) {
      Object.keys(players).forEach((player) => {
        this.ctx.drawImage(
          this.heroImage,
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

  main() {
    this.renderGame();
    this.requestAnimationFrame(this.main);
  };

  render () {
    console.log(canvasDimensions);
    return (
      <Page>
        <Title>
          Game
        </Title>
        <Container>
          <CanvasWrapper>
            <canvas
              width={canvasDimensions.width}
              height={canvasDimensions.height}
              ref={(input) => { this._canvas = input; }}
              style={{border: '1px solid #F0DB4F'}} />
          </CanvasWrapper>
          <Aside
            name={this.props.name}
            error={this.state.errorNameInput}
            updatePlayerName={this.props.updatePlayerName}
            handleSubmitForm={this.handleSubmitForm}
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
    monster: state.monster
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePlayerName: bindActionCreators(updatePlayerName, dispatch),
    newGame: bindActionCreators(newGame, dispatch),
  }
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(HomePage);
