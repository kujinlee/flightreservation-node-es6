/*
 * This function can be placed in the middleware folder,
 * Validation checking can also be done via Sequelize's beforeSave hook.
 * For example, in the reservation model:
 * Reservation.beforeSave((reservation, options) => {
 */

export const validateFields = (fieldsToUpdate, model) => {
  const validFields = Object.keys(model.getAttributes()); // Use getAttributes for Sequelize models

  for (const field of Object.keys(fieldsToUpdate)) {
    if (!validFields.includes(field)) {
      throw new Error(
        `Field mismatch: ${field} does not exist in the ${model.name} model.`
      );
    }
  }
};
