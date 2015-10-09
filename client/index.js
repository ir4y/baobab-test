import React from 'react';
import {render} from 'react-dom';
import Baobab from 'baobab';

var tree = new Baobab({});

function setupCursors(tree){
    for (let key in this.schema){
        this[key] = tree.select(key);
        this[key].set(this.schema[key]);
    }
}

var App = React.createClass({
    schema: {'editForm':{}, 'itemList': []},
    componentWillMount: function(){
        setupCursors.bind(this)(tree);
        tree.on('update', (e) => this.setState(e.data));
    },
    getInitialState: () => tree.get(),
    onAdd: function(){
        this.itemList.push(this.editForm.get());
    },
    onDelete: function(){
        this.itemList.apply(lst => lst.filter(item => !item.selected));
    },
    render: function(){
        return <div>
            <EditForm
                onAdd={this.onAdd}
                onDelete={this.onDelete}
                tree={this.editForm} />
            <ItemList cursor={this.itemList} />
        </div>
    }
});

var itemSchema = {name: '', externalId: '', selected: false};

var EditForm = React.createClass({
    schema: itemSchema,
    componentWillMount: function(){
        setupCursors.bind(this)(this.props.tree);
    },
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
    schema: itemSchema,
    componentWillMount: function(){
        for (let key in this.schema){
            this[key] = this.props.tree.select(key);
        }
    },
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
