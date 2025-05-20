const bookmarks_repository = require('../repositories/bookmarks_repository')

class BookmarksService{
    async getBookmarks(userId){
        return await bookmarks_repository.getBookmarks(userId)
    }
    async addBookmark(userId, postId){
        return await bookmarks_repository.addPost(userId, postId)
    }
    async removeBookmark(userId, postId){
        return await bookmarks_repository.removePost(userId, postId)
    }
    async clearBookmarks(userId){
        return await bookmarks_repository.clearBookmarks(userId)
    }
}

module.exports = new BookmarksService()