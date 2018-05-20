import * as DALI from './dal/DAL.interfaces';

interface IDefaultDBRecord {
    id?: string | number;
    createAt: string;
    updatedAt: string
}

export interface IRKSettings {
    dal: DALI.IDALSettings | any;
    qal:any;
    logger:any;
    restServer:any;
    restClient:any;
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