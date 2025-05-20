const { Product, ProductFeatures, Category, Review, ProductImage, User } = require('../models/models')
const { Op } = require("sequelize");
const sequelize = require('../database');

class ProductRepository {
    async createProduct(data) {
        return await Product.create(data);
    }
    async addProductImage({ productId, img, isPreview }) {
        return await ProductImage.create({ productId, img, isPreview });
    }
    async addProductFeature({ name, description, productId }) {
        return await ProductFeatures.create({ name, description, productId });
    }
    async deleteProduct(id) {
        const product = await Product.findByPk(id)
        if (product) {
            product.destroy()
        }
    }
    async getAllProducts(filter, limit, offset) {
        return await Product.findAndCountAll({
            where: filter,
            limit,
            offset,
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    required: false
                },
                {
                    model: Review,
                    attributes: ['rate'],
                    required: false
                }
            ]
        });
    }
    async getProductsByIds(ids) {
        return await Product.findAll({
            where: { id: { [Op.in]: ids } },
            include: [
                {
                    model: ProductImage,
                    as: 'images',
                    required: false
                },
                {
                    model: Review,
                    attributes: ['rate'],
                    required: false
                }
            ]
        });
    }
    async getProduct(id) {
        return await Product.findOne({
            where: { id },
            include: [
                { model: ProductFeatures, as: 'productFeatures' },
                { model: Review, attributes: ['rate'] },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['img', 'isPreview'],
                    required: false
                }
            ]
        });
    }
    async updateProductFields(id, fields) {
        const product = await Product.findByPk(id);
        if (!product) return null;
        Object.assign(product, fields);
        return await product.save();
    }

    async getProductImages(productId) {
        return await ProductImage.findAll({ where: { productId } });
    }

    async deleteProduct(id) {
        const t = await sequelize.transaction();

        try {
            // Видаляємо характеристики товару
            await ProductFeatures.destroy({ where: { productId: id }, transaction: t });

            // Видаляємо записи зображень з БД
            await ProductImage.destroy({ where: { productId: id }, transaction: t });

            // Видаляємо сам товар
            await Product.destroy({ where: { id }, transaction: t });

            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async clearPreviewFlags(productId) {
        return await ProductImage.update({ isPreview: false }, { where: { productId } });
    }

    async setPreviewImage(imgUrl) {
        return await ProductImage.update({ isPreview: true }, { where: { img: imgUrl } });
    }

    async addProductImage({ productId, img, isPreview }) {
        return await ProductImage.create({ productId, img, isPreview });
    }

    async replaceProductFeatures(productId, features) {
        await ProductFeatures.destroy({ where: { productId } });

        for (const f of features) {
            await ProductFeatures.create({
                name: f.name,
                description: f.description,
                productId
            });
        }
    }

    async searchByName(name, limit, offset) {
        if (!name) return { count: 0, rows: [] };
        return await Product.findAndCountAll({
            where: { name: { [Op.iLike]: `%${name}%` } },
            limit,
            offset,
        });
    }

    async getSubcategories(parentId) {
        const subcategories = await Category.findAll({ where: { parentId } });
        let ids = subcategories.map(sub => sub.id);

        for (const subcategory of subcategories) {
            const childIds = await this.getSubcategories(subcategory.id);
            ids = ids.concat(childIds);
        }

        return ids;
    }

    async deleteProductImage(imageId) {
        const image = await ProductImage.findByPk(imageId);
        if (image) {
            return await image.destroy();
        }
        throw new Error("Image not found");
    }

    async getProductReviews(productId) {
        return await Review.findAndCountAll({
            where: { productId },
            include: [{
                model: User,
                attributes: ['id', 'name', 'lastname', 'img']
            }]
        });
    }
    async createProductReview(data) {
        return await Review.create(data)
    }
    async findProductByReviewId(reviewId) {
        reviewId = Number(reviewId)
        const review = await Review.findByPk(reviewId)
        if (!review) {
            throw new Error("Відгук не знайдено")
        }
        return await Product.findOne({ where: { id: review.productId } })
    }
    async getReviewById(reviewId) {
        return await Review.findByPk(reviewId)
    }
    async deleteProductReview(review) {
        return await review.destroy()
    }
    async hasUserReviewedProduct(userId, productId) {
        return await Review.findOne({ where: { userId, productId } })
    }
    async setPreviewImageById(imageId) {
        return await ProductImage.update(
            { isPreview: true },
            { where: { id: imageId } }
        );
    }
}

module.exports = new ProductRepository()