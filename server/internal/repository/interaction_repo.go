package repository

import (
	"context"
	"fmt"

	"github.com/KaranJayakumar/remember/internal/db/models"
)

type InteractionRepository struct {
	db DBTX
}

func NewInteractionRepository(db DBTX) *InteractionRepository {
	return &InteractionRepository{db: db}
}

func (r *InteractionRepository) ListByConnection(ctx context.Context, connectionID string) ([]models.Interaction, error) {
	rows, err := r.db.QueryContext(ctx,
		"SELECT id, connection_id, type, content, photo_url, created_at FROM interactions WHERE connection_id = ? ORDER BY created_at DESC",
		connectionID,
	)
	if err != nil {
		return nil, fmt.Errorf("query interactions: %w", err)
	}
	defer rows.Close()

	var interactions []models.Interaction
	for rows.Next() {
		var i models.Interaction
		if err := rows.Scan(&i.ID, &i.ConnectionID, &i.Type, &i.Content, &i.PhotoURL, &i.CreatedAt); err != nil {
			return nil, err
		}
		interactions = append(interactions, i)
	}
	return interactions, rows.Err()
}

func (r *InteractionRepository) Create(ctx context.Context, connectionID, interactionType, content string, photoURL *string) (*models.Interaction, error) {
	res, err := r.db.ExecContext(ctx,
		"INSERT INTO interactions (connection_id, type, content, photo_url) VALUES (?, ?, ?, ?)",
		connectionID, interactionType, content, photoURL,
	)
	if err != nil {
		return nil, fmt.Errorf("insert interaction: %w", err)
	}
	id, _ := res.LastInsertId()
	return &models.Interaction{ID: int(id), ConnectionID: connectionID, Type: interactionType, Content: content, PhotoURL: photoURL}, nil
}

func (r *InteractionRepository) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM interactions WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("delete interaction: %w", err)
	}
	return nil
}
