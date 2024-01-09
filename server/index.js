import express from 'express'
import cors from 'cors' 
import mongoose from 'mongoose'
import router from './routes/posts.js'

const app= express()
const port = 8989

app.use(cors())
app.use(express.json())
app.use('/users',router)
const connectionString = "mongodb://localhost:27017/Form"

mongoose.connect(connectionString,{useNewUrlParser:true,useUnifiedTopology: true })
.then(()=>(console.log(`Server running on port ${port}`)))
.catch((error)=>console.log(error.message))



app.listen(`${port}`)