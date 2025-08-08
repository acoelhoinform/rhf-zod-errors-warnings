import React from "react";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";
import { RSZodResolver } from "../RSZodResolver";
import { expect, test, vi } from "vitest";

const USERNAME_REQUIRED_MESSAGE = "username field is required";
const PASSWORD_REQUIRED_MESSAGE = "password field is required";

const schema = z.object({
  username: z.string().nonempty({ message: USERNAME_REQUIRED_MESSAGE }),
  password: z.string().nonempty({ message: PASSWORD_REQUIRED_MESSAGE }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => void;
}

const TestComponent = ({ onSubmit }: Readonly<Props>) => {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: RSZodResolver(schema),
    shouldUseNativeValidation: true,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="username" />

      <input {...register("password")} placeholder="password" />

      <button type="submit">submit</button>
    </form>
  );
};

test("form's native validation with Zod", async () => {
  const handleSubmit = vi.fn();
  render(<TestComponent onSubmit={handleSubmit} />);

  // username
  let usernameField = screen.getByPlaceholderText(
    /username/i
  ) as HTMLInputElement;
  expect(usernameField.validity.valid).toBe(true);
  expect(usernameField.validationMessage).toBe("");

  // password
  let passwordField = screen.getByPlaceholderText(
    /password/i
  ) as HTMLInputElement;
  expect(passwordField.validity.valid).toBe(true);
  expect(passwordField.validationMessage).toBe("");

  await user.click(screen.getByText(/submit/i));

  // username
  usernameField = screen.getByPlaceholderText(/username/i);
  expect(usernameField.validity.valid).toBe(false);
  expect(usernameField.validationMessage).toBe(USERNAME_REQUIRED_MESSAGE);

  // password
  passwordField = screen.getByPlaceholderText(/password/i);
  expect(passwordField.validity.valid).toBe(false);
  expect(passwordField.validationMessage).toBe(PASSWORD_REQUIRED_MESSAGE);

  await user.type(screen.getByPlaceholderText(/username/i), "joe");
  await user.type(screen.getByPlaceholderText(/password/i), "password");

  // username
  usernameField = screen.getByPlaceholderText(/username/i);
  expect(usernameField.validity.valid).toBe(true);
  expect(usernameField.validationMessage).toBe("");

  // password
  passwordField = screen.getByPlaceholderText(/password/i);
  expect(passwordField.validity.valid).toBe(true);
  expect(passwordField.validationMessage).toBe("");
});
