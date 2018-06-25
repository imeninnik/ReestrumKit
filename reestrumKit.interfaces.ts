import * as DALI from './dal/DAL.interfaces';

enum dbEngines {
    'pg',
    'mongo'
}

interface IDefaultDBRecord {
    id?: string | number;
    createAt: string;
    updatedAt: string
}

export interface IRKSettings {
    dal?: any;
    qal:any;
    logger:any;
    restServer:any;
    restClient:any;
}

export interface IRKSettings_DAL {
    dbEngine: dbEngines | any;
    pathToModels: string;
    settings: any | DALI.IDALSettings
}

export interface IBasicUser extends IDefaultDBRecord {
    verified: boolean;
    personId?: string;
    cryptoId?: string;
    roles: string[],
    password: string;
    lastLogOn?: string;
    lastLogOut?: string;
}