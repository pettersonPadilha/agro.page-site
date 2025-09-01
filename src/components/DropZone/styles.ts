import styled from "styled-components";

export const Container = styled.div`
  cursor: pointer;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: rgb(7, 56, 26);
  border-style: dashed;
  /* background-color: rgb(0, 120, 86); */
  color: #ffffff;
  outline: none;
  transition: border 0.24s ease-in-out;

  &.accept {
    border-color: rgb(7, 56, 26);
    color: rgb(67, 181, 129);
  }

  &.reject {
    border-color: "#DD0329";
    color: "#DD0329";
  }
`;
