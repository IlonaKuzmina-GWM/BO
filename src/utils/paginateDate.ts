export const paginateData = (data: any[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    return data.slice(startIndex, startIndex + limit);
  };