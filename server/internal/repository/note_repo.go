package repository

import (
	"context"
	"fmt"

	"github.com/KaranJayakumar/remember/internal/db/models"
)

type NoteRepository struct {
	db DBTX
}

func NewNoteRepository(db DBTX) *NoteRepository {
	return &NoteRepository{db: db}
}

func (r *NoteRepository) ListByConnection(ctx context.Context, connectionID string) ([]models.Note, error) {
	rows, err := r.db.QueryContext(ctx,
		"SELECT id, connection_id, content, created_at FROM notes WHERE connection_id = ? ORDER BY created_at DESC",
		connectionID,
	)
	if err != nil {
		return nil, fmt.Errorf("query notes: %w", err)
	}
	defer rows.Close()

	var notes []models.Note
	for rows.Next() {
		var n models.Note
		if err := rows.Scan(&n.ID, &n.ConnectionID, &n.Content, &n.CreatedAt); err != nil {
			return nil, err
		}
		notes = append(notes, n)
	}
	return notes, rows.Err()
}

func (r *NoteRepository) Create(ctx context.Context, connectionID, content string) (*models.Note, error) {
	res, err := r.db.ExecContext(ctx,
		"INSERT INTO notes (connection_id, content) VALUES (?, ?)",
		connectionID, content,
	)
	if err != nil {
		return nil, fmt.Errorf("insert note: %w", err)
	}
	id, _ := res.LastInsertId()
	return &models.Note{ID: int(id), ConnectionID: connectionID, Content: content}, nil
}

func (r *NoteRepository) Delete(ctx context.Context, id int) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM notes WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("delete note: %w", err)
	}
	return nil
}
