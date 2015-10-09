import React from 'react';
import {render} from 'react-dom';
import {CursorMixin, RootStateMixin} from 'mixin';

var App = React.createClass({
    mixins: [CursorMixin, RootStateMixin],
    schema: {editForm:{}, itemList: []},
    render: function(){
        return <div>
            <EditForm
                itemList={this.itemList}
                tree={this.editForm} />
            <ItemList cursor={this.itemList} />
        </div>
    }
});

var itemSchema = {name: '', externalId: '', selected: false};

var EditForm = React.createClass({
    mixins: [CursorMixin],
    schema: itemSchema,
    onAdd: function(){
        this.props.itemList.push(this.props.tree.get());
        this.props.tree.set(this.schema);
    },
    onDelete: function(){
        this.props.itemList.apply(lst => lst.filter(item => !item.selected));
    },
    onUpdate: function(){
        this.props.itemList.apply(lst => lst.map(item => item.selected ? this.props.tree.get() : item))
        this.props.tree.set(this.schema);
    },
    onSelectAll: function(){
        var value = !this.isSelectAll();
        for(let index in this.props.itemList.get()){
            this.props.itemList.select(index).select('selected').set(value)
        }
    },
    isSelectAll: function(){
        let result = true;
        for(let index in this.props.itemList.get()){
            result &= this.props.itemList.select(index).select('selected').get();
        }
        return result;
    },

    render: function() {
        return <div>
            <p><label>Name</label><Input cursor={this.name}/></p>
            <p><label>ExternalId</label><Input cursor={this.externalId}/></p>
            <input checked={this.isSelectAll()}
                   onChange={this.onSelectAll} type="checkbox" />
            <button onClick={this.onAdd}>+</button>
            <button onClick={this.onDelete}>-</button>
            <button onClick={this.onUpdate}>\/</button>
        </div>
    }
});

function Input({cursor}) {
    let onChange = (e) => cursor.set(e.target.value);
    return <input value={cursor.get()} onChange={onChange} />
}

function ItemList({cursor}) {
    return <table>
            <tbody>
                {cursor.get().map((item, index) => <Item key={index} tree={cursor.select(index)}/>)}
            </tbody>
           </table>
}

var Item =  React.createClass({
    mixins: [CursorMixin],
    schema: itemSchema,
    skipDefault: true, //Dirty hack
    onClick: function(){
        this.selected.apply(c => !c);
    },
    render: function(){
        return <tr>
                <td><input onChange={this.onClick} checked={this.selected.get()} type="checkbox" /></td>
                <td>{this.name.get()}</td>
                <td>{this.externalId.get()}</td>
               </tr>
    }
});

render(<App />, document.getElementById('react-view'));
