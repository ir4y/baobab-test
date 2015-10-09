import Baobab from 'baobab';

var CursorMixin = {
    componentWillMount: function(){
        let tree = this.props.tree || this.rootTree;
        for (let key in this.schema){
            this[key] = tree.select(key);
            if(!this.skipDefault){
                this[key].set(this.schema[key]);
            }
        }
    }
};

var RootStateMixin =  {
    rootTree: new Baobab({}),
    componentWillMount: function(){
        this.rootTree.on('update', (e) => this.setState(e.data));
    },
    getInitialState: function(){
        return this.rootTree.get()
    }
};

exports.CursorMixin = CursorMixin;
exports.RootStateMixin = RootStateMixin;
