import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  color: #fff;
  text-transform: uppercase;
  font-size: 42px;
  margin: 0 0 20px 0;
  letter-spacing: 5px;
  font-family: 'Fjalla One', sans-serif;
`;

const Text = styled.span`
  transform: translateX(-50%) rotate(-10deg);
  display: block;
  float: left;
  left: 50%;
  transform: skew(-10deg);
  text-shadow: #3B5BA7 1px 1px,
    #3B5BA7 2px 2px,
    #3B5BA7 3px 3px,
    #3B5BA7 4px 4px,
    #3B5BA7 5px 5px,
    #3B5BA7 6px 6px;
  min-width: 10px;
  min-height: 10px;
  color: #f1c83c;
`;

export default () => (
  <Container>
    <Title>
      <Text>Catch Pokemons</Text>
    </Title>
  </Container>
);
