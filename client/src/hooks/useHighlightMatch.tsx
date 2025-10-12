import { useMemo } from "react";

function useHighlightMatch(
  text?: string,
  search?: string,
  highlightColor: string = "#ffe58f"
) {
  return useMemo(() => {
    if (!text) return <></>;
    if (!search) return <>{text}</>;

    try {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${safeSearch})`, "gi");
      const parts = text.split(regex);

      return (
        <>
          {parts.map((part, i) =>
            regex.test(part) ? (
              <mark key={i} style={{ backgroundColor: highlightColor, padding: 0 }}>
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return <>{text}</>;
    }
  }, [text, search, highlightColor]);
}
export default useHighlightMatch;