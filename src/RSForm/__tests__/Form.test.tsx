import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import user from "@testing-library/user-event";
import { z } from "zod/v3";
import { RSZodResolver } from "../RSZodResolver";
import { expect, test, vi } from "vitest";
import { useRSForm } from "../useRSForm";

const schema = z.object({
  username: z.string().nonempty({ message: "username field is required" }),
  password: z.string().nonempty({ message: "password field is required" }),
});

const TestComponent = ({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof schema>) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRSForm({
    resolver: RSZodResolver(schema), // Useful to check TypeScript regressions
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} />
      {errors.username && <span role="alert">{errors.username.message}</span>}

      <input {...register("password")} />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      <button type="submit">submit</button>
    </form>
  );
};

test("form's validation with Zod and TypeScript's integration", async () => {
  const handleSubmit = vi.fn();
  render(<TestComponent onSubmit={handleSubmit} />);

  expect(screen.queryAllByRole("alert")).toHaveLength(0);

  await user.click(screen.getByText(/submit/i));

  expect(screen.getByText(/username field is required/i)).toBeInTheDocument();
  expect(screen.getByText(/password field is required/i)).toBeInTheDocument();
  expect(handleSubmit).not.toHaveBeenCalled();
});
