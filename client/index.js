import React from 'react';
import {render} from 'react-dom';
import {CursorMixin, RootStateMixin} from 'mixin';

var App = React.createClass({
    mixins: [CursorMixin, RootStateMixin],
    schema: {'editForm':{}, 'itemList': []},
    onAdd: function(){
        this.itemList.push(this.editForm.get());
    },
    onDelete: function(){
        this.itemList.apply(lst => lst.filter(item => !item.selected));
    },
    onUpdate: function(){
        this.itemList.apply(lst => lst.map(item => item.selected ? this.editForm.get() : item))
    },
    render: function(){
        return <div>
            <EditForm
                onAdd={this.onAdd}
                onDelete={this.onDelete}
                onUpdate={this.onUpdate}
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
        this.props.onAdd();
        this.props.tree.set(this.schema);
    },
    render: function() {
        return <div>
            <p><label>Name</label><Input cursor={this.name}/></p>
            <p><label>ExternalId</label><Input cursor={this.externalId}/></p>
            <button onClick={this.onAdd}>+</button>
            <button onClick={this.props.onDelete}>-</button>
            <button onClick={this.props.onUpdate}>\/</button>
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
