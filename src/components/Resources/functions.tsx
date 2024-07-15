import { ChangeEvent } from "react";

export const handleChange =
  <T extends string | number>(setStateFunc: React.Dispatch<React.SetStateAction<T>>) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as T;
    setStateFunc(value);
  };
