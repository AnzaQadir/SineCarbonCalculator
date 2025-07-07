# Zerrah Signup System

A comprehensive signup system with user creation, activity tracking, email notifications, and community features.

## 🚀 Features

### Core Functionality
- **User Signup**: Complete user registration with demographic data
- **Activity Tracking**: Track all user actions (signup, emails, community joins)
- **Email Notifications**: Welcome emails and community join confirmations
- **Community Integration**: Join community functionality with activity tracking
- **A/B Testing**: Track CTA variants for optimization
- **Waitlist Management**: Automatic waitlist position assignment

### Data Collection
- Email address
- First name (optional)
- Age range
- Gender identity
- Profession/work category
- Location (country + city)
- Household size
- A/B test variant

## 📁 File Structure

```
backend/src/
├── types/
│   └── user.ts              # User and activity type definitions
├── services/
│   ├── userService.ts        # User management and activity tracking
│   └── emailService.ts       # Email generation and sending
├── controllers/
│   └── userController.ts     # API endpoint handlers
├── routes/
│   └── userRoutes.ts         # Route definitions
└── index.ts                  # Main server file
```

## 🔌 API Endpoints

### User Management

#### POST `/api/users/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "age": "25-30",
  "gender": "Male",
  "profession": "IT & Software Development",
  "country": "United States",
  "city": "New York",
  "household": "2 people",
  "ctaVariant": "A"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_1234567890_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "age": "25-30",
    "gender": "Male",
    "profession": "IT & Software Development",
    "country": "United States",
    "city": "New York",
    "household": "2 people",
    "waitlistPosition": 1,
    "ctaVariant": "A",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "waitlistPosition": 1,
  "message": "User created successfully"
}
```

#### POST `/api/users/join-community`
Join the community (triggers email and activity tracking).

**Request Body:**
```json
{
  "userId": "user_1234567890_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "activity": {
    "id": "activity_1234567890_def456",
    "userId": "user_1234567890_abc123",
    "activityType": "COMMUNITY_JOINED",
    "metadata": {
      "joinedAt": "2024-01-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Successfully joined community"
}
```

#### GET `/api/users/:id`
Get user by ID.

#### GET `/api/users/:userId/activities`
Get user activities.

#### PUT `/api/users/:id`
Update user profile.

### Admin Endpoints

#### GET `/api/users/admin/users`
Get all users (admin only).

#### GET `/api/users/admin/count`
Get total user count.

## 📧 Email System

### Welcome Email
- Personalized greeting with first name
- Waitlist position display
- Community join call-to-action
- Social sharing links
- Responsive HTML design

### Community Join Email
- Confirmation of community membership
- Next steps and features
- Community engagement opportunities

## 🎯 Activity Tracking

### Activity Types
- `SIGNUP`: User registration
- `EMAIL_SENT`: Email notifications sent
- `COMMUNITY_JOINED`: Community membership
- `PROFILE_UPDATED`: Profile changes

### Activity Metadata
Each activity includes relevant metadata:
- Waitlist position
- A/B test variant
- User demographics
- Timestamps
- Email types and status

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create `.env` file:
```env
PORT=3000
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the API
```bash
node test-signup.js
```

## 🧪 Testing

### Manual Testing
1. Start the backend server
2. Run the test script: `node test-signup.js`
3. Check console output for success/error messages

### Frontend Integration
1. Update frontend API base URL in `frontend/src/services/api.ts`
2. Test signup flow in the browser
3. Verify email sending (check console logs)

## 📊 Analytics & Insights

### Trackable Metrics
- Signup conversion rates
- A/B test performance
- Email open rates
- Community engagement
- User demographics
- Geographic distribution

### Data Points
- User registration date/time
- CTA variant performance
- Email delivery status
- Activity frequency
- User journey progression

## 🔮 Future Enhancements

### Planned Features
- Database integration (PostgreSQL/MongoDB)
- Real email service integration (SendGrid/Mailgun)
- User authentication system
- Advanced analytics dashboard
- Email template management
- Automated email sequences
- User segmentation
- Advanced A/B testing

### Technical Improvements
- Input validation middleware
- Rate limiting
- Error logging service
- Database migrations
- API documentation (Swagger)
- Unit and integration tests
- Docker containerization
- CI/CD pipeline

## 🛠️ Development Notes

### Current Implementation
- In-memory storage for demo purposes
- Console-based email logging
- Basic error handling
- Simple activity tracking

### Production Considerations
- Replace in-memory storage with database
- Integrate real email service
- Add comprehensive error handling
- Implement rate limiting
- Add input validation
- Set up monitoring and logging

## 📝 API Documentation

### Error Responses
All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

### Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `409`: Conflict (duplicate email)
- `500`: Internal Server Error

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include activity tracking for new features
4. Test thoroughly before submitting
5. Update documentation as needed 