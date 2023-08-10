import { FC, memo } from "react";
import { styled } from "styled-components";

export const ListItem: FC<{
  children: string;
  style?: React.CSSProperties;
}> = memo(({ children, style }) => {
  return (
    <Container style={style}>
      <StyledItem>{children}</StyledItem>
    </Container>
  );
});

const Container = styled.div`
  width: 200px;
`;

const StyledItem = styled.div`
  height: 100%;
  background-color: white;
  border: 1px solid black;
`;
