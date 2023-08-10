import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ListItem } from "./ListItem";
import { styled } from "styled-components";

interface ListProps {
  items: string[];
}

function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): T {
  let inThrottle: boolean = false;
  let lastFn: ReturnType<typeof setTimeout> | null = null;
  let lastTime: number = Date.now();

  return function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): ReturnType<T> | void {
    const context = this;

    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      if (lastFn) {
        clearTimeout(lastFn);
      }

      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, wait - (Date.now() - lastTime));
    }
  } as T;
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
      viewPort.addEventListener("scroll", () =>
        requestAnimationFrame(() => {
          if (listCurrent && viewPort) {
            const scrollTop = viewPort.scrollTop;
            const listHeight = listCurrent.clientHeight;

            const [startIndex, endIndex] = getIndex(scrollTop, listHeight);
            console.log(startIndex, endIndex);
            setStartIndex(startIndex - 2);
            setEndIndex(endIndex + 2);
          }
        })
      );
    }
  }, [viewPortRef, listRef, items, setStartIndex, setEndIndex, getIndex]);

  return (
    <Container ref={viewPortRef}>
      <StyledList ref={listRef}>
        {items
          .filter((_, index) => index >= startIndex && index <= endIndex)
          .map((item, index) => (
            <ListItem key={item}>{item}</ListItem>
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
