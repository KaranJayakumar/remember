package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

type Connection struct {
	ent.Schema
}

func (Connection) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.UUID("workspaceId", uuid.UUID{}),
		field.String("name").NotEmpty(),
		field.String("imageUrl").Optional(),
	}
}

func (Connection) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("workspace", Workspace.Type).
			Ref("connections").
			Field("workspaceId").
			Unique().
			Required(),

		edge.To("notes", Note.Type),

		edge.To("tags", Tag.Type),
	}
}
