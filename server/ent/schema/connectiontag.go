package schema

import (
	"entgo.io/ent"
)

type ConnectionTag struct {
	ent.Schema
}

func (ConnectionTag) Fields() []ent.Field {
	return nil
}

func (ConnectionTag) Edges() []ent.Edge {
	return nil
}
