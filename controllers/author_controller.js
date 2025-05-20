const ApiError = require('../errors/ApiError')
const author_service = require('../services/author_service')

class AuthorController{
    async createAuthor(req, res, next){
        try {
            const {name, lastname, occupation, workplace, sity} = req.body
            if(!name){
                return next(ApiError.badRequest('Поле ім\'я є обов\'язковим'))
            }
            if(!lastname){
                return next(ApiError.badRequest('Поле прізвище є обов\'язковим'))
            }
            if(!occupation){
                return next(ApiError.badRequest('Поле професія є обов\'язковим'))
            }
            if(!workplace){
                return next(ApiError.badRequest('Поле місце роботи є обов\'язковим'))
            }
            const author = await author_service.createAuthor(name, lastname, occupation, workplace, sity)
            return res.status(201).json(author)
          } 
          catch (error) {
            next(ApiError.internal(error.message));
          }
    }
    async editAuthor(req, res, next){
        try {
            const author = await author_service.editAuthor(req.params.id, req.body)
            return res.status(201).json(author)
          } 
          catch (error) {
            next(ApiError.internal(error.message));
          }
    }
    async deleteAuthor(req, res, next){
        try {
            await author_service.deleteAuthor(req.params.id)
            return res.status(201).json("Автора було видалено")
          } 
          catch (error) {
            next(ApiError.internal(error.message));
          }
    }
    async getAllAuthors(req, res, next){
        try {
            const authors = await author_service.getAllAuthors()
            return res.status(201).json(authors.rows)
          } 
          catch (error) {
            next(ApiError.internal(error.message));
          }
    }
    async getAuthorById(req, res, next){
        try {
            const author = await author_service.getAuthorById(req.params.id)
            return res.status(201).json(author)
          } 
          catch (error) {
            next(ApiError.internal(error.message));
          }
    }
}

module.exports = new AuthorController()