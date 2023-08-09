import { FC, RefObject, memo, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

export const ListItem: FC<{
  children: string;
  viewPortRef: RefObject<HTMLDivElement>;
}> = memo(({ children, viewPortRef }) => {
  const liRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);

  useEffect(() => {
    let options = {
      root: viewPortRef.current,
      rootMargin: "200px",
      threshold: 1.0,
    };
    const callback = (entries: any) => {
      requestAnimationFrame(() => setIsIntersecting(entries[0].isIntersecting));
    };
    let observer = new IntersectionObserver(callback, options);
    if (liRef.current) {
      observer.observe(liRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [viewPortRef]);

  return (
    <Container ref={liRef}>
      {isIntersecting && <StyledItem>{children}</StyledItem>}
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
