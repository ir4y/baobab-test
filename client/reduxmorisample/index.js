import React from 'react';
import {render} from 'react-dom';
import mori from 'mori';
import {createStore,combineReducers} from 'redux';

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


var itemSchema = mori.hashMap('name', '', 'externalId', '', 'selected', false);
function editForm(state=itemSchema, action){
    switch (action.type) {
    case 'SET_NAME':
        return mori.assoc(state, 'name', action.value);
    case 'SET_EXTERNAL_ID':
        return mori.assoc(state, 'externalId', action.value);
    default:
        return itemSchema;
    }
}

function isSelectAll(state){
    return mori.reduce((a,b) => a & b, true, state);
}

let il = mori.vector();
function itemList(state=il, action){
    switch(action.type){
        case 'ADD_ITEM':
            return mori.conj(state, action.value);
        case 'SELECT':
            return mori.assocIn(state, [action.index, 'selected'], !mori.getIn(state, [action.index, 'selected']));
        case 'SELECT_ALL':
            let value = !isSelectAll(state);
            return mori.map(item => mori.assoc(item, 'selected', value), state);
        case 'REMOVE_SELECTED':
            return mori.filter(item => !mori.get(item, 'selected'), state);
        case 'SET_SELECTED':
            return mori.map(item => {
                if(mori.get(item, 'selected'))
                    return action.value;
                else
                    return item;
            }, state);
        default:
            return state;
    }
}

let store = createStore(
    combineReducers({editForm, itemList}));

var App = React.createClass({
    componentWillMount: function(){
        store.subscribe(() => this.setState(store.getState()))
    },
    getInitialState: function (){
        return store.getState();
    },
    onAdd: function(){
        store.dispatch({type: 'ADD_ITEM', value: this.state.editForm})
        store.dispatch({type: 'SET_NAME', value: ''})
        store.dispatch({type: 'SET_EXTERNAL_ID', value: ''})
    },
    render: function(){
        return <div>
            <h1> REDUX + MORI </h1>
            <button onClick={() => {
                for(let i=0; i<10000; i++){
                    store.dispatch({
                        type: 'ADD_ITEM',
                        value: mori.toClj({
                            name: makeid(),
                            externalId: makeid()
                        })
                    });
                }
            }}>Load 10000 items</button>
                <EditForm editForm={this.state.editForm} />
                <input checked={isSelectAll(this.state.itemList)}
                       onChange={()=>store.dispatch({type: 'SELECT_ALL'})} type="checkbox" />
                <button onClick={this.onAdd}>+</button>
                <button onClick={()=>store.dispatch({type: 'REMOVE_SELECTED'})}>-</button>
                <button onClick={()=>store.dispatch({type: 'SET_SELECTED', value: this.state.editForm})}>\/</button>
                <ItemList itemList={this.state.itemList} />
               </div>
    }
});

var EditForm = ({editForm}) => {
    return <div>
        <p>
            <label>Name</label>
            <input
                onChange={(e)=>store.dispatch({type: 'SET_NAME', value: e.target.value})}
                value={mori.get(editForm, 'name')}/>
        </p>
        <p>
            <label>ExternalId</label>
            <input
                onChange={(e)=>store.dispatch({type: 'SET_EXTERNAL_ID', value: e.target.value})}
                value={mori.get(editForm, 'externalId')}/>
        </p>
    </div>
};


var ItemList = ({itemList}) => {
    return <table>
            <tbody>
                {mori.toJs(itemList).map((item, index) => <Item key={index} index={index} item={item}/>)}
            </tbody>
           </table>
}

var Item = ({index,item}) => {
    return <tr>
                <td>{index}</td>
                <td><input
                        type="checkbox"
                        onChange={() => store.dispatch({type:'SELECT', index: index})}
                        checked={item.selected} /></td>
                <td>{item.name}</td>
                <td>{item.externalId}</td>
               </tr>
}




render(<App />, document.getElementById('react-view'));
