# API Endpoints Documentation

This document provides details on all available API endpoints for the Pub Digital Signage system. These endpoints allow programmatic interaction with the application for content management, data retrieval, and system control.

## API Overview

- Base URL: `http://<host>:<port>/api`
- Authentication: JWT tokens required for protected endpoints
- Response Format: JSON
- Error Handling: Standard HTTP status codes with error messages

## Authentication

### Get Authentication Token

```
POST /auth/login
```

Request body:
```json
{
  "username": "admin",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

Use this token in the Authorization header for protected endpoints:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Drinks Management

### Get All Drinks

```
GET /drinks
```

Query parameters:
- `featured` (optional): Filter by featured status (true/false)
- `category` (optional): Filter by category
- `limit` (optional): Limit results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "drinks": [
    {
      "drink_id": 1,
      "name": "Guinness",
      "category": "beer",
      "description": "Irish dry stout",
      "image_path": "/data/media/drinks/guinness.jpg",
      "is_featured": true,
      "created_at": "2025-04-10T14:32:10.000Z"
    },
    ...
  ],
  "total": 10
}
```

### Get Single Drink

```
GET /drinks/:id
```

Response:
```json
{
  "drink_id": 1,
  "name": "Guinness",
  "category": "beer",
  "description": "Irish dry stout",
  "image_path": "/data/media/drinks/guinness.jpg",
  "is_featured": true,
  "created_at": "2025-04-10T14:32:10.000Z"
}
```

### Create Drink

```
POST /drinks
```

Request body:
```json
{
  "name": "Jameson",
  "category": "whiskey",
  "description": "Irish whiskey",
  "is_featured": false
}
```

Response:
```json
{
  "drink_id": 2,
  "name": "Jameson",
  "category": "whiskey",
  "description": "Irish whiskey",
  "image_path": null,
  "is_featured": false,
  "created_at": "2025-04-24T15:45:20.000Z"
}
```

### Update Drink

```
PUT /drinks/:id
```

Request body:
```json
{
  "name": "Jameson",
  "category": "whiskey",
  "description": "Smooth Irish whiskey",
  "is_featured": true
}
```

Response:
```json
{
  "drink_id": 2,
  "name": "Jameson",
  "category": "whiskey",
  "description": "Smooth Irish whiskey",
  "image_path": null,
  "is_featured": true,
  "created_at": "2025-04-24T15:45:20.000Z",
  "updated_at": "2025-04-24T15:50:10.000Z"
}
```

### Delete Drink

```
DELETE /drinks/:id
```

Response:
```json
{
  "message": "Drink deleted successfully",
  "drink_id": 2
}
```

### Upload Drink Image

```
POST /drinks/:id/image
```

Request: multipart/form-data with file in "image" field

Response:
```json
{
  "drink_id": 1,
  "image_path": "/data/media/drinks/guinness-1234567890.jpg",
  "message": "Image uploaded successfully"
}
```

## Games Management

### Get All Games

```
GET /games
```

