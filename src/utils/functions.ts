export function constructNotFoundMessage(
  entityName: string | number | null,
): string {
  return entityName ? `${entityName} does not exist.` : 'Not Found';
}

export const getConnectObjects = (ids: string[] = []) => {
  return ids.map((id) => ({ id }));
};

export const getUTCFormattedDate = (date?: Date): Date => {
  const workingDate: Date = date ? date : new Date();
  return new Date(
    Date.UTC(
      workingDate.getFullYear(),
      workingDate.getMonth(),
      workingDate.getDate(),
      0,
      0,
      0,
      0,
    ),
  );
};
