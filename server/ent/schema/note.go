package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

type Note struct {
	ent.Schema
}

func (Note) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.UUID("connectionId", uuid.UUID{}),
		field.String("content").NotEmpty(),
	}
}

func (Note) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("connection", Connection.Type).
			Ref("notes").
			Field("connectionId").
			Unique().
			Required(),
	}
}
