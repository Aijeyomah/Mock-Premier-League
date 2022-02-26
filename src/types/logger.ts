export interface IConsoleOptions {
    level: string;
    handleExceptions: boolean;
    json: boolean;
    colorize: boolean
};

export interface IFileOptions extends IConsoleOptions {
    filename: string;
    maxsize: number;
    maxFiles: number;
}

export interface IOptions {
    file: IFileOptions;
    console?: IConsoleOptions;
}

export type TLoggerMsg = {
    timestamp : string;
    level: string;
    message: string;
} 