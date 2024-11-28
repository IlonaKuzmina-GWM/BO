export const formatXAxis = (tickItem: string) => {
    try {
      const date = new Date(tickItem);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });
    } catch (error) {
      console.error("Invalid date:", tickItem);
      return "";
    }
  };