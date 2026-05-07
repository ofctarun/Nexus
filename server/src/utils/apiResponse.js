/**
 * Standardized API response format.
 */
export const apiResponse = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

export const successResponse = (res, data, message = 'Success') => {
  return res.status(200).json({ message, ...data });
};

export const createdResponse = (res, data, message = 'Created successfully') => {
  return res.status(201).json({ message, ...data });
};

export const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};
