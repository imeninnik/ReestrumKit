export interface IDALSettings {
    client: string;
    host: string;
    port?: number;
    user: string;
    password: string;
    database: string;
    schema?: string;
    application_name?: string;
}