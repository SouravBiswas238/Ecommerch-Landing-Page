// Curated high-resolution Unsplash food images by category / product name
export const getProductImage = (product) => {
  const name = (product.name || "").toLowerCase();
  const category = (product.attributes?.category || "").toLowerCase();

  if (name.includes("chicken"))
    return "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80";
  if (name.includes("coffee") || name.includes("latte") || name.includes("espresso")) {
    if (name.includes("ice") || name.includes("cold"))
      return "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&auto=format&fit=crop&q=80";
    return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80";
  }
  if (name.includes("tea"))
    return "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&auto=format&fit=crop&q=80";
  if (name.includes("smoothie"))
    return "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80";
  if (name.includes("boosta"))
    return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80";
  if (name.includes("cake") || name.includes("fudge"))
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
  if (name.includes("burger"))
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";
  if (name.includes("sandwich") || name.includes("panini") || name.includes("toast"))
    return "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80";
  if (name.includes("fries") || name.includes("sides"))
    return "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80";
  if (name.includes("salad"))
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";

  if (category.includes("cold"))
    return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80";
  if (category.includes("hot"))
    return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80";
  if (category.includes("done") || category.includes("order"))
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80";
  if (category.includes("side"))
    return "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80";
  if (category.includes("lunch"))
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
  if (category.includes("cake"))
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
  if (category.includes("sand"))
    return "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80";
  if (category.includes("bev"))
    return "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80";

  return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80";
};

// Returns a list of all image URLs for a product (cover_photo first, then images array, then fallback)
export const getProductImages = (product) => {
  if (!product) return [];
  const list = [];

  if (
    product.cover_photo &&
    typeof product.cover_photo === "string" &&
    product.cover_photo.trim() !== ""
  ) {
    list.push(product.cover_photo);
  }

  if (Array.isArray(product.images) && product.images?.length > 0) {
    product.images.forEach((img) => {
      let url = "";
      if (typeof img === "string" && img.trim() !== "") url = img;
      else if (img && typeof img === "object" && img.url) url = img.url;
      else if (img && typeof img === "object" && img.image_url) url = img.image_url;
      if (url && !list.includes(url)) list.push(url);
    });
  }

  if (list.length === 0) list.push(getProductImage(product));
  return list;
};

// Returns a single cover photo for product card display
export const getSingleProductImage = (product) => {
  if (!product)
    return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80";
  if (
    product.cover_photo &&
    typeof product.cover_photo === "string" &&
    product.cover_photo.trim() !== ""
  )
    return product.cover_photo;
  const parsed = getProductImages(product);
  if (parsed && parsed.length > 0) return parsed[0];
  return getProductImage(product);
};
