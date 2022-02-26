
export interface IErrorValues{
    message: string;
    status?: string | number;
    name?: string;
    errors?: object
}

export interface IErrorParams{
    status: string;
    errors?: object;
    error: TerrorValue
}
 
type TerrorValue = {
    message: string
}

export interface IResponseValues{
    message: string;
    status?: string;
    code?: number | 200
    data?: object;
}

