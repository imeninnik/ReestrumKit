export interface ILogMessageObject {
    level: number;
    component: string;
    env: string;

}
export interface ILogMessage extends ILogMessageObject{
    id?: string;
    message: any;
    data: any;
    time: string;
    tags: string[] | number[]

    toConsole()
}