import React from 'react';
import {render} from 'react-dom';

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var App = React.createClass({
    getInitialState: function(){
        return {list:[]}
    },
    render: function(){
        return <div>
            <h1> Vanila reactjs </h1>
            <h1>{this.state.list.length}</h1>
            <button onClick={() => {
                let array=[]
                for(let i=0; i<10000; i++){
                    array.push({
                        name: makeid(),
                        externalId: makeid()
                    })
                this.setState({list:[
                    ...this.state.list,
                    ...array]})
                }
            }}>Load 10000 items</button>
            <ItemList list={this.state.list} />
        </div>
    }
});


var ItemList = React.createClass({
    getInitialState: function(){
        return {name: '', externalId: ''}
    },
    checkFilter: function(item){
        let name = this.state.name;
        let externalId = this.state.externalId;
        return item.name.indexOf(name) > -1;// || item.externalId.indexOf(externalId) > -1;
    },
    set: function(field_name){
        return (e) => {
            let val = {};
            val[field_name] = e.target.value;
            this.setState(Object.assign({}, this.state, val));
        }
    },
    render: function(){
        return <div>
            <input onChange={this.set('name')} value={this.state.name} />
            <input onChange={this.set('externalId')} value={this.state.externalId}/>
            <table>
                <tbody>
                    {this.props.list.map(function(item, index){
                        return [index,item];
                    }).filter(item => this.checkFilter(item[1])).map(item => <Item key={item[0]} item={item[1]}/>)}
                </tbody>
               </table>
           </div>
        }
});

function Item({item}){
    return <tr>
                <td>{item.name}</td>
                <td>{item.externalId}</td>
               </tr>
    }

render(<App />, document.getElementById('react-view'));
