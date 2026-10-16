/**
 * @fileoverview Paso 2 del Embudo de Pago (`customer_validation`):
 * Validación exhaustiva de datos de cliente, sanitización y dirección de envío internacional.
 */

export const SUPPORTED_COUNTRIES = {
  US: { name: 'United States', postalRegex: /^\d{5}(-\d{4})?$/ },
  ES: { name: 'España', postalRegex: /^\d{5}$/ },
  MX: { name: 'México', postalRegex: /^\d{5}$/ },
  CA: { name: 'Canada', postalRegex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/ },
  GB: { name: 'United Kingdom', postalRegex: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/ },
  CO: { name: 'Colombia', postalRegex: /^\d{6}$/ },
  CL: { name: 'Chile', postalRegex: /^\d{7}$/ },
  AR: { name: 'Argentina', postalRegex: /^([A-Za-z]\d{4}[A-Za-z]{3}|\d{4})$/ }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com'
]);

/**
 * Sanitiza un texto eliminando etiquetas HTML/scripts maliciosos.
 * @param {string} val
 */
function sanitizeText(val) {
  return String(val || '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Valida los datos del cliente y su dirección de envío (Paso 2).
 * @param {object} customerInput
 * @param {string} customerInput.email
 * @param {string} customerInput.fullName
 * @param {string} customerInput.phone
 * @param {object} customerInput.shippingAddress
 * @param {string} customerInput.shippingAddress.addressLine1
 * @param {string} [customerInput.shippingAddress.addressLine2]
 * @param {string} customerInput.shippingAddress.city
 * @param {string} customerInput.shippingAddress.state
 * @param {string} customerInput.shippingAddress.postalCode
 * @param {string} customerInput.shippingAddress.countryCode
 */
export function validateCustomerAndAddress(customerInput = {}) {
  const errors = [];

  const email = sanitizeText(customerInput.email).toLowerCase();
  const fullName = sanitizeText(customerInput.fullName);
  const rawPhone = sanitizeText(customerInput.phone);
  const address = customerInput.shippingAddress || {};

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({
      field: 'email',
      code: 'INVALID_EMAIL',
      message: 'El correo electrónico no tiene un formato válido.'
    });
  } else {
    const domain = email.split('@')[1];
    if (DISPOSABLE_DOMAINS.has(domain)) {
      errors.push({
        field: 'email',
        code: 'DISPOSABLE_EMAIL_BLOCKED',
        message: 'No se permiten correos temporales o desechables por prevención de fraude.'
      });
    }
  }

  const nameParts = fullName.split(/\s+/).filter(Boolean);
  if (nameParts.length < 2 || fullName.length < 4) {
    errors.push({
      field: 'fullName',
      code: 'INVALID_FULL_NAME',
      message: 'Debe proporcionar nombre y apellido completos.'
    });
  }

  const digitsOnlyPhone = rawPhone.replace(/[^\d+]/g, '');
  if (digitsOnlyPhone.replace(/\D/g, '').length < 8 || digitsOnlyPhone.replace(/\D/g, '').length > 15) {
    errors.push({
      field: 'phone',
      code: 'INVALID_PHONE',
      message: 'El teléfono debe contener entre 8 y 15 dígitos para notificaciones de entrega.'
    });
  }

  const addressLine1 = sanitizeText(address.addressLine1);
  const addressLine2 = sanitizeText(address.addressLine2);
  const city = sanitizeText(address.city);
  const state = sanitizeText(address.state);
  const postalCode = sanitizeText(address.postalCode).toUpperCase();
  const countryCode = sanitizeText(address.countryCode).toUpperCase();

  if (!addressLine1 || addressLine1.length < 5) {
    errors.push({
      field: 'shippingAddress.addressLine1',
      code: 'INVALID_ADDRESS_LINE1',
      message: 'La dirección principal (calle y número) es obligatoria.'
    });
  }

  // Bloqueo de PO Boxes si el proveedor requiere entrega directa con firma
  if (/^(p\.?\s*o\.?\s*box|apartado postal)/i.test(addressLine1)) {
    errors.push({
      field: 'shippingAddress.addressLine1',
      code: 'PO_BOX_NOT_SUPPORTED',
      message: 'Los envíos exprés de dropshipping no admiten apartados postales (PO Box).'
    });
  }

  if (!city || city.length < 2) {
    errors.push({
      field: 'shippingAddress.city',
      code: 'INVALID_CITY',
      message: 'La ciudad de envío es obligatoria.'
    });
  }

  if (!state || state.length < 2) {
    errors.push({
      field: 'shippingAddress.state',
      code: 'INVALID_STATE',
      message: 'El estado o provincia es obligatorio.'
    });
  }

  const countryConfig = SUPPORTED_COUNTRIES[countryCode];
  if (!countryConfig) {
    errors.push({
      field: 'shippingAddress.countryCode',
      code: 'UNSUPPORTED_COUNTRY',
      message: `El país "${countryCode || 'vacío'}" no está habilitado en las rutas de envío rápido de Zendrop.`
    });
  } else if (!postalCode || !countryConfig.postalRegex.test(postalCode)) {
    errors.push({
      field: 'shippingAddress.postalCode',
      code: 'INVALID_POSTAL_CODE',
      message: `El código postal "${postalCode}" no es válido para ${countryConfig.name} (${countryCode}).`
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      step: 'customer_validation',
      errorCode: errors[0].code,
      errorMessage: errors[0].message,
      errors
    };
  }

  return {
    valid: true,
    step: 'customer_validation',
    customer: {
      email,
      fullName,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      phone: digitsOnlyPhone,
      shippingAddress: {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        countryCode,
        countryName: countryConfig.name
      }
    }
  };
}
