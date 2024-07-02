export const checkIfVisible = (itemKey: string) => {
    const items = Array.from(
      document.querySelectorAll(`#text .reference${itemKey}`)
    );
    return items.some((item) => {
      const boundingRect = item.getBoundingClientRect();
      if (!boundingRect) return false;
      const notesContainer = document.querySelector("#text") as any;
      const titleSpace = 80;
      return (
        boundingRect.top >= titleSpace &&
        boundingRect.top <= (notesContainer?.offsetHeight || 0) + titleSpace
      );
    });
  };