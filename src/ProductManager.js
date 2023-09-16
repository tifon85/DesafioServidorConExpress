
import fs from 'fs'

class ProductManager {
    constructor(path){
        this.path=path
    }

    //función para agregar un producto a los ya existentes
    addProducts = async (title, description, price, thumbnail, code, stock) => {
        try {
            //VALIDACIONES
            if(!title || !description || !price || !thumbnail || !code || !stock){
                return "TODOS LOS CAMPOS SON OBLIGATORIOS"
            }
            const products = await this.getProducts()
            const yaEsta = products.find(item => item.code==code)
            if(yaEsta){
                return "YA EXISTE UN PRODUCTO CON ESE CODIGO REGISTRADO"
            }else{
                const product = {title, description, price, thumbnail, code, stock}
                if(products.length == 0){
                    product.id=1
                }else{
                    product.id=products[products.length-1].id + 1
                }
                const addedProducts=[...products,product]
                //await fs.promises.writeFile(this.path, JSON.stringify(addedProducts, null,'\t'))
                await this.updateFile(addedProducts)
                return "PRODUCTO AGREGADO"
            }
        }catch(error){
            return error
        }
    }

    //función para obtener todos los productos existentes
    getProducts = async () => {
        try{
            if(fs.existsSync(this.path)){
                const dataProducts = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(dataProducts)
            }else{
                //await fs.promises.writeFile(this.path, '[]', 'utf-8')
                await this.updateFile([])
                return []
            }
        }catch(error){
            return error
        }
    }

    //función para obtener un producto indicado por ID
    getProductByID = async (id) => {
        try{
            const products = await this.getProducts()
            const product = products.find(item => item.id==id)
            if(product){
                return product
            }else{
                return "NO EXISTE EL PRODUCTO BUSCADO"
            }
        }catch(error){
            return error
        }
    }

    //función para actualizar producto indicado por ID
    updateProduct = async (id, updatedProduct) => {
        try{
            let products = await this.getProducts()
            let index = products.findIndex(product => product.id == id)
            try{
                if(index === -1){
                    return 'No se encontró el producto a actualizar'
                }
                products[index] = { ...updatedProduct, id: products[index].id }
                //await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
                await this.updateFile(products)
                return 'Producto actualizado en la base de datos'
            }catch (error){
                return error
            }
        }catch(error){
            return error
        }
    }

    //función para eliminar producto indicado por ID
    deleteProduct = async (id) => {
        try{
            const products = await this.getProducts()
            const product = products.find(item => item.id==id)
            if(product){
                const filterProducts = products.filter(product => product.id!=id)
                //await fs.promises.writeFile(this.path, JSON.stringify(filterProducts, null,'\t'))
                await this.updateFile(filterProducts)
                return "PRODUCTO ELIMINADO"
            }else{
                return "NO EXISTE EL PRODUCTO A ELIMINAR"
            }
        }catch(error){
            return error
        }
    }

    //función para actualizar archivo JSON
    updateFile = async (products) => {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
    }

}

export default ProductManager

/*test = async () => {
    const managerProductos = new ProductManager('./products.json')
    console.log(await managerProductos.getProducts())
    console.log(await managerProductos.getProductByID(5))
    console.log(await managerProductos.deleteProduct(5))
    console.log(await managerProductos.addProducts('asd5', 'asd5', '2.34', 'asd5', 'asd4', 13))
    console.log(await managerProductos.updateProduct(3, {title: 'asd2', description: 'dsa2', price: '14.43', thumbnail: 'ert2', code: 'qwa2', stock: 24} ))
}

test()*/

