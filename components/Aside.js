import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 200px;
`;

const Error = styled.div`
  color: #ff0707;
`;

class Aside extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      name: '',
    };
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmitForm(this.state.name);
  }

  render() {
    const players = this.props.players;
    return (
      <Wrapper>
        {
          this.props.name.length === 0 && <div>
            <form onSubmit={this.handleSubmit}>
              <input
                onChange={this.handleChange}
                type='text'
                placeholder='Enter your nick'
                value={this.state.name}
              />
              <button>Send</button>
            </form>
            {
              this.props.error.length > 0 && <Error>
                { this.props.error }
              </Error>
            }
          </div>
        }
        <ul>
          {
            Object.keys(players).map((player) => (
              <li key={player}>
                {player}: { players[player].capturedMonsters }
              </li>
            ))
          }
        </ul>
      </Wrapper>
    );
  }
}

export default Aside;
