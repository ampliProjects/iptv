import styled from "styled-components";

const SubGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 100vh;
  background-color: #000000ff;
  align-items: left;
  overflow-x: auto;
 

   button {
    margin: 5px;
    padding: 5px;
    background-color: #d8e518ff;
    border: none;
    cursor: pointer;
    color: #000;
    font-size: 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
`;

export {SubGroup}