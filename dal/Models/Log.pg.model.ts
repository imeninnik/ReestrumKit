import BasicModel from './_Basic.pg.model';
import DAL from "../DAL.class";


export default class Log extends BasicModel {
    protected static tableName = 'logs';
    protected static pKey = 'id';
    protected static pKeyType = 'uuid';
    protected static autoGeneratePKey = true;
    protected static trackDateAndTime = true;


    public id: string;
    public level: number;
    public component: string;
    public tags: string[];
    public env:  string;
    public message: string;
    public data: any;
    //time: Date,


    constructor(logMessage) {
        super();

        this.level = logMessage.level;
        this.component = logMessage.component;
        this.tags = logMessage.tags;
        this.env =  logMessage.env;
        this.message = logMessage.message;
        this.data = logMessage.data;


    }





}


