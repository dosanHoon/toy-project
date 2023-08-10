import { FC, memo } from "react";
import { styled } from "styled-components";

export const ListItem: FC<{
  children: string;
}> = memo(({ children }) => {
  return (
    <Container>
      <StyledItem>{children}</StyledItem>
    </Container>
  );
});

const Container = styled.div`
  width: 200px;
  height: 200px;
`;

const StyledItem = styled.li`
  height: 200px;
  background-color: white;
  border: 1px solid black;
`;
