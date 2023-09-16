import express from 'express'
import productManager from './ProductManager.js'

const app = express()
const port = 8080

app.use(express.urlencoded({extended:true}))

const prodManager = new productManager('./products.json')

app.listen(port,(error)=>{
    if(error) console.log(error)
    console.log("Servidor escuchando en el puerto: ", port)
})

app.get('/products', async (req,res) => {
    let limit = req.query.limit
    try{
        const products = await prodManager.getProducts()
        limit ? res.send(products.filter(product => product.id <= limit)) : res.send(products)
    }catch(error){
        res.send(error)
    }
})

app.get('/products/:pid', async (req,res) => {
    let pid = req.params.pid
    try{
        const product = await prodManager.getProductByID(pid)
        res.send(product)
    }catch(error){
        res.send(error)
    }
})