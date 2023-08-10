import { FC, memo } from "react";
import { styled } from "styled-components";

export const ListItem: FC<{
  children: string;
  top: number;
}> = memo(({ children, top }) => {
  return (
    <Container style={{ transform: `translateY(${top}px)` }}>
      <StyledItem>{children}</StyledItem>
    </Container>
  );
});

const Container = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
`;

const StyledItem = styled.li`
  position: relative;
  height: 200px;
  background-color: white;
  border: 1px solid black;
`;
