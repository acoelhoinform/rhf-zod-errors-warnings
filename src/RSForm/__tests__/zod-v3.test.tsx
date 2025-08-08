import { SubmitHandler } from "react-hook-form";
import { z } from "zod/v3";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { RSZodResolver } from "../RSZodResolver";
import { fields, invalidData, schema, validData } from "./__fixtures__/data-v3";
import { RSResolver } from "../Resolver";
import { useRSForm } from "../useRSForm";
import { render } from "@testing-library/react";

const shouldUseNativeValidation = false;

describe("RSZodResolver", () => {
  it("should return values from RSZodResolver when validation pass & raw=true", async () => {
    const parseAsyncSpy = vi.spyOn(schema, "parseAsync");

    const result = await RSZodResolver(schema, undefined, {
      raw: true,
    })(validData, undefined, {
      fields,
      shouldUseNativeValidation,
    });

    expect(parseAsyncSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ errors: {}, values: validData });
  });

  it("should return parsed values from RSZodResolver with `mode: sync` when validation pass", async () => {
    const parseSpy = vi.spyOn(schema, "parse");
    const parseAsyncSpy = vi.spyOn(schema, "parseAsync");

    const result = await RSZodResolver(schema, undefined, {
      mode: "sync",
    })(validData, undefined, { fields, shouldUseNativeValidation });

    expect(parseSpy).toHaveBeenCalledTimes(1);
    expect(parseAsyncSpy).not.toHaveBeenCalled();
    expect(result.errors).toEqual({});
    expect(result).toMatchSnapshot();
  });

  it("should return a single error from RSZodResolver when validation fails", async () => {
    const result = await RSZodResolver(schema)(invalidData, undefined, {
      fields,
      shouldUseNativeValidation,
    });

    expect(result).toMatchSnapshot();
  });

  it("should return a single error from RSZodResolver with `mode: sync` when validation fails", async () => {
    const parseSpy = vi.spyOn(schema, "parse");
    const parseAsyncSpy = vi.spyOn(schema, "parseAsync");

    const result = await RSZodResolver(schema, undefined, {
      mode: "sync",
    })(invalidData, undefined, { fields, shouldUseNativeValidation });

    expect(parseSpy).toHaveBeenCalledTimes(1);
    expect(parseAsyncSpy).not.toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it("should return all the errors from RSZodResolver when validation fails with `validateAllFieldCriteria` set to true", async () => {
    const result = await RSZodResolver(schema)(invalidData, undefined, {
      fields,
      criteriaMode: "all",
      shouldUseNativeValidation,
    });

    expect(result).toMatchSnapshot();
  });

  it("should return all the errors from RSZodResolver when validation fails with `validateAllFieldCriteria` set to true and `mode: sync`", async () => {
    const result = await RSZodResolver(schema, undefined, { mode: "sync" })(
      invalidData,
      undefined,
      {
        fields,
        criteriaMode: "all",
        shouldUseNativeValidation,
      }
    );

    expect(result).toMatchSnapshot();
  });

  it("should throw any error unrelated to Zod", async () => {
    const schemaWithCustomError = schema.refine(() => {
      throw Error("custom error");
    });
    const promise = RSZodResolver(schemaWithCustomError)(validData, undefined, {
      fields,
      shouldUseNativeValidation,
    });

    await expect(promise).rejects.toThrow("custom error");
  });

  it("should enforce parse params type signature", async () => {
    const resolver = RSZodResolver(schema, {
      async: true,
      path: ["asdf", 1234],
      errorMap(iss, ctx) {
        iss.path;
        iss.code;
        iss.path;
        ctx.data;
        ctx.defaultError;
        return { message: "asdf" };
      },
    });

    resolver;
  });

  /**
   * Type inference tests
   */
  it("should correctly infer the output type from a zod schema", () => {
    const resolver = RSZodResolver(z.object({ id: z.number() }));

    expectTypeOf(resolver).toEqualTypeOf<
      RSResolver<{ id: number }, unknown, { id: number }>
    >();
  });

  it("should correctly infer the output type from a zod schema using a transform", () => {
    const resolver = RSZodResolver(
      z.object({ id: z.number().transform((val) => String(val)) })
    );

    expectTypeOf(resolver).toEqualTypeOf<
      RSResolver<{ id: number }, unknown, { id: string }>
    >();
  });

  it("should correctly infer the output type from a Zod schema for the handleSubmit function in useForm", () => {
    // Test component to use the hook in a valid context
    const TestComponent = () => {
      const schema = z.object({ id: z.number() });
      const form = useRSForm({
        resolver: RSZodResolver(schema),
      });

      // Type assertions only, no runtime effect
      expectTypeOf(form.watch("id")).toEqualTypeOf<number>();
      expectTypeOf(form.handleSubmit)
        .parameter(0)
        .toEqualTypeOf<SubmitHandler<z.output<typeof schema>>>();
      return null;
    };

    render(<TestComponent />);
  });

  it("should correctly infer the output type from a Zod schema with a transform for the handleSubmit function in useForm", () => {
    const TestComponent = () => {
      const schema = z.object({
        id: z.number().transform((val) => String(val)),
      });
      const form = useRSForm({
        resolver: RSZodResolver(schema),
      });

      // Type assertions only, no runtime effect
      expectTypeOf(form.watch("id")).toEqualTypeOf<number>();
      expectTypeOf(form.handleSubmit)
        .parameter(0)
        .toEqualTypeOf<SubmitHandler<z.output<typeof schema>>>();
      return null;
    };

    render(<TestComponent />);
  });
});
