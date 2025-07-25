// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/KaranJayakumar/remember/ent/connection"
	"github.com/KaranJayakumar/remember/ent/note"
	"github.com/KaranJayakumar/remember/ent/predicate"
	"github.com/google/uuid"
)

// NoteUpdate is the builder for updating Note entities.
type NoteUpdate struct {
	config
	hooks    []Hook
	mutation *NoteMutation
}

// Where appends a list predicates to the NoteUpdate builder.
func (nu *NoteUpdate) Where(ps ...predicate.Note) *NoteUpdate {
	nu.mutation.Where(ps...)
	return nu
}

// SetConnectionID sets the "connection_id" field.
func (nu *NoteUpdate) SetConnectionID(u uuid.UUID) *NoteUpdate {
	nu.mutation.SetConnectionID(u)
	return nu
}

// SetNillableConnectionID sets the "connection_id" field if the given value is not nil.
func (nu *NoteUpdate) SetNillableConnectionID(u *uuid.UUID) *NoteUpdate {
	if u != nil {
		nu.SetConnectionID(*u)
	}
	return nu
}

// SetContent sets the "content" field.
func (nu *NoteUpdate) SetContent(s string) *NoteUpdate {
	nu.mutation.SetContent(s)
	return nu
}

// SetNillableContent sets the "content" field if the given value is not nil.
func (nu *NoteUpdate) SetNillableContent(s *string) *NoteUpdate {
	if s != nil {
		nu.SetContent(*s)
	}
	return nu
}

// SetConnection sets the "connection" edge to the Connection entity.
func (nu *NoteUpdate) SetConnection(c *Connection) *NoteUpdate {
	return nu.SetConnectionID(c.ID)
}

// Mutation returns the NoteMutation object of the builder.
func (nu *NoteUpdate) Mutation() *NoteMutation {
	return nu.mutation
}

// ClearConnection clears the "connection" edge to the Connection entity.
func (nu *NoteUpdate) ClearConnection() *NoteUpdate {
	nu.mutation.ClearConnection()
	return nu
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (nu *NoteUpdate) Save(ctx context.Context) (int, error) {
	return withHooks(ctx, nu.sqlSave, nu.mutation, nu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (nu *NoteUpdate) SaveX(ctx context.Context) int {
	affected, err := nu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (nu *NoteUpdate) Exec(ctx context.Context) error {
	_, err := nu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (nu *NoteUpdate) ExecX(ctx context.Context) {
	if err := nu.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (nu *NoteUpdate) check() error {
	if v, ok := nu.mutation.Content(); ok {
		if err := note.ContentValidator(v); err != nil {
			return &ValidationError{Name: "content", err: fmt.Errorf(`ent: validator failed for field "Note.content": %w`, err)}
		}
	}
	if nu.mutation.ConnectionCleared() && len(nu.mutation.ConnectionIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "Note.connection"`)
	}
	return nil
}

func (nu *NoteUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := nu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(note.Table, note.Columns, sqlgraph.NewFieldSpec(note.FieldID, field.TypeInt))
	if ps := nu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := nu.mutation.Content(); ok {
		_spec.SetField(note.FieldContent, field.TypeString, value)
	}
	if nu.mutation.ConnectionCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   note.ConnectionTable,
			Columns: []string{note.ConnectionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(connection.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := nu.mutation.ConnectionIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   note.ConnectionTable,
			Columns: []string{note.ConnectionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(connection.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, nu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{note.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	nu.mutation.done = true
	return n, nil
}

// NoteUpdateOne is the builder for updating a single Note entity.
type NoteUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *NoteMutation
}

// SetConnectionID sets the "connection_id" field.
func (nuo *NoteUpdateOne) SetConnectionID(u uuid.UUID) *NoteUpdateOne {
	nuo.mutation.SetConnectionID(u)
	return nuo
}

// SetNillableConnectionID sets the "connection_id" field if the given value is not nil.
func (nuo *NoteUpdateOne) SetNillableConnectionID(u *uuid.UUID) *NoteUpdateOne {
	if u != nil {
		nuo.SetConnectionID(*u)
	}
	return nuo
}

// SetContent sets the "content" field.
func (nuo *NoteUpdateOne) SetContent(s string) *NoteUpdateOne {
	nuo.mutation.SetContent(s)
	return nuo
}

// SetNillableContent sets the "content" field if the given value is not nil.
func (nuo *NoteUpdateOne) SetNillableContent(s *string) *NoteUpdateOne {
	if s != nil {
		nuo.SetContent(*s)
	}
	return nuo
}

// SetConnection sets the "connection" edge to the Connection entity.
func (nuo *NoteUpdateOne) SetConnection(c *Connection) *NoteUpdateOne {
	return nuo.SetConnectionID(c.ID)
}

// Mutation returns the NoteMutation object of the builder.
func (nuo *NoteUpdateOne) Mutation() *NoteMutation {
	return nuo.mutation
}

// ClearConnection clears the "connection" edge to the Connection entity.
func (nuo *NoteUpdateOne) ClearConnection() *NoteUpdateOne {
	nuo.mutation.ClearConnection()
	return nuo
}

// Where appends a list predicates to the NoteUpdate builder.
func (nuo *NoteUpdateOne) Where(ps ...predicate.Note) *NoteUpdateOne {
	nuo.mutation.Where(ps...)
	return nuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (nuo *NoteUpdateOne) Select(field string, fields ...string) *NoteUpdateOne {
	nuo.fields = append([]string{field}, fields...)
	return nuo
}

// Save executes the query and returns the updated Note entity.
func (nuo *NoteUpdateOne) Save(ctx context.Context) (*Note, error) {
	return withHooks(ctx, nuo.sqlSave, nuo.mutation, nuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (nuo *NoteUpdateOne) SaveX(ctx context.Context) *Note {
	node, err := nuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (nuo *NoteUpdateOne) Exec(ctx context.Context) error {
	_, err := nuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (nuo *NoteUpdateOne) ExecX(ctx context.Context) {
	if err := nuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (nuo *NoteUpdateOne) check() error {
	if v, ok := nuo.mutation.Content(); ok {
		if err := note.ContentValidator(v); err != nil {
			return &ValidationError{Name: "content", err: fmt.Errorf(`ent: validator failed for field "Note.content": %w`, err)}
		}
	}
	if nuo.mutation.ConnectionCleared() && len(nuo.mutation.ConnectionIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "Note.connection"`)
	}
	return nil
}

func (nuo *NoteUpdateOne) sqlSave(ctx context.Context) (_node *Note, err error) {
	if err := nuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(note.Table, note.Columns, sqlgraph.NewFieldSpec(note.FieldID, field.TypeInt))
	id, ok := nuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "Note.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := nuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, note.FieldID)
		for _, f := range fields {
			if !note.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != note.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := nuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := nuo.mutation.Content(); ok {
		_spec.SetField(note.FieldContent, field.TypeString, value)
	}
	if nuo.mutation.ConnectionCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   note.ConnectionTable,
			Columns: []string{note.ConnectionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(connection.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := nuo.mutation.ConnectionIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   note.ConnectionTable,
			Columns: []string{note.ConnectionColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(connection.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &Note{config: nuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, nuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{note.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	nuo.mutation.done = true
	return _node, nil
}
