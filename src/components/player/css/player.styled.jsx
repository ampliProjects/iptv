import styled from 'styled-components';

const PlayerWrapper = styled.div`
  margin-top: 25vh;
  width: 60%;
  height: 50vh;
 
`


const Player = styled.video`
  width: 100%;
  height: 100%;
  
`
const PlayerPlaceholder = styled.div`

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 1.5rem;
`;

export { PlayerWrapper, Player, PlayerPlaceholder };