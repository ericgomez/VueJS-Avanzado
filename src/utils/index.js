// Contador de propiedades del objecto
const countObjectProperties = (obj) => {
  if (typeof obj === 'object') {
    // retornamos el total de llaves para hacer un conteo
    return Object.keys(obj).length;
  }
  return 0;
};

export default countObjectProperties;
