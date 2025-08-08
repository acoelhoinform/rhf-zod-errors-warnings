import {
  Controller,
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { UseRSFormStateReturn } from "./Form";
import { RSFieldError } from "./Errors";

export type RSControllerFieldState = ControllerFieldState & {
  error?: RSFieldError;
};

export type RSControllerProps<TFieldValues extends FieldValues = FieldValues> =
  Omit<ControllerProps<TFieldValues>, "render"> & {
    render: ({
      field,
      fieldState,
      formState,
    }: {
      field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
      fieldState: RSControllerFieldState;
      formState: UseRSFormStateReturn<TFieldValues>;
    }) => React.ReactElement;
  };

export const RSController = <TFieldValues extends FieldValues = FieldValues>(
  props: RSControllerProps<TFieldValues>
) => {
  return (
    <Controller
      control={props.control}
      name={props.name}
      defaultValue={props.defaultValue}
      render={(innerProps) => {
        const { field, fieldState, formState } = innerProps;
        return props.render({
          field,
          fieldState,
          formState,
        });
      }}
    />
  );
};
