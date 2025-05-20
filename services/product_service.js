const product_repository = require('../repositories/product_repository')
const { Op } = require('sequelize');
const { cloudinary } = require('../utils/cloudinary');

function extractPublicId(url) {
    try {
        const parts = url.split('/');
        const fileWithExtension = parts[parts.length - 1];
        const publicId = fileWithExtension.split('.')[0];
        return 'products/' + publicId;
    } catch (e) {
        return null;
    }
}

class ProductService {

    async createProduct(data, files) {
        const {
            name, price, disc_price, description, quantity, categoryId, brandId, productFeatures
        } = data;

        const finalDiscPrice = disc_price ? Number(disc_price) : null;
        const product = await product_repository.createProduct({
            name, price, disc_price: finalDiscPrice, description, quantity, categoryId, brandId
        });

        if (files?.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];

            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                if (!file.mimetype.startsWith('image')) {
                    throw new Error('Один із файлів не є зображенням');
                }

                const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'products',
                });

                await product_repository.addProductImage({
                    productId: product.id,
                    img: uploadResponse.secure_url,
                    isPreview: i === Number(data.previewImageIndex)
                });
            }
        }

        if (productFeatures) {
            const features = JSON.parse(productFeatures);
            const featurePromises = features.map(feature =>
                product_repository.addProductFeature({
                    name: feature.name,
                    description: feature.description,
                    productId: product.id
                })
            );

            await Promise.all(featurePromises);
        }

        return product;
    }
    async deleteProduct(id) {
        const product = await product_repository.getProduct(id);

        if (!product) {
            throw new Error("Товару не існує");
        }

        const images = product.images || [];

        const deletePromises = images.map(image => {
            const publicId = extractPublicId(image.img);
            if (publicId) {
                return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            }
            return Promise.resolve();
        });

        await Promise.all(deletePromises);

        await product_repository.deleteProduct(id);
    }
    async getAllProducts(query) {
        const { brandId, categoryId } = query;
        const limit = Number(query.limit) || 12;
        const page = Number(query.page) || 1;
        const offset = page * limit - limit;

        let filter = {};
        if (brandId) filter.brandId = brandId;

        if (categoryId) {
            const subcategoryIds = await product_repository.getSubcategories(categoryId);
            filter.categoryId = { [Op.in]: [categoryId, ...subcategoryIds] };
        }

        const result = await product_repository.getAllProducts(filter, limit, offset);

        const enrichedProducts = result.rows.map(product => {
            const reviews = product.reviews || [];
            const ratings = reviews.map(r => r.rate);
            const avgRating = ratings.length
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : 0;

            return {
                ...product.toJSON(),
                averageRating: parseFloat(avgRating.toFixed(2)),
            };
        });

        return {
            count: result.count,
            rows: enrichedProducts
        };
    }
    async getProductsByIds(ids) {
        const products = await product_repository.getProductsByIds(ids);

        return products.map(product => {
            const reviews = product.reviews || [];
            const ratings = reviews.map(r => r.rate);
            const avgRating = ratings.length
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : 0;

            return {
                ...product.toJSON(),
                averageRating: parseFloat(avgRating.toFixed(2)),
            };
        });
    }

    async getProduct(id) {
        try {
            const product = await product_repository.getProduct(id);

            if (!product) {
                throw new Error("Товар не знайдено");
            }

            // Обчислюємо середній рейтинг продукту
            const ratings = product.reviews.map(r => r.rate);
            const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

            return {
                ...product.toJSON(),
                averageRating: parseFloat(avgRating.toFixed(2)),
            };
        } catch (error) {
            throw new Error("Помилка при отриманні продукту: " + error.message);
        }
    }
    async changeProduct(id, data, files) {
        const product = await product_repository.getProduct(id);
        if (!product) throw new Error("Товар не знайдено");

        const {
            oldImages,
            productFeatures,
            previewImageIndex,
            images,
            ...productFields
        } = data;

        // Оновлюємо поля товару
        await product_repository.updateProductFields(id, productFields);

        // Видаляємо старі зображення, якщо їх немає в новому списку
        if (oldImages) {
            const oldImgs = JSON.parse(oldImages);
            const currentImgs = await product_repository.getProductImages(id);

            // Видаляємо зображення з БД, яких більше немає
            for (const img of currentImgs) {
                if (!oldImgs.find(o => o.img === img.img)) {
                    const publicId = extractPublicId(img.img);
                    if (publicId) {
                        try {
                            await cloudinary.uploader.destroy(publicId);
                        } catch (e) {
                            console.warn("Cloudinary delete failed:", publicId);
                        }
                    }
                    await product_repository.deleteProductImage(img.id);
                }
            }

            // Оновлюємо статус головного фото для всіх зображень
            await product_repository.clearPreviewFlags(id);

            // Оновлюємо головне фото
            const preview = oldImgs.find(img => img.isPreview);
            if (preview) {
                const currentImgs = await product_repository.getProductImages(id);
                const previewImage = currentImgs.find(img => img.img === preview.img);
                if (previewImage) {
                    await product_repository.setPreviewImageById(previewImage.id);
                }
            }
        }

        // Додаємо нові зображення
        if (files?.images) {
            const imagesArray = Array.isArray(files.images) ? files.images : [files.images];

            const previewFileIndex = Number(previewImageIndex) - (oldImages ? JSON.parse(oldImages).length : 0);

            for (let i = 0; i < imagesArray.length; i++) {
                const file = imagesArray[i];
                if (!file.mimetype.startsWith('image')) {
                    throw new Error('Один із файлів не є зображенням');
                }

                const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'products',
                });

                const isPreview = i === previewFileIndex;
                await product_repository.addProductImage({
                    productId: id,
                    img: uploadResponse.secure_url,
                    isPreview: isPreview
                });
            }
        }


        // Оновлюємо характеристики
        if (productFeatures) {
            const parsed = JSON.parse(productFeatures);
            await product_repository.replaceProductFeatures(id, parsed);
        }

        return product_repository.getProduct(id);
    }
    async searchProductByName(query) {
        const { name, limit = 12, page = 1 } = query
        const offset = page * limit - limit
        return await product_repository.searchByName(name, limit, offset)

    }
    async getProductReviews(productId) {
        const product = await product_repository.getProduct(productId)
        if (!product) {
            throw new Error("Товар не знайдено")
        }
        const reviews = await product_repository.getProductReviews(productId)
        console.log(reviews)
        return reviews
    }
    async createProductReview(userId, productId, data) {
        const product = await product_repository.getProduct(productId)
        console.log(data);
        if (!product) {
            throw new Error("Товар не знайдено")
        }
        const hasReviewed = await product_repository.hasUserReviewedProduct(userId, productId)
        if (hasReviewed) {
            throw new Error("Ви вже залишали відгук для цього товару")
        }
        const { rate, comment } = data
        if (!rate) {
            throw new Error("Оцінка товару обов'язкова для залишення відгуку")
        }
        if (rate > 5 || rate < 1) {
            throw new Error("Оцінка товару обов'язкова (1-5)")
        }
        return await product_repository.createProductReview({ userId, productId, rate, comment })
    }
    async deleteProductReview(userId, reviewId) {
        const review = await product_repository.getReviewById(reviewId)
        if (!review) {
            throw new Error("Відгук не знайдено")
        }
        if (userId !== review.userId) {
            throw new Error("Недостатньо прав для видалення чужого відгуку")
        }
        return await product_repository.deleteProductReview(review)
    }
    async findProductByReviewId(reviewId) {
        return await product_repository.findProductByReviewId(reviewId)
    }
}

module.exports = new ProductService();