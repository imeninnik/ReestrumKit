import * as DALI from './dal/DAL.interfaces';

export interface IRKSettings {
    dal: DALI.IDALSettings | any;
    qal:any;
    logger:any;
    restServer:any;
    restClient:any;
}