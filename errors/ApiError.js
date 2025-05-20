class ApiError extends Error{
    constructor(status, message){
        super();
        this.status=status;
        this.message=message;
    }
    //некоректний запит клієнту
    static badRequest(message){
        return new ApiError(400, message)
    }
    //проблема на сервері
    static internal(message){
        return new ApiError(500, message)
    }
    //ресурс не знайдено
    static notFound(message){
        return new ApiError(404, message)
    }
    //недостатньо прав
    static forbidden(message){
        return new ApiError(403, message)
    }
    //не авторизований користувач
    static unauthorized(message){
        return new ApiError(401, message)
    }
}

module.exports = ApiError