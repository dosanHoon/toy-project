import { FC, cloneElement, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

interface ListProps {
  items: string[];
  width?: number;
  height?: number;
  itemHeight?: number;
  children: React.ReactElement;
}

function getIndex(
  scrollTop: number,
  listHeight: number,
  length: number,
  viewSize: number,
  itemHeight: number
) {
  const startIndex = Math.floor((scrollTop / listHeight) * length);
  return [startIndex, startIndex + 1 + viewSize / itemHeight];
}

export const ViewPortList: FC<ListProps> = ({
  items,
  width,
  height,
  itemHeight = 200,
  children,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const viewPortRef = useRef<HTMLDivElement>(null);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.style.height = itemHeight * items.length + "px";
    }
  }, []);

  const setIndex = (scrollTop: number) => {
    if (listRef.current) {
      const listHeight = listRef.current.clientHeight;
      const [startIndex, endIndex] = getIndex(
        scrollTop,
        listHeight,
        items.length,
        viewPortRef.current?.clientHeight || 0,
        itemHeight || 0
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
    <Container ref={viewPortRef} width={width} height={height}>
      <StyledList ref={listRef}>
        {items.slice(startIndex, endIndex).map((item, index) => (
          <StyledItem
            key={item}
            style={{ transform: `translateY(${startIndex * itemHeight}px)` }}
          >
            {cloneElement(children, {
              style: { height: itemHeight },
              children: item,
            })}
          </StyledItem>
        ))}
      </StyledList>
    </Container>
  );
};

const Container = styled.div<{ width?: number; height?: number }>`
    height: ${({ height }) => (height ? `${height}px` : "100vh")};
    width: ${({ width }) => (width ? `${width}px` : "100%")};
    overflow-y: scroll;
    background-color: black;
}`;

const StyledList = styled.ul`
  position: relative;
  margin: 0;
  width: 100%;
`;

const StyledItem = styled.li`
  position: relative;
`;
