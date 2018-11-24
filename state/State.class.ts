export default class State {
    constructor(private _rkInstance) {

    }

    public async set(key, value) {
        const state = new this._rkInstance.Models.States();
        state.key = key;
        state.value = value;
        return state.save();
    }

    public async get(key) {
        const modelData = await this._rkInstance.Models.States.findOne({key});
        return modelData ? modelData.value : null;
    }


}