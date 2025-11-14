import productRepo from "./productRepo.js";

const productService = {
  insertOrUpdateProduct: async (productData) => {
    try {
      const {
        productId,
        productName,
        productDescription,
        projectId,
        createdUser,
        status,
        inactiveReason,
      } = productData;

      // ✅ Call Repo Layer
      const result = await productRepo.insertOrUpdateProduct(
        productId,
        productName,
        productDescription,
        projectId,
        createdUser,
        status,
        inactiveReason
      );

      return result;
    } catch (err) {
      console.error("❌ productService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating product in Service.",
        error: err.message,
      };
    }
  },
};

export default productService;
