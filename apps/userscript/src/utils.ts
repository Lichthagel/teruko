export const applyToAllConstantlyDebounced = (
  selector: (el: Element) => NodeListOf<Element>,
  callback: (el: Element) => void,
  container: Element = document.body,
  delay = 50,
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      const elements = selector(container);

      elements.forEach((el) => {
        callback(el);
      });
    }, delay);
  });

  observer.observe(container, { childList: true, subtree: true });
};
