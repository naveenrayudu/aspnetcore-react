export const combineDateTime = (date: Date, time: Date): Date => {
  const timestring = time.getHours() + ":" + time.getMinutes() + ":00";
  const dateString = `${date.getFullYear}-${date.getMonth() +
    1}-${date.getDate()}`;

  return new Date(dateString + " " + timestring);
};

export const tryCatchBlock = async (
  successCallback: any,
  errorCallback: any
) => {
  try {
    return await successCallback();
  } catch (error) {
    return await errorCallback(error);
  }
};
