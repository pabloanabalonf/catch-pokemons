import styled from 'styled-components';

const Item = styled.li`
  padding: 1em;
  border-radius: 4px;
  margin-bottom: .125em;
  display: flex;
  justify-content: space-between;
  list-style: none;
  letter-spacing: 5px;
  font-family: 'Fjalla One', sans-serif;
  background-color: #79dea4;
  color: #3b3b3b;

  &:nth-child(1) {
    color: #fff;
    background-color: #C98910;
  }
  &:nth-child(2) {
    color: #fff;
    background-color: #A8A8A8;
  }
  &:nth-child(3) {
    color: #fff;
    background-color: #965A38;
  }
`;

export default Item;
