package handlers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type S3Client struct {
	PresignClient  *s3.PresignClient
	Bucket         string
	PublicEndpoint string
}

type UploadHandler struct {
	s3Client *S3Client
}

func NewUploadHandler(s3Client *S3Client) *UploadHandler {
	return &UploadHandler{s3Client: s3Client}
}

type presignURLRequest struct {
	ContentType string `json:"contentType" binding:"required"`
}

type presignURLResponse struct {
	UploadURL string `json:"uploadURL"`
	Key       string `json:"key"`
	PublicURL string `json:"publicURL"`
}

func (h *UploadHandler) GetPresignedURL() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("claims")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		sessionClaims, ok := claims.(*clerk.SessionClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		userID := sessionClaims.Subject

		var body presignURLRequest
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
			return
		}

		key := fmt.Sprintf("profile-pictures/%s/%s", userID, uuid.New().String())

		presignedReq, err := h.s3Client.PresignClient.PresignPutObject(context.Background(), &s3.PutObjectInput{
			Bucket:      aws.String(h.s3Client.Bucket),
			Key:         aws.String(key),
			ContentType: aws.String(body.ContentType),
		}, s3.WithPresignExpires(15*time.Minute))

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate presigned URL: " + err.Error()})
			return
		}

		publicURL := fmt.Sprintf("%s/%s/%s",
			h.s3Client.PublicEndpoint,
			h.s3Client.Bucket,
			key)

		c.JSON(http.StatusOK, presignURLResponse{
			UploadURL: presignedReq.URL,
			Key:       key,
			PublicURL: publicURL,
		})
	}
}
