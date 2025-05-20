const ApiError = require('../errors/ApiError')
const user_service = require('../services/user_service')
const { createJWT } = require('../utils/jwt')
const { cloudinary } = require('../utils/cloudinary');

class UserController {
    async registration(req, res, next) {
        try {
            const jwt_token = await user_service.registerUser(req.body)
            return res.json({ jwt_token })
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async login(req, res, next) {
        try {
            const jwt_token = await user_service.loginUser(req.body)
            return res.json({ jwt_token })
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }
    async check_token(req, res, next) {
        try {
            const jwt_token = createJWT(req.user.id, req.user.email, req.user.role)
            res.json({ jwt_token })
        }
        catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getUserProfile(req, res, next) {
        try {
            const userId = req.user.id
            const user = await user_service.getUserById(userId)

            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено' });
            }

            const profileData = {
                name: user.name,
                lastname: user.lastname,
                phone: user.phone,
                email: user.email,
                delivery_info: user.delivery_info,
                img: user.img
            };

            res.status(200).json(profileData);
        }
        catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const users = await user_service.getAllUsers()
            res.status(200).json(users);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async editUserProfile(req, res, next) {
        try {
            const userId = req.user.id
            const profile = await user_service.changeUserProfile(userId, req.body, req.files)
            res.status(200).json(profile);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async getDefaultAvatars(req, res) {
        try {
            const result = await cloudinary.search
                .expression('folder:users/default')
                .sort_by('public_id', 'asc')
                .max_results(30)
                .execute();

            const urls = result.resources.map(file => file.secure_url);
            return res.json(urls);
        } catch (error) {
            console.error('Помилка отримання дефолтних аватарів:', error);
            return res.status(500).json({ message: 'Не вдалося отримати аватари' });
        }
    }
}

module.exports = new UserController()