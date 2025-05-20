const {Author} = require('../models/models')

class AuthorRepository{
    async createAuthor(name, lastname, occupation, workplace, sity){
        return await Author.create({name, lastname, occupation, workplace, sity})
    }
    async editAuthor(id, data){
        const author = await Author.findByPk(id)
        const {name, lastname} = data
        if (name && name !== author.name) {
            const existingAuthor = await Author.findOne({ 
                where: { name, lastname:author.lastname} 
            });
            if (existingAuthor) {
                throw new Error(`Користувач ${name} ${author.lastname} вже існує`);
            }
        }
    
        if (lastname && lastname !== author.lastname) {
            const existingAuthor = await Author.findOne({ 
                where: { name: author.name, lastname} 
            });
            if (existingAuthor) {
                throw new Error(`Користувач ${author.name} ${lastname} вже існує`);
            }
        }
        Object.assign(author, data);
        return await author.save();
    }
    async deleteAuthor(id){
        const author = await Author.findByPk(id)
        return await author.destroy()
    }
    async getAuthorById(id){
        return await Author.findByPk(id)
    }
    async getAllAuthors(){
        return await Author.findAndCountAll()
    }
    async findAuthorByNameLastname(name, lastname){
        return await Author.findOne({where:{name, lastname}})
    }
}

module.exports = new AuthorRepository();