import React from 'react';
import {render} from 'react-dom';
import Baobab from 'baobab';
import mixins from 'baobab-react/mixins'

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
var editForm = {name: '', externalId: '', selected: false};
var tree = new Baobab({
        editForm: editForm,
        itemList: []
    }, {
        immutable: false
    });

var App = React.createClass({
    mixins: [mixins.root],

    render: function() {
        return <Main />
    }
});

var Main = React.createClass({
    mixins: [mixins.branch],
    cursors: {
        itemList: ['itemList']
    },
    render: function(){
        return <div>
            <h1> Baobab-react JS </h1>
            <button onClick={() => {
                for(let i=0; i<10000; i++){
                    this.cursors.itemList.push({
                        name: makeid(),
                        externalId: makeid()
                    });
                }
            }}>Load 10000 items</button>
            <EditForm />
            <ItemList />
        </div>
    }
});

var EditForm = React.createClass({
    mixins: [mixins.branch],
    cursors: {
        itemList: ['itemList'],
        editForm: ['editForm'],
        name: ['editForm', 'name'],
        externalId: ['editForm', 'externalId'],
        selected: ['editForm', 'selected']
    },
    onAdd: function(){
        this.cursors.itemList.push(this.cursors.editForm.get());
        this.cursors.editForm.set(editForm);
    },
    onDelete: function(){
        this.cursors.itemList.apply(lst => lst.filter(item => !item.selected));
    },
    onUpdate: function(){
        this.cursors.itemList.apply(lst => lst.map(item => item.selected ? this.state.editForm : item))
    },
    onSelectAll: function(){
        var value = !this.isSelectAll();
        this.cursors.itemList.map((cursor, index) => cursor.set('selected', value));
    },
    isSelectAll: function(){
        return this.cursors.itemList.map((cursor, index) => cursor.get('selected')).every(x => x);
    },

    render: function() {
        return <div>
            <p><label>Name</label><Input cursor={this.cursors.name}/></p>
            <p><label>ExternalId</label><Input cursor={this.cursors.externalId}/></p>
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

var ItemList =  React.createClass({
    // Clever component
    mixins: [mixins.branch],
    cursors: {
        itemList: ['itemList']
    },
    render: function () {
        return <table>
                <tbody>
                    {this.cursors.itemList.map((cursor, index) => <Item key={index} item={cursor}/>)}
                </tbody>
               </table>
        }
});

var Item =  React.createClass({
    // Dumb component
    onClick: function(){
        this.props.item.apply('selected', c => !c);
    },
    render: function(){
        var item = this.props.item;
        return <tr>
                <td><input onChange={this.onClick} checked={item.get('selected')} type="checkbox" /></td>
                <td>{item.get('name')}</td>
                <td>{item.get('externalId')}</td>
               </tr>
    }
});

render(<App tree={tree} />, document.getElementById('react-view'));
