import { FC, useEffect, useRef } from "react";
import { ListItem } from "./ListItem";
import { styled } from "styled-components";

interface ListProps {
  items: string[];
}

export const List: FC<ListProps> = ({ items }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const viewPortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.style.height = listRef.current.clientHeight + "px";
    }
  }, []);
  return (
    <Container ref={viewPortRef}>
      <StyledList ref={listRef}>
        {items.map((item) => (
          <ListItem key={item} viewPortRef={viewPortRef}>
            {item}
          </ListItem>
        ))}
      </StyledList>
    </Container>
  );
};

const Container = styled.div`
    height: 100vh;
    width: 100%;
    overflow-y: scroll;
    background-color: black;
}`;

const StyledList = styled.ul`
  margin: 0;
  width: 100%;
`;
