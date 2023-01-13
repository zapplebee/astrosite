import { FC, useLayoutEffect, useReducer } from "react";
import type { MarkdownHeading } from "astro";

export const ChapterNav: FC<{ headings: Array<MarkdownHeading> }> = ({
  headings,
}) => {
  type Action = {
    h1: Element;
    h2: Element | null;
    element: Element;
    viz: boolean;
  };

  type State = Map<Element, Map<Element, boolean>>;

  const [viz, setViz] = useReducer(
    (state: State, action: Action) => {
      const newMapEntries = [...state.entries()];

      const h1 = state.get(action.h1) ?? new Map();
      h1.set(action.element, action.viz);

      newMapEntries.push([action.h1, h1]);

      if (action.h2) {
        const h2 = state.get(action.h2) ?? new Map();
        h2.set(action.element, action.viz);
        newMapEntries.push([action.h2, h2]);
      }

      const newState = new Map(newMapEntries);
      return newState;
    },
    headings,
    (h) =>
      new Map(
        h.map((e) => [
          document.querySelector(`h${e.depth}#${e.slug}`) as Element,
          new Map(),
        ])
      )
  );

  useLayoutEffect(() => {
    const childs = [...document.querySelectorAll(".prose > *")];

    let h1Ref: Element;
    let h2Ref: Element | null = null;

    let foo: Array<[Element, { h1Ref: Element; h2Ref: Element | null }]> = [];

    for (const x of childs) {
      if (x.tagName === "H1") {
        h1Ref = x;
        h2Ref = null;
      }
      if (x.tagName === "H2") {
        h2Ref = x;
      }
      // @ts-ignore
      foo.push([x, { h1Ref, h2Ref }]);
    }

    const elMap = new Map<Element, { h1Ref: Element; h2Ref: Element | null }>(
      foo
    );

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const e = elMap.get(entry.target) as {
          h1Ref: Element;
          h2Ref: Element | null;
        };
        setViz({
          element: entry.target,
          h1: e.h1Ref,
          h2: e.h2Ref,
          viz: entry.isIntersecting,
        });
      });
    };

    const observer = new IntersectionObserver(callback);

    [...elMap.keys()].forEach((e) => {
      observer.observe(e);
    });

    return observer.disconnect;
  }, []);

  const vizMap = Object.fromEntries(
    [...viz.entries()].map(([k, v]) => {
      const isVis = [...v.values()].reduce((a, b) => {
        return a || b;
      }, false);
      return [`${k?.tagName}-${k?.id}`, isVis];
    })
  );

  return (
    <div
      className="fixed top-0 bg-black text-white w-64 p-4"
      style={{
        zIndex: "2",
        paddingTop: "calc(2rem + var(--top-nav-h))",
        height: "100vh",
      }}
    >
      <ul>
        {headings.map((e, i) => (
          <li
            key={`${e.slug}-${i}`}
            className={"mb-8"}
            style={{
              opacity: vizMap[`H${e.depth}-${e.slug}`] ? 1 : 0.6,
            }}
          >
            <a href={`#${e.slug}`}>{e.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
