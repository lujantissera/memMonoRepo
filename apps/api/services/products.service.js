// simula base de datos de productos
let products = [
    { id: 1, name: 'sillon 1', price: 100, color: 'rojo' },
    { id: 2, name: 'sillon 2', price: 200, color: 'azul' },
    { id: 3, name: 'sillon 3', price: 300, color: 'verde' },
];

let nextId = 4;


// listar todos los productos
const listProducts = () => {
    return products;
};


// obtener un producto por id
const getProductById = (id) =>  
    { return products.find(product => product.id === id);
    };

// crear un nuevo producto
const createProduct = (product) => {
    const newProduct = { id: nextId++, ...product };
    products.push(newProduct);
    return newProduct;
};

// actualizar un producto
const updateProduct = (id, product) => {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        products[index] = { id, ...product };
        return products[index];
    }
    return null;
};

// eliminar un producto
const deleteProduct = (id) => {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        return products.splice(index, 1);
    }
    return null;
};

module.exports = {
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};