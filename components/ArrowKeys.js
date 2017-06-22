import styled from 'styled-components';
import { connect } from 'react-redux';

const Container = styled.div`
  text-align: center;
  width: 400px;
  height: 190px;
  margin: auto;
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  letter-spacing: 5px;
  font-family: 'Fjalla One', sans-serif;
  text-shadow: #3B5BA7 1px 1px,
    #3B5BA7 2px 2px,
    #3B5BA7 3px 3px,
    #3B5BA7 3px 3px,
    #3B5BA7 3px 4px,
    #3B5BA7 3px 4px;
  text-transform: uppercase;
  color: #f1c83c;
`;

const Arrow = styled.div`
  cursor: pointer;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background: #fff;
  color: #9d9d9d;
  font-size: 23px;
  border-right: 10px solid #bcbaba;
  border-bottom: ${props => props.pressed ?
    '8px solid #727171' : '10px solid #d5d5d5'};
  border-left: 10px solid #b2b2b1;
  border-top: 10px solid #d8d8d8;
  display: inline-block;
  margin: 5px;
  transition: all .05s linear;
  user-select: none;
  transform: ${props => props.pressed ?
    'translate(0, 2px)' : 'none'};
`;

const mapStateToProps = (state) => {
  return {
    keysDown: state.keysDown
  };
}

export default connect(mapStateToProps, {})(({ keysDown }) => {
  const pressed = {
    up: keysDown[38] || false,
    down: keysDown[40] || false,
    left: keysDown[37] || false,
    right: keysDown[39] || false,
  };
  return (
    <Container>
      <Title>
        Use your arrow keys
      </Title>
      <Arrow
        pressed={pressed.up}
        style={{
        position: 'relative',
        top: '-4px'
      }}>
        <i className="fa fa-arrow-up" />
      </Arrow>
      <br />
      <Arrow pressed={pressed.left}>
        <i className="fa fa-arrow-left" />
      </Arrow>
      <Arrow pressed={pressed.down}>
        <i className="fa fa-arrow-down" />
      </Arrow>
      <Arrow pressed={pressed.right}>
        <i className="fa fa-arrow-right" />
      </Arrow>
    </Container>
  );
});
