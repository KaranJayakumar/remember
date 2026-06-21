package service

import (
	"context"

	"github.com/KaranJayakumar/remember/internal/db/models"
	"github.com/KaranJayakumar/remember/internal/repository"
)

type ConnectionService struct {
	connRepo *repository.ConnectionRepository
	noteRepo *repository.NoteRepository
	intRepo  *repository.InteractionRepository
}

func NewConnectionService(connRepo *repository.ConnectionRepository, noteRepo *repository.NoteRepository, intRepo *repository.InteractionRepository) *ConnectionService {
	return &ConnectionService{connRepo: connRepo, noteRepo: noteRepo, intRepo: intRepo}
}

func (s *ConnectionService) ListByWorkspace(ctx context.Context, workspaceID string) ([]models.Connection, error) {
	return s.connRepo.ListByWorkspace(ctx, workspaceID)
}

func (s *ConnectionService) GetByID(ctx context.Context, id string) (*models.Connection, error) {
	conn, err := s.connRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	notes, _ := s.noteRepo.ListByConnection(ctx, id)
	interactions, _ := s.intRepo.ListByConnection(ctx, id)
	conn.Notes = notes
	conn.Interactions = interactions
	return conn, nil
}

func (s *ConnectionService) Create(ctx context.Context, workspaceID, name string, imageURL *string) (*models.Connection, error) {
	return s.connRepo.Create(ctx, workspaceID, name, imageURL)
}

func (s *ConnectionService) Delete(ctx context.Context, id string) error {
	return s.connRepo.Delete(ctx, id)
}
