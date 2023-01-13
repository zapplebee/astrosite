import type { ReactNode } from "react";

export function Foo({ children }: { children: ReactNode }): ReactNode {
  return (
    <h1
      style={{
        WebkitTextFillColor: "transparent",
        background:
          "linear-gradient(12deg,#fba000,#232300,#f20000,#02e2dd,#02b3dd)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: "3rem",
        textTransform: "uppercase",
      }}
    >
      <span className="">{children}</span>
    </h1>
  );
}
