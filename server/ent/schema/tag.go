package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

type Tag struct {
	ent.Schema
}

func (Tag) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.String("name").NotEmpty().Unique(),
		field.String("value"),
	}
}

func (Tag) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("connections", Connection.Type).
			Ref("tags").
			Through("connection_tags", ConnectionTag.Type),
	}
}
