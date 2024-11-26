export const formattedValueForMoney = (value: string): string => {
    let formattedValue = value.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
    if (formattedValue.includes(".")) {
      const parts = formattedValue.split(".");
      if (parts.length > 2) {
        formattedValue = parts[0] + "." + parts.slice(1).join("");
      }
      formattedValue = parts[0] + "." + parts[1].slice(0, 2);
    }
    return formattedValue;
  };
