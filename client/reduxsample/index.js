import React from 'react';
import {render} from 'react-dom';
import {createStore,combineReducers} from 'redux';

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


var itemSchema = {name: '', externalId: '', selected: false};
function editForm(state=itemSchema, action){
    switch (action.type) {
    case 'SET_NAME':
        return  Object.assign(state, {name: action.value});
    case 'SET_EXTERNAL_ID':
        return  Object.assign(state, {externalId: action.value});
    default:
        return itemSchema;
    }
}

function isSelectAll(state){
    let result = true;
    for(let index in state){
        result &= state[index].selected;
    }
    return result;
}

function itemList(state=[], action){
    switch(action.type){
        case 'ADD_ITEM':
            return [...state, action.value];
        case 'SELECT':
            return[
                ...state.slice(0, action.index),
                Object.assign({},
                              state[action.index],
                              {selected: !state[action.index].selected}),
                ...state.slice(action.index + 1)];
        case 'SELECT_ALL':
            let value = !isSelectAll(state);
            return state.map(item => Object.assign(item,{selected: value}))
        case 'REMOVE_SELECTED':
            return state.filter(item=>!item.selected);
        case 'SET_SELECTED':
            return state.map(item => {
                if(item.selected)
                    return Object.assign(item, action.value);
                else
                    return item;
            });
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
        store.dispatch({type: 'ADD_ITEM', value: Object.assign({},this.state.editForm)})
        store.dispatch({type: 'SET_NAME', value: ''})
        store.dispatch({type: 'SET_EXTERNAL_ID', value: ''})
    },
    render: function(){
        return <div>
            <h1> REDUX </h1>
            <button onClick={() => {
                for(let i=0; i<1000; i++){
                    store.dispatch({
                        type: 'ADD_ITEM',
                        value: {
                            name: makeid(),
                            externalId: makeid()
                        }
                    });
                }
            }}>Load 1000 items</button>
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
                value={editForm.name}/>
        </p>
        <p>
            <label>ExternalId</label>
            <input
                onChange={(e)=>store.dispatch({type: 'SET_EXTERNAL_ID', value: e.target.value})}
                value={editForm.externalId}/>
        </p>
    </div>
};


var ItemList = ({itemList}) => {
    return <table>
            <tbody>
                {itemList.map((item, index) => <Item key={index} index={index} item={item}/>)}
            </tbody>
           </table>
}

var Item = ({index,item}) => {
    return <tr>
                <td>{index}</td>
                <td><input
                        type="checkbox"
                        onChange={() => store.dispatch({type:'SELECT', index:index})}
                        checked={item.selected} /></td>
                <td>{item.name}</td>
                <td>{item.externalId}</td>
               </tr>
}




render(<App />, document.getElementById('react-view'));
