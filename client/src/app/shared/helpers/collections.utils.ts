export function shuffleCollection<T>(items: T[]): T[] {
  const itemsCopied = [...items];
  const shuffledItems = [];

  while (itemsCopied.length > 0) {
    const element = itemsCopied.popRandom();
    if (element) {
      shuffledItems.push(element);
    }
  }

  return shuffledItems;
}
