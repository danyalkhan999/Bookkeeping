exports.getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1]; // example: "abcxyz123.jpg"
    const publicId = filename.split(".")[0]; // remove extension
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};
