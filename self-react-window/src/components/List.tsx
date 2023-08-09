import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ListItem } from "./ListItem";
import { styled } from "styled-components";

interface ListProps {
  items: string[];
}

export const List: FC<ListProps> = ({ items }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const viewPortRef = useRef<HTMLDivElement>(null);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  const getIndex = useCallback(
    (scrollTop: number, listHeight: number) => {
      const startIndex = Math.floor((scrollTop / listHeight) * items.length);
      const endIndex = Math.floor(
        ((scrollTop + window.innerHeight) / listHeight) * items.length
      );
      return [startIndex, endIndex];
    },
    [items]
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.style.height = 200 * items.length + "px";
    }
  }, [items]);

  useEffect(() => {
    const viewPort = viewPortRef.current;
    const listCurrent = listRef.current;
    if (viewPort) {
      viewPort.addEventListener("scroll", () => {
        if (listCurrent && viewPort) {
          const scrollTop = viewPort.scrollTop;
          const listHeight = listCurrent.clientHeight;

          const [startIndex, endIndex] = getIndex(scrollTop, listHeight);
          setStartIndex(startIndex);
          setEndIndex(endIndex);
        }
      });
    }
  }, [viewPortRef, listRef, items, setStartIndex, setEndIndex, getIndex]);

  return (
    <Container ref={viewPortRef}>
      <StyledList ref={listRef}>
        {items.map(
          (item, index) =>
            index >= startIndex &&
            index <= endIndex && (
              <ListItem key={item} viewPortRef={viewPortRef}>
                {item}
              </ListItem>
            )
        )}
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
