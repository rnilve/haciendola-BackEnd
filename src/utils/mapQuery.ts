export function mapQuery(query: string, data: Record<string, unknown>) {
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (query.includes('insert')) {
    const queryFields = fields.map((field) => `${field}`).join(', ');
    const queryValues = values.map((value) => evaluateValue(value)).join(', ');
    return query
      .replace('{fields}', queryFields)
      .replace('{values}', queryValues);
  }

  if (query.includes('update')) {
    const queryFields = fields
      .map(
        (field) => `${field} = ${evaluateValue(values[fields.indexOf(field)])}`
      )
      .join(', ');
    return query.replace('{fields}', queryFields);
  }

  return query;
}

function evaluateValue(value: unknown) {
  if (value != null && value != undefined) return `'${value}'`;
  return null;
}

export function mapUpdateQuery(query: string, data: Record<string, unknown>) {
  const fields = Object.entries(data)
    .map(([key, value]) => `${value ? `${key} = '${value}' ` : null}`)
    .join(', ');

  return query.replace('{fields}', fields);
}