Query parameters:
- `limit` (optional): Limit results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "games": [
    {
      "game_id": 1,
      "name": "Settlers of Catan",
      "description": "Build settlements and cities to win!",
      "image_path": "/data/media/games/catan.jpg",
      "scoring_type": "high_wins",
      "created_at": "2025-04-10T14:32:10.000Z"
    },
    ...
  ],
  "total": 5
}
```

### Get Single Game

```
GET /games/:id
```

Response:
```json
{
  "game_id": 1,
  "name": "Settlers of Catan",
  "description": "Build settlements and cities to win!",
  "image_path": "/data/media/games/catan.jpg",
  "scoring_type": "high_wins",
  "created_at": "2025-04-10T14:32:10.000Z"
}
```

### Create Game

```
POST /games
```

Request body:
```json
{
  "name": "Chess",
  "description": "Classic strategy game",
  "scoring_type": "binary"
}
```

Response:
```json
{
  "game_id": 3,
  "name": "Chess",
  "description": "Classic strategy game",
  "image_path": null,
  "scoring_type": "binary",
  "created_at": "2025-04-24T15:45:20.000Z"
}
```

### Update Game

```
PUT /games/:id
```

Request body:
```json
{
  "name": "Chess",
  "description": "Classic board game of kings and queens",
  "scoring_type": "binary"
}
```

Response:
```json
{
  "game_id": 3,
  "name": "Chess",
  "description": "Classic board game of kings and queens",
  "image_path": null,
  "scoring_type": "binary",
  "created_at": "2025-04-24T15:45:20.000Z",
  "updated_at": "2025-04-24T15:50:10.000Z"
}
```

### Delete Game

```
DELETE /games/:id
```

Response:
```json
{
  "message": "Game deleted successfully",
  "game_id": 3
}
```

### Upload Game Image

```
POST /games/:id/image
```

Request: multipart/form-data with file in "image" field

Response:
```json
{
  "game_id": 1,
  "image_path": "/data/media/games/catan-1234567890.jpg",
  "message": "Image uploaded successfully"
}
```

## Game Sessions

### Get Game Sessions

```
GET /games/:id/sessions
```

Query parameters:
- `limit` (optional): Limit results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "sessions": [
    {
      "session_id": 1,
      "game_id": 1,
      "session_date": "2025-04-20",
      "notes": "Weekly game night",
      "created_at": "2025-04-20T20:15:30.000Z",
      "results": [
        {
          "visitor_id": 1,
          "name": "John Smith",
          "score": 10,
          "position": 1
        },
        {
          "visitor_id": 2,
          "name": "Jane Doe",
          "score": 8,
          "position": 2
        }
      ]
    },
    ...
  ],
  "total": 5
}
```

### Create Game Session

```
POST /games/:id/sessions
```

Request body:
```json
{
  "session_date": "2025-04-24",
  "notes": "Thursday night game",
  "results": [
    {
      "visitor_id": 1,
      "score": 12,
      "position": 1
    },
    {
      "visitor_id": 3,
      "score": 10,
      "position": 2
    },
    {
      "visitor_id": 2,
      "score": 7,
      "position": 3
    }
  ]
}
```

Response:
```json
{
  "session_id": 2,
  "game_id": 1,
  "session_date": "2025-04-24",
  "notes": "Thursday night game",
  "created_at": "2025-04-24T21:30:15.000Z",
  "results": [
    {
      "result_id": 4,
      "visitor_id": 1,
      "score": 12,
      "position": 1
    },
    {
      "result_id": 5,
      "visitor_id": 3,
      "score": 10,
      "position": 2
    },
    {
      "result_id": 6,
      "visitor_id": 2,
      "score": 7,
      "position": 3
    }
  ]
}
```

### Get Game Leaderboard

```
GET /games/:id/leaderboard
```

Query parameters:
- `limit` (optional): Limit results (default: 10)
- `since` (optional): Filter by date (YYYY-MM-DD)

Response:
```json
{
  "game_id": 1,
  "name": "Settlers of Catan",
  "leaderboard": [
    {
      "visitor_id": 1,
      "name": "John Smith",
      "games_played": 5,
      "wins": 3,
      "avg_score": 9.6,
      "best_score": 12,
      "win_percentage": 0.6
    },
    ...
  ]
}
```

## Visitors Management

### Get All Visitors

```
GET /visitors
```

