const {Post, Bookmarks} = require('../models/models')

class BookmarksRepository{
    async getBookmarks(userId){
        const bookmarks = await Bookmarks.findAndCountAll({ where: { userId }});
        if (!bookmarks) {
            throw new Error("Збережені пости не знайдено");
        }
        return bookmarks
    }
    async addPost(userId, postId){
        const post = await Post.findByPk(postId)
        if(!post){
            throw new Error("Пост не знайдено")
        }
        const existingBookmark = await Bookmarks.findOne({where:{userId, postId}})
        if(existingBookmark){
            throw new Error("Пост вже збережено")
        }
        return await Bookmarks.create({userId, postId})
    }
    async removePost(userId, postId){
        const post = await Post.findByPk(postId)
        if(!post){
            throw new Error("Пост не знайдено")
        }
        const bookmark = await Bookmarks.findOne({where:{userId, postId}})
        if(!bookmark){
            throw new Error("Пост не знайдено в ваших збережених")
        }
        return await Bookmarks.destroy({ where: { userId, postId } });
    }
    async clearBookmarks(userId){
        await Bookmarks.destroy({ where: { userId }});
    }
}

module.exports = new BookmarksRepository()