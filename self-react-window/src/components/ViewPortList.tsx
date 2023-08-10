import { FC, useEffect, useRef, useState } from "react";
import { ListItem } from "./ListItem";
import { styled } from "styled-components";

interface ListProps {
  items: string[];
}

function getIndex(
  scrollTop: number,
  listHeight: number,
  length: number,
  viewSize: number
) {
  const startIndex = Math.floor((scrollTop / listHeight) * length);
  return [startIndex, startIndex + 1 + viewSize / 200];
}

export const ViewPortList: FC<ListProps> = ({ items }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const viewPortRef = useRef<HTMLDivElement>(null);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.style.height = 200 * items.length + "px";
    }
  }, []);

  const setIndex = (scrollTop: number) => {
    if (listRef.current) {
      const listHeight = listRef.current.clientHeight;
      const [startIndex, endIndex] = getIndex(
        scrollTop,
        listHeight,
        items.length,
        viewPortRef.current?.clientHeight || 0
      );

      setStartIndex(() => (startIndex > 2 ? startIndex - 2 : startIndex));
      setEndIndex(() => endIndex + 1);
    }
  };

  useEffect(() => {
    const viewPort = viewPortRef.current;
    if (viewPort) {
      const onScroll = () => {
        requestAnimationFrame(() => setIndex(viewPort?.scrollTop || 0));
      };

      viewPort.addEventListener("scroll", onScroll);

      return () => {
        viewPort.removeEventListener("scroll", onScroll);
      };
    }
  }, []);

  return (
    <Container ref={viewPortRef}>
      <StyledList ref={listRef}>
        {items.slice(startIndex, endIndex).map((item, index) => (
          <ListItem key={item} top={(startIndex + index) * 200}>
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
  position: relative;
  margin: 0;
  width: 100%;
`;
