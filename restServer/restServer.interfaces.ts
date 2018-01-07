export interface IRestRulesBase {
    restRules:IRestRule[];
}
export interface IRestRule {
    description?:string;
    method: string;
    basePath?:string;
    path:string;
    controller: Function
}

export interface IRestServerOptions {
    port?: number;
    apiPath?: string;
    apiVersion?: string;
    basePathToRESTFolder?: string;
}