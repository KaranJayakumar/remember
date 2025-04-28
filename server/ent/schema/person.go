package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema"
    "entgo.io/ent/dialect/entsql"
    "entgo.io/ent/schema/field"
    "entgo.io/ent/schema/edge"
)

type Person struct {
    ent.Schema
}

func (Person) Fields() []ent.Field {
    return []ent.Field{
        field.String("name"),
    }
}

func (Person) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("memories", Memory.Type),
    }
}

func (Person) Annotations() []schema.Annotation {
    return []schema.Annotation{
        entsql.Annotation{Table: "People"},
    }
}
