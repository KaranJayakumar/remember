package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Memory struct {
	ent.Schema
}

func (Memory) Fields() []ent.Field {
	return []ent.Field{
		field.Text("content"),
	}
}
func (Memory) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("connection", Connection.Type).
			Ref("memories").
			Unique().
			Required(),
	}
}
