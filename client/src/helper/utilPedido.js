export const handleInputNumerico = (inputValue, inputName) => {
  const maxFieldLengths = { telefono: 9, dni: 8 };
  const maxLength = maxFieldLengths[inputName] || 50;
  let valorLimitado = inputValue.replace(/[^0-9]/g, "");
  if (
    inputName === "telefono" &&
    valorLimitado.length > 0 &&
    valorLimitado[0] !== "9"
  ) {
    valorLimitado = "9" + valorLimitado;
  }
  valorLimitado = valorLimitado.slice(0, maxLength);
  return valorLimitado;
};

export const handleInputLetras = (inputValue, inputName) => {
  const maxLength = 50;
  const soloLetras = inputValue.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
  const valorLimitado = soloLetras.slice(0, maxLength);
  return valorLimitado;
};

export const addFechaDelivery = (date, days) => {
  const result = new Date(date);
  while (days > 0) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() >= 1 && result.getDay() <= 5) {
      days--;
    }
  }
  return result;
};
export const generateLocalidadOptions = () => {
  return [
    { value: "0", label: "Seleccione una localidad de Comas" },
    { value: "Trapiche", label: "Trapiche" },
    { value: "Belaunde oeste", label: "Belaunde oeste" },
    { value: "Collique cuarta a mas", label: "Collique, 4ta a más" },
    { value: "Ubr El Parral", label: "Ubr. El Parral" },
    { value: "Ubr San Agustín", label: "Ubr. San Agustín" },
    { value: "Alborada", label: "Alborada" },
    { value: "San Felipe", label: "San Felipe" },
    { value: "Mallplaza Comas", label: "Mallplaza Comas" },
    { value: "Collique hasta tercera", label: "Collique, hasta 3ra" },
    { value: "Año Nuevo", label: "Año Nuevo" },
    { value: "Belaunde Este", label: "Belaunde Este" },
    { value: "Plaza de Armas", label: "Plaza de Armas" },
  ];
};
