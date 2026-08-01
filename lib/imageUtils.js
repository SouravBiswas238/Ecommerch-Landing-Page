// Curated high-resolution Unsplash food images by category / product name
// Placeholder fallback image
export const getProductImage = (placeholderImage) => {
  return placeholderImage;
};

// Returns a list of all image URLs for a product (cover_photo first, then images array, then fallback)
export const getProductImages = (product, placeholderImage) => {
  // console.log("getProductImages called with product:", product);
  if (!product) return [placeholderImage];

  const list = [];

  if (
    product.cover_photo &&
    typeof product.cover_photo === "string" &&
    product.cover_photo?.trim() !== ""
  ) {
    list.push(product.cover_photo);
  }

  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      const url =
        typeof img === "string"
          ? img?.trim()
          : img?.image || img?.url || img?.image_url || "";

      if (url && !list.includes(url)) {
        list.push(url);
      }
    });
  }

  if (list.length === 0) {
    list.push(getProductImage(placeholderImage));
  }

  return list;
};

// Returns a single cover photo for product card display
export const getSingleProductImage = (product, placeholderImage) => {
  if (!product) return placeholderImage;

  if (
    product.cover_photo &&
    typeof product.cover_photo === "string" &&
    product.cover_photo?.trim() !== ""
  ) {
    return product.cover_photo;
  }

  const parsed = getProductImages(product, placeholderImage);

  if (parsed.length > 0) {
    return parsed[0];
  }

  return getProductImage(placeholderImage);
};
