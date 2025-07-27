package main

import (
	"net/http"
	"strconv"

	"github.com/KaranJayakumar/remember/ent"
	"github.com/KaranJayakumar/remember/ent/tag"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateTagRequest struct {
	Name         string `json:"name" binding:"required"`
	Value        string `json:"value" binding:"required"`
	ConnectionID string `json:"connection_id" binding:"required"`
}

type UpdateTagRequest struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

func CreateTag(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var body CreateTagRequest
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		connectionID, err := uuid.Parse(body.ConnectionID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection_id"})
			return
		}

		tag, err := client.Tag.Create().
			SetName(body.Name).
			SetValue(body.Value).
			SetConnectionID(connectionID).
			Save(c.Request.Context())

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create tag"})
			return
		}

		c.JSON(http.StatusCreated, tag)
	}
}

func GetTags(client *ent.Client) gin.HandlerFunc {
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

		tags, err := client.Tag.Query().
			Where(tag.ConnectionIDEQ(id)).
			All(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
			return
		}

		c.JSON(http.StatusOK, tags)
	}
}

func UpdateTag(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		tagIDStr := c.Param("tag_id")
		tagID, err := strconv.Atoi(tagIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var body UpdateTagRequest
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if body.Name == "" && body.Value == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "either 'name' or 'value' must be provided"})
			return
		}

		updateBuilder := client.Tag.UpdateOneID(tagID)

		if body.Name != "" {
			updateBuilder = updateBuilder.SetName(body.Name)
		}
		if body.Value != "" {
			updateBuilder = updateBuilder.SetValue(body.Value)
		}

		updatedTag, err := updateBuilder.Save(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update tag"})
			return
		}

		c.JSON(http.StatusOK, updatedTag)
	}
}

func DeleteTag(client *ent.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		tagIDStr := c.Param("tag_id")

		tagID, err := strconv.Atoi(tagIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag_id"})
			return
		}

		_, ok := clerk.SessionClaimsFromContext(c.Request.Context())

		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		_, err = client.Tag.Delete().Where(tag.IDEQ(tagID)).Exec(c.Request.Context())

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not delete tag"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "tag deleted"})
	}
}

