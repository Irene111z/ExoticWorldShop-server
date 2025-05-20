const user_repository = require('../repositories/user_repository')
const cart_repository = require('../repositories/cart_repository')
const { createJWT } = require('../utils/jwt')
const { cloudinary } = require('../utils/cloudinary');

class UserService {
    async registerUser(data) {
        const existingUser = await user_repository.getUserByEmail(data.email)
        if (existingUser) {
            throw new Error('Користувач з такою потштою вже зареєстрований')
        }
        const user = await user_repository.createUser(data)
        await cart_repository.createCart(user.id)
        return createJWT(user.id, user.email, user.role)
    }
    async loginUser(data) {
        const { email, password } = data
        const user = await user_repository.getUserByEmail(email)
        if (!user) {
            throw new Error(`Користувача ${email} не існує`)
        }
        let isPasswordValid = await user.validatePassword(password)
        if (!isPasswordValid) {
            throw new Error('Неправильний пароль')
        }
        return createJWT(user.id, user.email, user.role)
    }
    async getUserById(id) {
        return await user_repository.getUserById(id)
    }
    async getAllUsers() {
        return await user_repository.getAllUsers()
    }
    async changeUserProfile(id, data, files) {
        console.log(files);
        const user = await user_repository.getUserById(id);
        if (!user) {
            throw new Error(`Користувача не існує`);
        }

        // Якщо аватар дефолтний, то завантажуємо нове фото на Cloudinary
        if (user.img.startsWith('users/default')) {
            if (files && files.img) {
                const { img } = files;
                if (img.mimetype.startsWith('image')) {
                    // Завантаження на Cloudinary
                    const uploadResponse = await cloudinary.uploader.upload(img.tempFilePath, {
                        folder: 'users/custom',
                    });
                    data.img = uploadResponse.secure_url;
                } else {
                    throw new Error('Файл не є зображенням');
                }
            }
        } else if (files && files.img) {
            // Якщо аватар вже в папці custom, спочатку видаляємо старий
            const publicId = user.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`users/custom/${publicId}`);

            const { img } = files;
            if (img.mimetype.startsWith('image')) {
                // Завантажуємо новий аватар на Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(img.tempFilePath, {
                    folder: 'users/custom',
                });
                data.img = uploadResponse.secure_url;
            } else {
                throw new Error('Файл не є зображенням');
            }
        }

        // Оновлюємо дані користувача в БД
        return await user_repository.updateUserProfile(id, data);
    }

}
module.exports = new UserService()