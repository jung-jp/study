/**
 * 메모 값 객체
 */
const Memo = class {
    constructor(id = '', text = '', zIndex = 0, top = 0, left = 0, width='200px', height='100px', date = new Date()) {
        Object.assign(this, {id, text, zIndex, top, left, width, height, date});
    }
}

/**
 * localStorage 모델 객체.
 * @param {*} table 
 */
const Model = class {
    constructor(table = 'Memo') {
        this.db = window.localStorage;
        this.table = table;
        this.EMPTY = {};
        this.zIndex = 1000;
    }

    insert(memo) {
        let items = Object.assign({}, this.getAll(), {[memo.id]:memo});
        this.db.setItem(this.table, JSON.stringify(items));
    }

    update(id, data) {
        let items = this.getAll();
        items[id] = Object.assign({}, items[id], data);
        this.db.setItem(this.table, JSON.stringify(items));
    }
    
    initZIndex() {
        let items = this.getAll();
        let zIndexIds = Object.values(items).map((item) => item.zIndex + ',' + item.id).sort();
        zIndexIds.forEach((v) => {
            let id = v.split(',')[1];
            items[id].zIndex = this.getMaxIndex();
        });
        this.db.setItem(this.table, JSON.stringify(items));
    }

    delete(id) {
        let items = this.getAll();
        delete items[id];
        this.db.setItem(this.table, JSON.stringify(items));
    }

    get(id) {
        return this.getAll()[id];
    }

    getAll() {
        const items = this.db.getItem(this.table);
        if(!items) {
            return this.EMPTY;
        } else {
            return JSON.parse(items);
        }
    }

    getTotalCount() {
        return Object.keys(this.getAll()).length;
    }

    getMaxIndex(zIndex = 0) {
        if(zIndex >= this.zIndex) {
            return zIndex;
        }
        return ++this.zIndex;
    }
    
}