Query parameters:
- `limit` (optional): Limit results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "visitors": [
    {
      "visitor_id": 1,
      "name": "John Smith",
      "photo_path": "/data/media/visitors/john.jpg",
      "first_visit_date": "2025-01-15",
      "visit_count": 15,
      "notes": "Prefers craft beer",
      "created_at": "2025-01-15T18:20:45.000Z"
    },
    ...
  ],
  "total": 10
}
```

### Get Single Visitor

```
GET /visitors/:id
```

Response:
```json
{
  "visitor_id": 1,
  "name": "John Smith",
  "photo_path": "/data/media/visitors/john.jpg",
  "first_visit_date": "2025-01-15",
  "visit_count": 15,
  "notes": "Prefers craft beer",
  "created_at": "2025-01-15T18:20:45.000Z",
  "next_milestone": {
    "name": "Pub Enthusiast",
    "description": "Truly dedicated to the pub experience!",
    "visit_count": 25,
    "visits_needed": 10
  }
}
```

### Create Visitor

```
POST /visitors
```

Request body:
```json
{
  "name": "Mike Johnson",
  "first_visit_date": "2025-04-24",
  "notes": "Friend of John"
}
```

Response:
```json
{
  "visitor_id": 11,
  "name": "Mike Johnson",
  "photo_path": null,
  "first_visit_date": "2025-04-24",
  "visit_count": 1,
  "notes": "Friend of John",
  "created_at": "2025-04-24T15:45:20.000Z"
}
```

### Update Visitor

```
PUT /visitors/:id
```

Request body:
```json
{
  "name": "Mike Johnson",
  "notes": "Friend of John, prefers cider"
}
```

Response:
```json
{
  "visitor_id": 11,
  "name": "Mike Johnson",
  "photo_path": null,
  "first_visit_date": "2025-04-24",
  "visit_count": 1,
  "notes": "Friend of John, prefers cider",
  "created_at": "2025-04-24T15:45:20.000Z",
  "updated_at": "2025-04-24T15:50:10.000Z"
}
```

### Delete Visitor

```
DELETE /visitors/:id
```

Response:
```json
{
  "message": "Visitor deleted successfully",
  "visitor_id": 11
}
```

### Upload Visitor Photo

```
POST /visitors/:id/photo
```

Request: multipart/form-data with file in "photo" field

Response:
```json
{
  "visitor_id": 1,
  "photo_path": "/data/media/visitors/john-1234567890.jpg",
  "message": "Photo uploaded successfully"
}
```

### Record Visit

```
POST /visitors/:id/visit
```

Request body:
```json
{
  "visit_date": "2025-04-24",
  "notes": "Thursday night game session"
}
```

Response:
```json
{
  "visit_id": 16,
  "visitor_id": 1,
  "visit_date": "2025-04-24",
  "notes": "Thursday night game session",
  "milestone_achieved": null,
  "created_at": "2025-04-24T21:30:15.000Z",
  "visitor": {
    "visitor_id": 1,
    "name": "John Smith",
    "visit_count": 16
  }
}
```

## Themes Management

### Get All Themes

```
GET /themes
```

Response:
```json
{
  "themes": [
    {
      "name": "Pub Classic",
      "active": true,
      "isDefault": true,
      "primary": "#96d6dd",
      "secondary": "#565059",
      "accent": "#fc4242",
      "background": "#ffffff",
      "text": "#565059"
    },
    {
      "name": "Morning Brew",
      "active": true,
      "startTime": "06:00",
      "endTime": "12:00",
      "primary": "#8B4513",
      "secondary": "#D2691E",
      "accent": "#FFD700",
      "background": "#F5F5DC",
      "text": "#2C1B0F"
    },
    ...
  ]
}
```

### Get Current Theme

```
GET /themes/current
```

Response:
```json
{
  "name": "Evening Ambiance",
  "active": true,
  "startTime": "18:00",
  "endTime": "23:00",
  "primary": "#8B4513",
  "secondary": "#D2691E",
  "accent": "#FFD700",
  "background": "#2C1B0F",
  "text": "#F5F5DC"
}
```

### Update Theme

```
PUT /themes/:name
```

Request body:
```json
{
  "active": true,
  "primary": "#8B4513",
  "secondary": "#D2691E",
  "accent": "#FFD700",
  "background": "#2C1B0F",
  "text": "#F5F5DC",
  "logoPath": "/data/media/logo/pub-logo.png"
}
```

Response:
```json
{
  "name": "Evening Ambiance",
  "active": true,
  "startTime": "18:00",
  "endTime": "23:00",
  "primary": "#8B4513",
  "secondary": "#D2691E",
  "accent": "#FFD700",
  "background": "#2C1B0F",
  "text": "#F5F5DC",
  "logoPath": "/data/media/logo/pub-logo.png",
  "updated_at": "2025-04-24T15:50:10.000Z"
}
```

### Set Active Theme

```
POST /themes/activate/:name
```

Response:
```json
{
  "message": "Theme activated successfully",
  "theme": "Evening Ambiance"
}
```

## Media Management

### Get Media Library

```
GET /media
```

Query parameters:
- `category` (optional): Filter by category (photos, videos, background, etc.)
- `limit` (optional): Limit results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "media": [
    {
      "media_id": 1,
      "filename": "event-2025-01-15.jpg",
      "path": "/data/media/photos/event-2025-01-15.jpg",
      "type": "image/jpeg",
      "category": "photos",
      "description": "New Year's Party",
      "created_at": "2025-01-16T10:20:30.000Z"
    },
    ...
  ],
  "total": 30
}
```

