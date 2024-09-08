import Input from "@/components/UI/Input";
import { CSV, InputField } from "@/types";
import { ChangeEvent, FormEvent, useState } from "react";
import DashButton from "../DashButton";
import { formattedValueForMoney } from "../Functions/formattedValueForMoney";

interface GenerationFormProps {
  onSubmit: (data: CSV) => void;
}

const GenerationForm = ({ onSubmit }: GenerationFormProps) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<CSV>({
    name: "",
    surname: "",
    id: "",
    iban: "",
    amount: "",
    details: "",
    created: "",
  });

  const generateCSVInputFields: InputField[] = [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter name",
      inputWidth: "150px",
    },
    {
      label: "Surname",
      name: "surname",
      type: "text",
      placeholder: "Surname",
      inputWidth: "150px",
    },
    {
      label: "ID",
      name: "id",
      type: "text",
      placeholder: "Enter ID",
      inputWidth: "150px",
    },
    {
      label: "IBAN",
      name: "iban",
      type: "text",
      placeholder: "Enter IBAN",
      inputWidth: "165px",
    },
    {
      label: "Amount",
      name: "amount",
      type: "text",
      placeholder: "Enter amount",
      inputWidth: "150px",
    },
    {
      label: "Details",
      name: "details",
      type: "text",
      placeholder: "Enter payment details",
      inputWidth: "250px",
    },
  ];

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    let formattedValue = value;
  
    if (name === "amount") {
      formattedValue = formattedValueForMoney(value);
    }
  
    const formatDate = (date: Date) => {
      const pad = (num: number) => (num < 10 ? `0${num}` : num);
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
      created: formatDate(new Date()),
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const errors = Object.entries(formData)
      .filter(([key, value]) => value.trim() === "")
      .map(([key]) => key);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    onSubmit(formData);

    setFormData({
      name: "",
      surname: "",
      id: "",
      iban: "",
      amount: "",
      details: "",
      created: "",
    });

    setSubmitted(true);
    setValidationErrors([]);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);

    console.log("Form Data:", formData);
  };

  return (
    <form
      className="flex flex-row flex-wrap gap-[16px]"
      onSubmit={handleSubmit}
    >
      {generateCSVInputFields.map((field: InputField) => (
        <Input
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          value={formData[field.name as keyof typeof formData]}
          placeholder={field.placeholder}
          onChange={handleInputChange}
          isInvalid={validationErrors.includes(field.name)}
          width={field.inputWidth}
        />
      ))}
      <div className="h-[40px] self-end ml-[16px]">
        <DashButton name="Generate" type={"filled"} disabled={submitted} />
      </div>
    </form>
  );
};

export default GenerationForm;