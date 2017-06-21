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
  display: block;
  text-shadow: #533d4a 1px 1px,
    #533d4a 2px 2px,
    #533d4a 3px 3px,
    #533d4a 4px 4px,
    #533d4a 5px 5px,
    #533d4a 6px 6px;
  min-width: 10px;
  min-height: 10px;
  &:nth-child(1) {
    color: #f1c83c;
  }
  &:nth-child(2) {
    color: #79dea4;
  }
  &:nth-child(3) {
    color: #e55643;
  }
`;

export default () => (
  <Container>
    <Title>
      <Text>Catch</Text>
      <Text>the</Text>
      <Text>monster</Text>
    </Title>
  </Container>
);
