package service

import (
	"context"

	"github.com/KaranJayakumar/remember/internal/db/models"
	"github.com/KaranJayakumar/remember/internal/repository"
)

type NoteService struct {
	repo *repository.NoteRepository
}

func NewNoteService(repo *repository.NoteRepository) *NoteService {
	return &NoteService{repo: repo}
}

func (s *NoteService) ListByConnection(ctx context.Context, connectionID string) ([]models.Note, error) {
	return s.repo.ListByConnection(ctx, connectionID)
}

func (s *NoteService) Create(ctx context.Context, connectionID, content string) (*models.Note, error) {
	return s.repo.Create(ctx, connectionID, content)
}

func (s *NoteService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
