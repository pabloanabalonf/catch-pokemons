import styled from 'styled-components';
import canvas from '../canvas';

const Page = styled.div`
  margin-top: 80px;
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;
  @media (min-width: 768px) {
    width: 766px;
  }
  @media (min-width: 992px) {
    width: 990px;
  }
  @media (min-width: 1200px) {
    width: 1198px;
  }
`;

export default Page;
