import { useFormContext } from "react-hook-form";
import { useWarnings } from "./WarningsContext";

export default function NameInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { warnings } = useWarnings();

  return (
    <div>
      <label>Name:</label>
      <input {...register("name")} />
      {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
      {!errors.name && warnings["name"] && (
        <p style={{ color: "yellow" }}>{warnings["name"]}</p>
      )}
    </div>
  );
}
