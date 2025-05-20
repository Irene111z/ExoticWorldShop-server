require('dotenv').config()
const express = require('express')
const sequelize = require('./database')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.json())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.resolve(__dirname, 'tmp')
}))
app.use('/api',router)

//last Middleware
app.use(errorHandler)

const start = async()=>{
    try {
        await sequelize.authenticate()  
        //await sequelize.sync() 
        await sequelize.sync({ alter: true })
        app.listen(PORT,()=>console.log(`server started on port ${PORT}`))    
    }
    catch (error) {
        console.log(error)
    }
}
start()


