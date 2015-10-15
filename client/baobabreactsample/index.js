import React from 'react';
import {render} from 'react-dom';
import Baobab from 'baobab';
import {root} from 'baobab-react/mixins';
import {schemaBranch} from 'mixins';


function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var tree = new Baobab({}, { immutable: false });

var App = React.createClass({
    mixins: [root],

    render: function() {
        return <Main tree={this.props.tree} />
    }
});

var Main = React.createClass({
    mixins: [schemaBranch],
    schema: {
        editForm: {},
        itemList: []
    },
    render: function(){
        return <div>
            <h1> Baobab-react JS </h1>
            <button onClick={() => {
                for(let i = 0; i < 10000; i++){
                    this.cursors.itemList.push({
                        name: makeid(),
                        externalId: makeid()
                    });
                }
            }}>Load 10000 items</button>
            <EditForm tree={this.cursors.editForm} />
            <ItemList />
        </div>
    }
});

var editForm = {name: 'Hello', externalId: '', selected: false};
var EditForm = React.createClass({
    mixins: [schemaBranch],
    schema: editForm,
    cursors: {
        itemList: ['itemList'],
        editForm: ['editForm']
    },
    onAdd: function(){
        this.cursors.itemList.push(this.cursors.editForm.get());
        this.cursors.editForm.set(editForm);
    },
    onDelete: function(){
        this.cursors.itemList.apply(
                lst => lst.filter(item => !item.selected)
        );
    },
    onUpdate: function(){
        this.cursors.itemList.apply(
                lst => lst.map(item => item.selected ? this.state.editForm : item)
        )
    },
    onSelectAll: function(){
        var value = !this.isSelectAll();
        this.cursors.itemList.map(
            (cursor, index) => cursor.set('selected', value)
        );
    },
    isSelectAll: function(){
        return this.cursors.itemList.map(
            (cursor, index) => cursor.get('selected')
        ).every(x => x);
    },

    render: function() {
        return <div>
            <p>
                <label>Name</label>
                <Input cursor={this.cursors.name}/>
            </p>
            <p>
                <label>ExternalId</label>
                <Input cursor={this.cursors.externalId}/>
            </p>
            <input checked={this.isSelectAll()}
                   onChange={this.onSelectAll} type="checkbox" />
            <button onClick={this.onAdd}>+</button>
            <button onClick={this.onDelete}>-</button>
            <button onClick={this.onUpdate}>\/</button>
        </div>
    }
});

var Input = React.createClass({
  getInitialState: function () {
      return {value: this.props.cursor.get()};
  },
  componentDidMount: function () {
      this.props.cursor.on('update',
          () => this.setState({value: this.props.cursor.get()}));
  },
  onBlur: function(e) {
    var newValue = e.target.value;
    this.props.cursor.set(newValue);
  },
  onChange: function (e) {
    this.setState({value: e.target.value});
  },
  render: function() {
    return <input onBlur={this.onBlur}
                  onChange={this.onChange}
                  value={this.state.value} />;
  }
});


var ItemList =  React.createClass({
    // Clever component
    mixins: [schemaBranch],
    cursors: {
        itemList: ['itemList']
    },
    render: function () {
        return <table>
                <tbody>
                    {this.cursors.itemList.map(
                        (cursor, index) => <Item key={index} tree={cursor} />)}
                </tbody>
               </table>
        }
});

var Item =  React.createClass({
    // Dumb component
    schema: editForm,
    mixins: [schemaBranch],
    onClick: function(){
        this.cursors.selected.apply(c => !c);
    },
    render: function(){
        return <tr>
                <td><input onChange={this.onClick}
                           checked={this.state.selected}
                           type="checkbox" /></td>
                <td>{this.state.name}</td>
                <td>{this.state.externalId}</td>
               </tr>
    }
});

render(<App tree={tree} />, document.getElementById('react-view'));
