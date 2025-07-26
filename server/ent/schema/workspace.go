package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

type Workspace struct {
	ent.Schema
}

func (Workspace) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.String("name").NotEmpty().Default("Default Workspace"),
		field.String("owner_user_id").NotEmpty(),
	}
}

func (Workspace) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("connections", Connection.Type),
	}
}
