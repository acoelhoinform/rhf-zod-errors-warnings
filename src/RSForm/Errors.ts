import { ErrorOption, FieldError, FieldErrors, FieldValues } from "react-hook-form";
import { Severity } from "./types";

export type RSErrorOption =  ErrorOption & {
    params?: {
      severity?: Severity;
    }
  }

export type RSFieldError = FieldError & {
    params?: {
      severity?: Severity;
    }
  };

export type RSFieldErrors<TFieldValues extends FieldValues> =
  FieldErrors<TFieldValues> & {
    params?: {
      severity?: Severity;
    }
  };