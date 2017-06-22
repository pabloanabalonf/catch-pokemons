import _ from 'lodash';
import styled from 'styled-components';
import FormContainer from './FormContainer';
import FormButton from './FormButton';
import InputForm from './InputForm';
import ErrorBox from './ErrorBox';
import ListContainer from './ListContainer';
import List from './List';
import Item from './Item';
import ArrowKeys from './ArrowKeys';

const Wrapper = styled.div`
  width: 100%;
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
    const name = this.state.name.trim();
    if (name.length > 0) {
      this.props.handleSubmitForm(name);
      this.setState({ name });
    }
  }

  render() {
    const players = Object
      .keys(this.props.players)
      .map((name) => {
        return {
          name,
          ...this.props.players[name]
        };
    });
    return (
      <Wrapper>
        {
          this.props.name.length === 0 ?
            <FormContainer>
              <form onSubmit={this.handleSubmit}>
                <InputForm
                  type='text'
                  placeholder='Enter your nick'
                  onChange={this.handleChange}
                  value={this.state.name}
                />
                <FormButton>play</FormButton>
              </form>
              {
                this.props.error.length > 0 && <ErrorBox>
                  { this.props.error }
                </ErrorBox>
              }
            </FormContainer>
          :
            <ArrowKeys />
        }
        <ListContainer>
          <List>
            {
              _.orderBy(
                players,
                ['pokemonsCaptured', 'name'],
                ['desc', 'asc']
              ).map((player) => (
                <Item key={player.name}>
                  <span>
                    {player.name}
                  </span>
                  <span>
                    { player.pokemonsCaptured }
                  </span>
                </Item>
              ))
            }
          </List>
        </ListContainer>
      </Wrapper>
    );
  }
}

export default Aside;
