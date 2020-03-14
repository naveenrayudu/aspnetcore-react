export const combineDateTime = (date: Date, time: Date): Date => {
    const timestring = time.getHours() + ":" + time.getMinutes() + ":00";
    const dateString = `${date.getFullYear}-${date.getMonth() + 1}-${date.getDate()}`;

    return new Date(dateString + ' ' + timestring);
}