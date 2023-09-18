export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);

  const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  const month = date.toDateString().split(' ')[1];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};
