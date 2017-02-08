interface StateObject {
    [key: string]: boolean;
}

export class State {

    constructor(state?: StateObject) {
        for(let key in state) {
            this[key] = state[key];
        }
    }

    isAllTruthy() {
        let keys = this.getKeys();
        for(let key of keys) {
            if(!this[key]) {
                return false;
            }
        }
        return true;
    }

    isAtleastOneTruthy() {
        let keys = this.getKeys();
        for(let key of keys) {
            if(this[key]) {
                return true;
            }
        }
        return false;
    }

    getTruthyStatesArray() {
        let keys = this.getKeys();
        let strArr: string[] = [];
        for(let key of keys) {
            if(this[key]) {
                strArr.push(key);
            }
        }
        return strArr;
    }

    private getKeys() {
        return Object.keys(this);
    }
}
