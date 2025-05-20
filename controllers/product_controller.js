const product_service = require('../services/product_service')
const ApiError = require('../errors/ApiError')

class ProductController {

    async createProduct(req, res, next) {
        try {
            const product = await product_service.createProduct(req.body, req.files);
            return res.status(200).json(product);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
    async deleteProduct(req, res, next) {
        try {
            await product_service.deleteProduct(req.params.id)
            return res.status(200).json({ message: 'Товар успішно видалено' })
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getAllProducts(req, res, next) {
        try {
            const products = await product_service.getAllProducts(req.query)
            return res.status(200).json(products)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getProductsByIds(req, res, next) {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: 'Невірний список ID' });
            }
            const products = await product_service.getProductsByIds(ids);
            return res.json(products);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getProduct(req, res, next) {
        try {
            const product = await product_service.getProduct(req.params.id)
            return res.status(200).json(product)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async changeProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { body, files } = req;
            console.log('req.files:', req.files)
            const product = await product_service.changeProduct(id, body, files);
            return res.status(200).json(product)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async searchProductByName(req, res, next) {
        try {
            const products = await product_service.searchProductByName(req.query)
            return res.status(200).json(products)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getProductReviews(req, res, next) {
        try {
            const reviews = await product_service.getProductReviews(req.params.id)
            return res.status(200).json(reviews)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async createProductReview(req, res, next) {
        try {
            await product_service.createProductReview(req.user.id, req.params.id, req.body)
            return res.status(201).json({ message: 'Відгук успішно додано' });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async deleteProductReview(req, res, next) {
        try {
            const product = await product_service.findProductByReviewId(req.params.id)

            await product_service.deleteProductReview(req.user.id, req.params.id)

            const reviews = await product_service.getProductReviews(product.id)
            return res.status(200).json(reviews)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new ProductController()