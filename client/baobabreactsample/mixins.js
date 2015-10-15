import mixins from 'baobab-react/mixins';


/*
SchemaCursorMixin is designed for use with baobab-react mixin `branch`.

This mixin add cursors from component `schema` for `tree` component prop.

Example of usage:
var EditForm = React.createClass({
    mixins: [schemaCursor, mixins.branch],
    schema: {name: '', externalId: ''},
    cursors: {
        editForm: ['editForm']
    },
    render: function () {
        // We have this.cursors.editForm (via baobab-react branch mixin)
        // And we have `this.cursors.name`, `this.cursors.externalId` via
        // SchemaCursorMixin.
        // `this.state.name` and others state params contains value from
        // appropriate cursor via baobab-react branch mixin
    }
});
*/
var SchemaBranchMixin = {
    getInitialState: function() {
        this.cursors = this.cursors || {};
        let tree = this.props.tree;
        for (let key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                this.cursors[key] = tree.select(key);
                if (!this.cursors[key].get()) {
                    this.cursors[key].set(this.schema[key]);
                }
            }
        }
    }
};


exports.schemaBranch = {
    mixins: [SchemaBranchMixin, mixins.branch]
};
