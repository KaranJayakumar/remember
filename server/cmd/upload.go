package main

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

// PresignedURLRequest represents the request for a presigned URL
type PresignedURLRequest struct {
	ContentType string `json:"contentType" binding:"required"`
}

// PresignedURLResponse represents the response with presigned URL
type PresignedURLResponse struct {
	UploadURL string `json:"uploadURL"`
	Key       string `json:"key"`
	PublicURL string `json:"publicURL"`
}

// GetPresignedUploadURL generates a presigned URL for direct S3 upload
func GetPresignedUploadURL(s3Client *S3Client) gin.HandlerFunc {
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

		var body PresignedURLRequest
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
			return
		}

		// Generate unique key for the image
		key := fmt.Sprintf("profile-pictures/%s/%s", userID, uuid.New().String())

		// Generate presigned URL for PUT operation
		presignClient := s3.NewPresignClient(s3Client.Client)
		presignedReq, err := presignClient.PresignPutObject(context.Background(), &s3.PutObjectInput{
			Bucket:      aws.String(s3Client.Bucket),
			Key:         aws.String(key),
			ContentType: aws.String(body.ContentType),
		}, s3.WithPresignExpires(15*time.Minute))

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate presigned URL: " + err.Error()})
			return
		}

		// Construct the public URL for the file (how it will be accessible)
		publicURL := fmt.Sprintf("%s/%s/%s",
			*s3Client.Client.Options().BaseEndpoint,
			s3Client.Bucket,
			key)

		c.JSON(http.StatusOK, PresignedURLResponse{
			UploadURL: presignedReq.URL,
			Key:       key,
			PublicURL: publicURL,
		})
	}
}
