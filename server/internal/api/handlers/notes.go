package handlers

import (
	"net/http"
	"strconv"

	"github.com/KaranJayakumar/remember/internal/service"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type NoteHandler struct {
	service *service.NoteService
}

func NewNoteHandler(service *service.NoteService) *NoteHandler {
	return &NoteHandler{service: service}
}

type createNoteBody struct {
	Content      string `json:"content" binding:"required"`
	ConnectionID string `json:"connection_id" binding:"required"`
}

func (h *NoteHandler) List(c *gin.Context) {
	connectionID := c.Param("connection_id")
	if _, err := uuid.Parse(connectionID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
		return
	}

	if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	notes, err := h.service.ListByConnection(c.Request.Context(), connectionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, notes)
}

func (h *NoteHandler) Create(c *gin.Context) {
	if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var body createNoteBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := uuid.Parse(body.ConnectionID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
		return
	}

	note, err := h.service.Create(c.Request.Context(), body.ConnectionID, body.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, note)
}

func (h *NoteHandler) Delete(c *gin.Context) {
	noteIDStr := c.Param("note_id")
	noteID, err := strconv.Atoi(noteIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note_id"})
		return
	}

	if _, ok := clerk.SessionClaimsFromContext(c.Request.Context()); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.service.Delete(c.Request.Context(), noteID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "note deleted"})
}
