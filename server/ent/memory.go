// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/KaranJayakumar/remember/ent/connection"
	"github.com/KaranJayakumar/remember/ent/memory"
)

// Memory is the model entity for the Memory schema.
type Memory struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// Content holds the value of the "content" field.
	Content string `json:"content,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the MemoryQuery when eager-loading is set.
	Edges               MemoryEdges `json:"edges"`
	connection_memories *int
	selectValues        sql.SelectValues
}

// MemoryEdges holds the relations/edges for other nodes in the graph.
type MemoryEdges struct {
	// Connection holds the value of the connection edge.
	Connection *Connection `json:"connection,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// ConnectionOrErr returns the Connection value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e MemoryEdges) ConnectionOrErr() (*Connection, error) {
	if e.Connection != nil {
		return e.Connection, nil
	} else if e.loadedTypes[0] {
		return nil, &NotFoundError{label: connection.Label}
	}
	return nil, &NotLoadedError{edge: "connection"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Memory) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case memory.FieldID:
			values[i] = new(sql.NullInt64)
		case memory.FieldContent:
			values[i] = new(sql.NullString)
		case memory.ForeignKeys[0]: // connection_memories
			values[i] = new(sql.NullInt64)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Memory fields.
func (m *Memory) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case memory.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			m.ID = int(value.Int64)
		case memory.FieldContent:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field content", values[i])
			} else if value.Valid {
				m.Content = value.String
			}
		case memory.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field connection_memories", value)
			} else if value.Valid {
				m.connection_memories = new(int)
				*m.connection_memories = int(value.Int64)
			}
		default:
			m.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Memory.
// This includes values selected through modifiers, order, etc.
func (m *Memory) Value(name string) (ent.Value, error) {
	return m.selectValues.Get(name)
}

// QueryConnection queries the "connection" edge of the Memory entity.
func (m *Memory) QueryConnection() *ConnectionQuery {
	return NewMemoryClient(m.config).QueryConnection(m)
}

// Update returns a builder for updating this Memory.
// Note that you need to call Memory.Unwrap() before calling this method if this Memory
// was returned from a transaction, and the transaction was committed or rolled back.
func (m *Memory) Update() *MemoryUpdateOne {
	return NewMemoryClient(m.config).UpdateOne(m)
}

// Unwrap unwraps the Memory entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (m *Memory) Unwrap() *Memory {
	_tx, ok := m.config.driver.(*txDriver)
	if !ok {
		panic("ent: Memory is not a transactional entity")
	}
	m.config.driver = _tx.drv
	return m
}

// String implements the fmt.Stringer.
func (m *Memory) String() string {
	var builder strings.Builder
	builder.WriteString("Memory(")
	builder.WriteString(fmt.Sprintf("id=%v, ", m.ID))
	builder.WriteString("content=")
	builder.WriteString(m.Content)
	builder.WriteByte(')')
	return builder.String()
}

// Memories is a parsable slice of Memory.
type Memories []*Memory
