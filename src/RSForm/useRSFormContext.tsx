import React from "react";
import { FieldValues, useFormContext, FormProvider } from "react-hook-form";
import { RSFormProviderProps, UseRSFormReturn } from "./Form";

export const useRSFormContext = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues
>(): UseRSFormReturn<TFieldValues, TContext, TTransformedValues> => {
  // You can extend this to add custom logic or types
  return useFormContext();
};

export const RSFormProvider = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues
>({
  children,
  ...methods
}: RSFormProviderProps<TFieldValues, TContext, TTransformedValues>) => {
  return <FormProvider {...methods}>{children}</FormProvider>;
};
