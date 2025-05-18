package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Connection struct {
	ent.Schema
}

func (Connection) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.String("parentUserId"),
	}
}

func (Connection) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("memories", Memory.Type),
	}
}
