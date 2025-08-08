import React, { useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RSController } from "./RSForm";

export default function NameInput() {
  const { control } = useFormContext();

  return (
    <RSController
      name="name"
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error;
        return (
          <div>
            <label htmlFor="name">Name:</label>
            <InputText id="name" {...field} />
            {typeof error?.message === "string" && (
              <p style={{ color: "red" }}>{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
