package schema

import "entgo.io/ent"

// Memory holds the schema definition for the Memory entity.
type Memory struct {
	ent.Schema
}

// Fields of the Memory.
func (Memory) Fields() []ent.Field {
  return []ent.Field(
    field.Text("content")
  )
}

// Edges of the Memory.
func (Memory) Edges() []ent.Edge {
	return nil
}
