package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
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

func (Memory) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "Memories"},
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
