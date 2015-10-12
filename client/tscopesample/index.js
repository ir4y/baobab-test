import React from 'react';
import {render} from 'react-dom';
import Tscope from 'tscope.js';

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var itemSchema = {name: '', externalId: '', selected: false};

var App = React.createClass({
    componentWillMount: function(){
        this.cursor = Tscope.dataCursor(this.getInitialState(),(state) => this.setState(state));
        this.editFormCursor = this.cursor.then(Tscope.attr('editForm'));
        this.itemListCursor = this.cursor.then(Tscope.attr('itemList'));
        this.allItemListCursor = this.itemListCursor.traversal();
        this.selectedItemListCursor = this.itemListCursor.traversal(i => i.selected);
        this.unSelectedItemListCursor = this.itemListCursor.traversal(i => !i.selected);
    },
    getInitialState: function (){
        return {
            editForm: itemSchema,
            itemList: [],
        }
    },
    onAdd: function(){
        let data = this.editFormCursor.get();
        this.itemListCursor.mod(lst=>[...lst, data]);
        this.editFormCursor.set(itemSchema);
    },
    onDelete: function(){
        this.itemListCursor.set(
            this.unSelectedItemListCursor.get());
    },
    isSelectAll: function(){
        let result = true;
        let selected = this.allItemListCursor.then(Tscope.attr('selected')).get();
        for(let index in selected){
            result &= selected[index];
        }
        return result;
    },
    selectAll: function(){
        var value = !this.isSelectAll();
        this.allItemListCursor.then(Tscope.attr('selected')).set(value);
    },
    onUpdate: function(){
        this.selectedItemListCursor.set(this.editFormCursor.get());
        this.editFormCursor.set(itemSchema);
    },
    render: function(){
        return <div>
            <h1> Tscope.js </h1>
            <button onClick={() => {
                for(let i=0; i<1000; i++){
                    let data= {
                            name: makeid(),
                            externalId: makeid(),
                            selected: false
                    };
                    this.itemListCursor.mod(lst=>[...lst, data]);
                }
            }}>Load 1000 items</button>
        <EditForm cursor={this.editFormCursor}/>
        <input type="checkbox" onChange={this.selectAll} checked={this.isSelectAll()} />
        <button onClick={this.onAdd}>+</button>
        <button onClick={this.onDelete}>-</button>
        <button onClick={this.onUpdate}>\/</button>
        <ItemList cursor={this.itemListCursor}/>
        </div>
    }
});

function Input({cursor}) {
    let onChange = (e) => cursor.set(e.target.value);
    return <input value={cursor.get()} onChange={onChange} />
}

function EditForm({cursor}) {
    return <div>
        <p><label>Name</label><Input cursor={cursor.then(Tscope.attr('name'))}/></p>
        <p><label>ExtrenalId</label><Input cursor={cursor.then(Tscope.attr('externalId'))}/></p>
    </div>
}

function ItemList({cursor}) {
    return <table>
            <tbody>
                {cursor.get().map((item, index) => <Item key={index} cursor={cursor.then(Tscope.at(index))}/>)}
            </tbody>
           </table>
}

function Item({cursor}) {
    let name = cursor.get().name;
    let externalId = cursor.get().externalId;
    let selected = cursor.then(Tscope.attr('selected'));
    return <tr>
        <td><input onChange={()=>selected.mod(s => !s)} checked={selected.get()} type="checkbox" /></td>
        <td>{name}</td>
        <td>{externalId}</td>
    </tr>
}

render(<App />, document.getElementById('react-view'));
