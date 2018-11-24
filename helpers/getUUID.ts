import * as u from 'uuid';

export function getUUID(version='v4', stringForV5?, namespaceForV5?) {
    return u[version](stringForV5, namespaceForV5);
}