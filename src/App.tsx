import React from "react";
import { formSchema } from "./schema";
import NameInput from "./NameInput";
import { InputNumber } from "primereact/inputnumber";
import { RSController, useRSForm, RSFormProvider } from "./RSForm/index";
import { RSZodResolver } from "./RSForm/RSZodResolver";

export default function App() {
  const methods = useRSForm({
    resolver: RSZodResolver(formSchema),
    mode: "onSubmit", // only show errors on submit
    defaultValues: {
      name: "",
      age: 0,
    },
  });

  return (
    <RSFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <NameInput />
        <RSController
          name="age"
          control={methods.control}
          render={({ field, fieldState, formState }) => {
            const error = fieldState.error;
            return (
              <div>
                <label htmlFor="age">Age:</label>
                <InputNumber
                  {...field}
                  id={field.name}
                  value={
                    typeof field.value === "number"
                      ? field.value
                      : field.value
                      ? Number(field.value)
                      : null
                  }
                  onChange={(e) => field.onChange(e.value)} // handle value change
                />
                {typeof error?.message === "string" && (
                  <p
                    style={{
                      color:
                        error?.params?.severity === "warning"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {error.message}
                  </p>
                )}
              </div>
            );
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </RSFormProvider>
  );
}
