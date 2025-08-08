import { FieldPath, FieldValues, FormState, UseFormReturn } from "react-hook-form";
import { RSErrorOption, RSFieldErrors } from "./Errors";

export type UseRSFormSetError<TFieldValues extends FieldValues> = (name: FieldPath<TFieldValues> | `root.${string}` | 'root', error: RSErrorOption, options?: {
    shouldFocus: boolean;
}) => void;

export type RSFormState<TFieldValues extends FieldValues> =
  FormState<TFieldValues> & {
    errors: RSFieldErrors<TFieldValues>;
  };

export type UseRSFormStateReturn<TFieldValues extends FieldValues> =
  RSFormState<TFieldValues>;

export type UseRSFormReturn<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = UseFormReturn<TFieldValues, TContext, TTransformedValues> & {
  setError: UseRSFormSetError<TFieldValues>;
  formState: RSFormState<TFieldValues>;
}

export type RSFormProviderProps<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = {
    children: React.ReactNode | React.ReactNode[];
} & UseRSFormReturn<TFieldValues, TContext, TTransformedValues>;