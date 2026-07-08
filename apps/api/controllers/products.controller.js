const {
  listProducts,
  getProductById,
  createProduct: createProductService,
  updateProduct: updateProductService,
  deleteProduct: deleteProductService,
} = require('../services/products.service');
const { getExchangeRate } = require('../services/exchangeRate.service');
const ApiError = require('../utils/apiError');

// listar todos los productos
const getProducts = async (req, res) => {
  const data = await listProducts();
  res.status(200).json(data);
};

// obtener un producto por id
const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(id);
  if (!product) {
    throw new ApiError(404, 'Producto no encontrado');
  }
  res.status(200).json(product);
};

// crear un nuevo producto
const createProduct = async (req, res) => {
  const { name, price, color } = req.body;
  if (!name || typeof price !== 'number') {
    throw new ApiError(400, 'name y price (numérico) son requeridos');
  }
  const product = await createProductService({ name, price, color });
  res.status(201).json(product);
};

// actualizar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, color } = req.body;
  if (!name || typeof price !== 'number') {
    throw new ApiError(400, 'name y price (numérico) son requeridos');
  }
  const updated = await updateProductService(id, { name, price, color });
  if (!updated) {
    throw new ApiError(404, 'Producto no encontrado');
  }
  res.status(200).json(updated);
};

// eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteProductService(id);
  if (!deleted) {
    throw new ApiError(404, 'Producto no encontrado');
  }
  res.status(204).send();
};

// obtener el precio de un producto convertido a otra moneda (consumo de servicio externo)
const getProductPrice = async (req, res) => {
  const { id } = req.params;
  const currency = (req.query.currency || 'USD').toUpperCase();

  const product = await getProductById(id);
  if (!product) {
    throw new ApiError(404, 'Producto no encontrado');
  }

  const { rate, base, updatedAt } = await getExchangeRate(currency);

  res.status(200).json({
    productId: product.id,
    name: product.name,
    originalPrice: product.price,
    originalCurrency: base,
    convertedPrice: Number((product.price * rate).toFixed(2)),
    convertedCurrency: currency,
    rate,
    rateUpdatedAt: updatedAt,
  });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductPrice,
};
