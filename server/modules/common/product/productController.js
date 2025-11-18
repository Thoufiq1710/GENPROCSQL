import productService from "./productService.js";

const productController = {
  insertOrUpdateProduct: async (req, res) => {
    try {
      const productArray = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      for (const [index, prod] of productArray.entries()) {
        const {
          productId,
          productName,
          productDescription,
          projectId,
          createdUser,
          status,
          inactiveReason,
        } = prod;

        // ✅ Validation
        if (!productName || !projectId) {
          errors.push({
            index,
            error: "Product Name and Project ID are required.",
            product: prod,
          });
          continue;
        }

        try {
          // ✅ Call Service layer (executes SP)
          const result = await productService.insertOrUpdateProduct({
            productId: productId || 0,
            productName: productName.trim(),
            productDescription: productDescription || "",
            projectId,
            createdUser,
            status,
            inactiveReason: inactiveReason || "",
          });

          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed.",
              product: prod,
            });
            continue;
          }

          results.push({ ...prod, dbMessage: result.message });
        } catch (err) {
          errors.push({
            index,
            error: err.message,
            product: prod,
          });
        }
      }

      // ✅ Final Response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All products inserted/updated successfully."
            : "Partial success — some inserts failed.",
        summary: {
          total: productArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedProducts: results,
        failedProducts: errors,
      });
    } catch (err) {
      console.error("❌ insertOrUpdateProduct Controller Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error occurred during product insertion.",
        error: err.message,
      });
    }
  },
};

export default productController;
