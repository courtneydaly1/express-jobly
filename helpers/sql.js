const { BadRequestError } = require("../expressError");

// Function will update the data and input into SQL. If no data will throw err. The calling function can use it to make the SET clause of a SQL UPDATE statement.

// @param datatoupdate {Object} {field1; newVal, field2: newVal}
// @param jsToSql {Object} maps js-style data fields to db column names

// * @returns {Object} {sqlSetCols, dataToUpdate}
//  *
//  * @example {firstName: 'Aliya', age: 32} =>
//  *   { setCols: '"first_name"=$1, "age"=$2',
//  *     values: ['Aliya', 32] }

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
