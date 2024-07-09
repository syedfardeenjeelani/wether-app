import { Children, createContext, useState } from "react";

export const allData = createContext();

import React from "react";

const Context = (props) => {
  const [data, setData] = useState("data");

  return (
    <allData.Provider value={[data, setData]}>{props.children}</allData.Provider>
  );
};

export default Context;
