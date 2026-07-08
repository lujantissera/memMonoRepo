const ApiError = require('../utils/apiError');

const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD';

// consulta una API pública gratuita de tipos de cambio (base USD)
const getExchangeRate = async (targetCurrency) => {
  let response;
  try {
    response = await fetch(EXCHANGE_RATE_API_URL);
  } catch (err) {
    throw new ApiError(502, 'No se pudo contactar al servicio de tipo de cambio');
  }

  if (!response.ok) {
    throw new ApiError(502, 'El servicio de tipo de cambio respondió con un error');
  }

  const data = await response.json();
  const rate = data.rates && data.rates[targetCurrency];

  if (!rate) {
    throw new ApiError(400, `Moneda no soportada: ${targetCurrency}`);
  }

  return { rate, base: 'USD', target: targetCurrency, updatedAt: data.time_last_update_utc };
};

module.exports = { getExchangeRate };
