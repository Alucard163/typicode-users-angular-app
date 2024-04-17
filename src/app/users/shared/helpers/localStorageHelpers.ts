export const parseJSON = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON string', error);
    throw error;
  }
}

export const stringifyJSON = (data: unknown): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying data', error);
    throw error;
  }
};
