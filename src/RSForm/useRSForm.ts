import { FieldValues, useForm, UseFormProps } from "react-hook-form";
import { UseRSFormReturn } from "./Form";


export const useRSForm = <TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues>(
  props?: UseFormProps<TFieldValues, TContext, TTransformedValues>
): UseRSFormReturn<TFieldValues, TContext, TTransformedValues> => {
  // You can extend this to add custom logic or types
  return useForm(props);
};
