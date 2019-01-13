export function getPKeys(modelPKeys:string| string[]|null): null | string[] | any {

    if (!modelPKeys) return null;

    if (typeof modelPKeys === 'string') return [modelPKeys];

    if (Array.isArray(modelPKeys)) return modelPKeys;

    return console.error('Unhandled case for pkeys. They are not null, not string and not an array');
}

export function prepareWhereStatmentForUpsert(modelPKeys:string[], tableName: string, model:any):string {

    let output:string = '';

    modelPKeys.forEach((pKey,i) => {
        let keyValue = (typeof pKey === 'string')
            ? `'${model[pKey]}'`
            :   model[pKey];
        output += `${tableName}.${pKey} = ${keyValue}`;

        if (i !== modelPKeys.length - 1) output += ' AND ';
    });


    return output;
}

/**
 * Return ON CONFLICT query
 * @param pKeys
 * @param updateQuery
 * @param model
 */
export function getOnConflictWhileUpsert(pKeys: any[], updateQuery, model) {
    // if it is sequetioal id, then just add new
    if (model.constructor.pKeyType.indexOf('serial') > -1) return 'DO NOTHING';

    // normaly update by every primary keys
    return `(${[...pKeys]}) DO UPDATE SET ${updateQuery}`
}

