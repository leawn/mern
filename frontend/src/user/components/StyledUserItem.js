import styled from 'styled-components';

export const StyledUserItem = styled.li`
  margin: 1rem;
  width: calc(45% - 2rem);
  min-width: 17.5rem;
  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    padding: 1rem;
    color: white;
    background: #292929;
    &:hover,
    &:active {
      background: #ffd900;
    }
  }
  &:hover h2,
  &:active h2,
  &:hover h3,
  &:active h3 {
    color: #292929;
  }
`;

export const StyledUserItemContent = styled.div`
  padding: 0;
`;

export const StyledUserItemImage = styled.div`
  width: 4rem;
  height: 4rem;
  margin-right: 1rem;
`;

export const StyledUserItemInfo = styled.div`
  h2 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: normal;
    color: #ffd900;
  }
  h3 {
    margin: 0;
  }
`;