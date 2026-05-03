"use client";

import React from "react";

const App = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    {children}
    </>
  );
};

export default App;
