const { Category, Product } = require('../models/models')

class CategoryRepository {
    async addCategory(data) {
        console.log('Фінальні дані для вставки:', {
            data
        });
        return await Category.create(data)
    }
    async getCategoryById(id) {
        return await Category.findByPk(id)
    }
    async getAllCategories() {
        return await Category.findAll();
    }
    async getSubcategoriesByParentId(parentId) {
        return await Category.findAll({ where: { parentId } });
    }
    async getCategoryByName(name) {
        return Category.findOne({ where: { name } });
    }
    async updateProductCategory(productId, categoryId) {
        return Product.update({ categoryId }, { where: { categoryId: productId } });
    }
    async deleteCategory(category) {
        return await category.destroy()
    }
    async updateCategory(category) {
        return await category.save();
    }
}

module.exports = new CategoryRepository()