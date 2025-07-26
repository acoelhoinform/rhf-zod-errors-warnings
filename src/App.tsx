import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema";
import NameInput from "./NameInput";
import { WarningsProviderWithSchema } from "./WarningsProviderWithSchema";

export default function App() {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit", // only show errors on submit
    defaultValues: {
      name: "",
      age: 0,
    },
  });

  return (
    <FormProvider {...methods}>
      <WarningsProviderWithSchema schema={formSchema}>
        <form onSubmit={methods.handleSubmit(console.log)}>
          <NameInput />
          <div>
            <label>Age:</label>
            <input
              type="number"
              {...methods.register("age", { valueAsNumber: true })}
            />
            {/* {methods.formState.errors.age && (
              <p style={{ color: "red" }}>
                {methods.formState.errors.age.message}
              </p>
            )} */}
          </div>
          <button type="submit">Submit</button>
        </form>
      </WarningsProviderWithSchema>
    </FormProvider>
  );
}
