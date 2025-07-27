package main

import (
	"net/http"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/connection"
	"github.com/KaranJayakumar/remember/ent/note"
	"github.com/KaranJayakumar/remember/ent/tag"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetConnections(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		workspaceId := c.Param("workspace_id")

		id, err := uuid.Parse(workspaceId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid workspace_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())

		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		connections, err := client.Connection.Query().
			Where(connection.WorkspaceIDEQ(id)).
			WithNotes().
			WithTags().
			All(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
			return
		}

		c.JSON(http.StatusOK, connections)
	}
}

type CreateConnectionRequest struct {
	Name     string
	ImageUrl string
}

func CreateConnection(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		workspaceId := c.Param("workspace_id")

		id, err := uuid.Parse(workspaceId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid workspace_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var body CreateConnectionRequest
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		connection, err := client.Connection.Create().
			SetWorkspaceID(id).
			SetName(body.Name).
			SetImageURL(body.ImageUrl).
			Save(c.Request.Context())

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create connection"})
			return
		}

		c.JSON(http.StatusCreated, connection)
	}
}

func DeleteConnection(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		connectionId := c.Param("connection_id")

		id, err := uuid.Parse(connectionId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		if _, err := client.Tag.Delete().
			Where(tag.ConnectionIDEQ(id)).
			Exec(c.Request.Context()); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete tags"})
			return
		}

		if _, err := client.Note.Delete().
			Where(note.ConnectionIDEQ(id)).
			Exec(c.Request.Context()); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete notes"})
			return
		}

		if _, err := client.Connection.Delete().
			Where(connection.IDEQ(id)).
			Exec(c.Request.Context()); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete connection"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "connection deleted"})
	}
}
