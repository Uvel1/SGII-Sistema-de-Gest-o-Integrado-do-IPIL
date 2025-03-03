import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Schema, ValidationError, string } from "yup";

type TProperty = 'body' | 'header' | 'params' | 'query';

type TGetSchema = <T>(schema: Schema<T>) => Schema<T>;

type TAllSchemas = Record<TProperty, Schema<any>>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas((schema) => schema);
    const errorsResult: Record<string, Record<string, string>> = {};

    // Validação de cada schema
    Object.entries(schemas).forEach(([key, schema]) => {
        try {
            schema.validateSync(req[key as TProperty], { abortEarly: false });
        } catch (err) {
            const yupError = err as ValidationError;
            const errors: Record<string, string> = {};

            yupError.inner.forEach((error) => {
                if (error.path === undefined) return;
                errors[error.path] = error.message;
            });

            errorsResult[key] = errors;
        }
    });

    // Se houver erros, retorna resposta com erro
    if (Object.entries(errorsResult).length === 0) {
        return next();
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
        return;
    }
};
