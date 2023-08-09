import { FC } from "react";
import { ListItem } from "./ListItem";

interface ListProps {
  items: string[];
}

export const List: FC<ListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item}>{item}</ListItem>
      ))}
    </ul>
  );
};
