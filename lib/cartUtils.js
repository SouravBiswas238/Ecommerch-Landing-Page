/**
 * Generates a unique cart line-item key based on product ID and selected options.
 * Products with the same ID but different modifiers get separate line items.
 */
export const generateCustomKey = (productId, selectedOptions) => {
  const parts = [productId];
  if (selectedOptions) {
    Object.keys(selectedOptions)
      .sort()
      .forEach((groupKey) => {
        const selectedMods = selectedOptions[groupKey] || [];
        const modNames = selectedMods
          .map((m) => m.name)
          .sort()
          .join(",");
        if (modNames) parts.push(`${groupKey}:${modNames}`);
      });
  }
  return parts.join("|");
};
