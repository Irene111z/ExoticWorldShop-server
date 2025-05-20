const {Brand} = require('../models/models')
const ApiError = require('../errors/ApiError')

class BrandController{
    async createBrand(req, res, next){
        const {name} = req.body
        const brandAlreadyExist = await Brand.findOne({where:{name}})
        if(brandAlreadyExist){
            return next(ApiError.badRequest("Бренд з такою назвою вже існує"))
        }
        const brand = await Brand.create({name})
        return res.json(brand)
    }
    async deleteBrand(req, res, next){
        const {id} = req.params
        try {
            const brand = await Brand.findByPk(id)
            if(!brand){
                return next(ApiError.badRequest("Бренд не знайдено"))
            }
            await brand.destroy()
            return res.status(200).json({message:"Бренд видалено"})
        } catch (error) {
            next(ApiError.badRequest(error))
        }
    }
    async getAllBrands(req, res){
        const brands = await Brand.findAll()
        return res.json(brands)
    }
}

module.exports = new BrandController()