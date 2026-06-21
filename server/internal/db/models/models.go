package models

import "time"

type Workspace struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	OwnerUserID string `json:"owner_user_id"`
}

type Connection struct {
	ID           string        `json:"id"`
	WorkspaceID  string        `json:"workspace_id"`
	Name         string        `json:"name"`
	ImageURL     *string       `json:"image_url"`
	Metadata     *string       `json:"metadata"`
	CreatedAt    *time.Time    `json:"created_at"`
	UpdatedAt    *time.Time    `json:"updated_at"`
	Notes        []Note        `json:"notes,omitempty"`
	Interactions []Interaction `json:"interactions,omitempty"`
}

type Note struct {
	ID           int       `json:"id"`
	ConnectionID string    `json:"connection_id"`
	Content      string    `json:"content"`
	CreatedAt    time.Time `json:"created_at"`
}

type Interaction struct {
	ID           int       `json:"id"`
	ConnectionID string    `json:"connection_id"`
	Type         string    `json:"type"`
	Content      string    `json:"content"`
	PhotoURL     *string   `json:"photo_url"`
	CreatedAt    time.Time `json:"created_at"`
}
