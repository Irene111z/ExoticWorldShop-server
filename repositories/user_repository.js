const {User} = require('../models/models')

class UserRepository{
    async getUserByEmail(email){
        return await User.findOne({where:{email}})
    }
    async createUser(data){
        return await User.create(data)
    }
    async getUserById(id){
        return await User.findByPk(id)
    }
    async getAllUsers(){
        return await User.findAndCountAll({
            where: {
                role: 'user'
            },
            attributes: ['email', 'name', 'lastname', 'phone']
        })
    }
    async updateUserProfile(id, data){
        const user = await User.findByPk(id)
        const {email, phone} = data
        if (email && email !== user.email) {
            const existingEmailInDB = await User.findOne({ where: { email } });
            if (existingEmailInDB) {
                throw new Error(`Користувач з email ${email} вже існує`);
            }
        }
    
        if (phone && phone !== user.phone) {
            const existingPhoneInDB = await User.findOne({ where: { phone } });
            if (existingPhoneInDB) {
                throw new Error(`Користувач з тел. ${phone} вже існує`);
            }
        }
        Object.assign(user, data);
        return await user.save();
    }
}

module.exports = new UserRepository()