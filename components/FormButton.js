import styled from 'styled-components';

const FormButton = styled.button`
  display: inline-block;
  color: inherit;
  font-family: 'Fjalla One', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 0;
  outline: 0;
  transition: all 200ms ease-in;
  cursor: pointer;
  background: #f1c83c;
  color: #3b3b3b;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, .1);
  border-radius: 2px;
  padding: 12px 36px;
  margin-left: -96px;

  &:hover {
    background: #eebc12;
  }

  &:active {
    background: #eebc12;
    box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, .2);
  }
`;

export default FormButton;
