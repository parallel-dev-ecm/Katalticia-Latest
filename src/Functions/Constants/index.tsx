import React, { ChangeEvent } from "react";

export const handleChange =
  (setStateFunc: React.Dispatch<React.SetStateAction<string>>) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    setStateFunc(e.target.value);
  };

export const getIdByClave = (clave: string, sqlQuery: () => void) => {
  
};
