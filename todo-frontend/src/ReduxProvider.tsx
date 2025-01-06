// app/ReduxProvider.tsx
"use client"; // Only use this if you are directly interacting with the client-side state or hooks.

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

interface Props {
  children: ReactNode;
}

const ReduxProvider: React.FC<Props> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
