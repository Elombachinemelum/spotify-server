export function constructNotFoundMessage(
  entityName: string | number | null,
): string {
  return entityName ? `${entityName} does not exist.` : 'Not Found';
}