### Upload Media

```
POST /media
```

Request: multipart/form-data with:
- file in "media" field
- fields: category, description (optional), tags (optional)

Response:
```json
{
  "media_id": 31,
  "filename": "pub-night-1234567890.jpg",
  "path": "/data/media/photos/pub-night-1234567890.jpg",
  "type": "image/jpeg",
  "category": "photos",
  "description": "Saturday pub night",
  "created_at": "2025-04-24T21:30:15.000Z"
}
```

### Delete Media

```
DELETE /media/:id
```

Response:
```json
{
  "message": "Media deleted successfully",
  "media_id": 31
}
```

## System Information

### Get System Status

```
GET /system/status
```

Response:
```json
{
  "status": "running",
  "uptime": 259200,
  "version": "1.0.0",
  "databaseSize": "15.2 MB",
  "mediaSize": "156.7 MB",
  "lastBackup": "2025-04-23T02:00:15.000Z"
}
```

### Get System Settings

```
GET /system/settings
```

Response:
```json
{
  "settings": {
    "displayName": "Orange Pig Pub",
    "contentRotationInterval": 15,
    "showClock": true,
    "showWeather": true,
    "defaultView": "home"
  }
}
```

### Update System Settings

```
PUT /system/settings
```

Request body:
```json
{
  "contentRotationInterval": 20,
  "showWeather": false
}
```

Response:
```json
{
  "settings": {
    "displayName": "Orange Pig Pub",
    "contentRotationInterval": 20,
    "showClock": true,
    "showWeather": false,
    "defaultView": "home"
  },
  "updated_at": "2025-04-24T15:50:10.000Z"
}
```

## Home Assistant Integration

### Get Connection Status

```
GET /integrations/home-assistant/status
```

Response:
```json
{
  "connected": true,
  "url": "http://homeassistant.local:8123",
  "entities": ["media_player.pub_display", "sensor.pub_visitors"]
}
```

### Update Connection Settings

```
PUT /integrations/home-assistant/settings
```

Request body:
```json
{
  "url": "http://homeassistant.local:8123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "message": "Home Assistant connection updated successfully",
  "connected": true
}
```

### Trigger Event

```
POST /integrations/home-assistant/trigger
```

Request body:
```json
{
  "event": "display_content",
  "data": {
    "contentType": "drinks",
    "duration": 60
  }
}
```

Response:
```json
{
  "message": "Event triggered successfully",
  "event": "display_content"
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or invalid
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:

```json
{
  "error": {
    "message": "Descriptive error message",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

## Pagination

Endpoints that return collections support pagination using:

- `limit`: Number of items to return (default varies by endpoint)
- `offset`: Number of items to skip (default: 0)

Paginated responses include:

```json
{
  "items": [...],
  "total": 100,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

## Testing the API

You can test the API using the following tools:

1. **curl**:
```bash
curl -X GET http://localhost:3000/api/drinks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Postman**: Import the [Postman collection](../resources/pubsignage-api.postman_collection.json)

3. **API Explorer**: Available at `http://<host>:<port>/api/explorer` when running in development mode