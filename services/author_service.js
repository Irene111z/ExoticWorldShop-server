const author_repository = require('../repositories/author_repository')

class AuthorService{
    async createAuthor(name, lastname, occupation, workplace, sity){
        const author = await author_repository.findAuthorByNameLastname(name, lastname)
        if(author){
            throw new Error(`Автор ${lastname} ${name} вже існує в базі.`)
        }
        return await author_repository.createAuthor(name, lastname, occupation, workplace, sity)
    }
    async editAuthor(id, data){
        const author = await author_repository.getAuthorById(id)
        if(!author){
            throw new Error("Автора не знайдено.")
        }
        return await author_repository.editAuthor(id, data)
    }
    async deleteAuthor(id){
        const author = await author_repository.getAuthorById(id)
        if(!author){
            throw new Error("Автора не знайдено.")
        }
        return await author_repository.deleteAuthor(id)
    }
    async getAllAuthors(){
        const authors = await author_repository.getAllAuthors()
        if(!authors){
            throw new Error("Жодного автора в базі не існує")
        }
        return authors
    }
    async getAuthorById(id){
        const author = await author_repository.getAuthorById(id)
        if(!author){
            throw new Error("Автора не знайдено.")
        }
        return author
    }
}

module.exports = new AuthorService();