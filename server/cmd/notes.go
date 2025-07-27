package main

import (
	"net/http"
	"strconv"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/note"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateNoteRequest struct {
	Content      string `json:"content" binding:"required"`
	ConnectionID string `json:"connection_id" binding:"required"`
}

type UpdateNoteRequest struct {
	Content string `json:"content" binding:"required"`
}

func CreateNote(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var body CreateNoteRequest
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		connectionID, err := uuid.Parse(body.ConnectionID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
			return
		}

		note, err := client.Note.Create().
			SetContent(body.Content).
			SetConnectionID(connectionID).
			Save(c.Request.Context())

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create note"})
			return
		}

		c.JSON(http.StatusCreated, note)
	}
}

func GetNotes(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		connectionID := c.Param("connection_id")

		id, err := uuid.Parse(connectionID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		notes, err := client.Note.Query().
			Where(note.ConnectionIDEQ(id)).
			All(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
			return
		}

		c.JSON(http.StatusOK, notes)
	}
}

func UpdateNote(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		noteIDStr := c.Param("note_id")

		noteID, err := strconv.Atoi(noteIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var body UpdateNoteRequest
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		updatedNote, err := client.Note.UpdateOneID(noteID).
			SetContent(body.Content).
			Save(c.Request.Context())

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update note"})
			return
		}

		c.JSON(http.StatusOK, updatedNote)
	}
}

func DeleteNote(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		noteIDStr := c.Param("note_id")

		noteID, err := strconv.Atoi(noteIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		err = client.Note.DeleteOneID(noteID).Exec(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not delete note"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "note deleted"})
	}
}

