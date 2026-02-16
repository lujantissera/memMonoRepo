const {
    listProducts,
    getProductById,
    createProduct: createProductService,
    updateProduct,
    deleteProduct
} = require('../services/products.service');

// listar todos los productos 
const getProducts = (req, res) => {
    const data = listProducts();
    res.status(200).json(data);
    
};

// obtener un producto por id
const getProduct = (req, res) => {
    const  id  = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
    }

    const product = getProductById(id); 
    res.status(200).json(product);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(product);
};

// crear un nuevo producto
const createProduct = (req, res) => {
    const product = createProductService(req.body);
    res.status(201).json(product);
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
};