FROM golang:1.24

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /remember-app

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /remember-app .

EXPOSE 8080

CMD ["./remember-app"]
