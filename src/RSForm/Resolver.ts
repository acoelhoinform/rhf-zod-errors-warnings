import { FieldValues, ResolverOptions, ResolverSuccess } from "react-hook-form";
import { RSFieldErrors } from "./Errors";

export type RSResolverError<TFieldValues extends FieldValues = FieldValues> = {
    values: {};
    errors: RSFieldErrors<TFieldValues>;
};

export type RSResolverResult<TFieldValues extends FieldValues = FieldValues, TTransformedValues = TFieldValues> = ResolverSuccess<TTransformedValues> | RSResolverError<TFieldValues>;

export type RSResolver<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = (values: TFieldValues, context: TContext | undefined, options: ResolverOptions<TFieldValues>) => Promise<RSResolverResult<TFieldValues, TTransformedValues>> | RSResolverResult<TFieldValues, TTransformedValues>;