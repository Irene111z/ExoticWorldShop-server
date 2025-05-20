const ApiError = require('../errors/ApiError')
const category_service = require('../services/category_service')

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const category = await category_service.createCategory(req.body)
            return res.status(201).json(category)
        }
        catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deleteCategory(req, res, next) {
        try {
            await category_service.deleteCategory(req.params.id)
            res.status(200).json({ message: 'Категорія була видалена' });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async getAllCategories(req, res, next) {

        try {
            const categories = await category_service.getAllCategories()
            if (!categories || categories.length === 0) {
                return next(ApiError.notFound('Категорії не знайдені'));
            }
            res.status(200).json(categories);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async getSubcategories(req, res, next) {
        try {
            const { parentId } = req.params;
            const subcategories = await category_service.getSubcategoriesByParentId(parentId);

            if (!subcategories || subcategories.length === 0) {
                return next(ApiError.notFound('Підкатегорії не знайдені'));
            }
            res.status(200).json(subcategories);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async updateCategory(req, res, next) {
        try {
            const { id } = req.params
            const { name, newParentId } = req.body
            const category = await category_service.updateCategory(id, name, newParentId);
            res.status(200).json(category);
        }
        catch (error) {
            next(ApiError.internal(error.message));
        }
    }


}

module.exports = new CategoryController()