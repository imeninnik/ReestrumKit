export default class Settings {
    private _env: string;

    constructor(private _settingsModel, env?) {
        this._env = env || process.env.NODE_ENV;
    }

    public async get(name, _env?) {
        const env = _env || this._env || 'dev';
        const settings = await this._getByNameAndEnv(name, env);

        if (settings) return settings;

        const tryDefaultSettings = await this._getByNameAndEnv(name, 'default');

        return tryDefaultSettings;
    }

    public async set(name, value, _env?) {
        const env = _env || this._env || 'default';
        return this._settingsModel.findOneAndUpdate({name, env},{value}, {upsert:true, setDefaultsOnInsert: true} ).catch(e => {
            console.error(`Settings set error for name: "${name}", env: "${env}", value: "${value}" \n`, e);
        });
    }

    public seed(name, valueObj) {
        const promiseArr = [];
        for (const env in valueObj) {
            console.log(`Prepare seed data for\x1b[32m ${name}\x1b[0m in\x1b[32m ${env}\x1b[0m environment`);
            promiseArr.push( this.set(name, valueObj[env], env) );
        }

        return Promise.all(promiseArr);
    }

    public async truncate() {
        console.warn('Will TRUNCATE Settings table');
        return this._settingsModel.remove({});
    }

    private async _getByNameAndEnv(name, env, filter?):Promise<any | null> {
        const respArray = await this._settingsModel.find({name, env});
        return respArray.length ? respArray[0].value : null;
    }
}