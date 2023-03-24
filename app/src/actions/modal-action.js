export default function modalAction(node) {
  let fns = [];
  if (document.body.style.overflow !== "hidden") {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fns = [...fns, () => (document.body.style.overflow = original)];
  }
  return {
    destroy: () => fns.map((fn) => fn())
  };
}