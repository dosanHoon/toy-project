import { FC, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

//return to parent component
// const callback = (entries: IntersectionObserverEntry[]) => {

export const ListItem: FC<{ children: string }> = ({ children }) => {
  const liRef = useRef<HTMLLIElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    const callback = (entries: any) => {
      console.log("entries", entries);
      setIsIntersecting(entries[0].isIntersecting);
    };
    let observer = new IntersectionObserver(callback, options);
    if (liRef.current) {
      observer.observe(liRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>{isIntersecting && <StyledItem ref={liRef}>{children}</StyledItem>}</>
  );
};

const StyledItem = styled.li`
  height: 100px;
  width: 100px;
  background-color: white;
  border: 1px solid black;
`;
