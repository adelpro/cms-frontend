# API Integration - Authentication

This document describes the integration of the authentication APIs according to the API contract.

## Overview

The authentication system has been updated to use real API endpoints instead of mock functions. The system now follows the API contract specification with proper error handling and response parsing.

## API Endpoints

All endpoints are prefixed with `/mock-api` as required by the contract:

- `POST /mock-api/auth/register` - User registration
- `POST /mock-api/auth/login` - User login
- `GET /mock-api/auth/profile` - Get user profile
- `PUT /mock-api/auth/profile` - Update user profile
- `POST /mock-api/auth/token/refresh` - Refresh access token
- `POST /mock-api/auth/logout` - User logout

## Configuration

### Environment Variables

The API base URL is configured via the `NEXT_PUBLIC_BACKEND_URL` environment variable:

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Mock Server

A simple mock server is provided for testing:

```bash
# Start the mock server
node mock-server.js

# The server will run on http://localhost:3001
```

## Implementation Details

### API Service Layer

The new API service is located at `src/lib/api/auth.ts` and provides:

- Type-safe API interfaces matching the contract
- Proper error handling and response parsing
- Token management
- User data conversion between API and internal formats

### Updated Components

#### Login Form (`src/components/auth/login-form.tsx`)
- Removed social login buttons (commented out)
- Updated to use real API endpoints
- Removed demo helper text
- Maintains existing validation and error handling

#### Signup Form (`src/components/auth/signup-form.tsx`)
- Simplified to match API contract (email, password, name only)
- Removed job title and phone number fields
- Removed social signup buttons (commented out)
- Updated validation to match new form structure

### Data Flow

1. **User Input** → Form validation
2. **API Call** → Real API endpoint with proper headers
3. **Response Handling** → Parse API response and handle errors
4. **Data Conversion** → Convert API user format to internal format
5. **State Update** → Update local storage and React state
6. **Navigation** → Redirect based on authentication result

## Testing

### Test Credentials

The mock server includes a test user:

- **Email**: `test@example.com`
- **Password**: `password123`

### API Testing

You can test the API endpoints using curl or Postman:

```bash
# Register a new user
curl -X POST http://localhost:3001/mock-api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","password":"password123","name":"New User"}'

# Login
curl -X POST http://localhost:3001/mock-api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Error Handling

The system handles various API error scenarios:

- **Network Errors**: Connection issues, timeouts
- **Validation Errors**: Invalid input data
- **Authentication Errors**: Invalid credentials, expired tokens
- **Server Errors**: API server issues

Error messages are localized and displayed to users appropriately.

## Security Features

- JWT token-based authentication
- Secure token storage in localStorage
- Proper authorization headers for protected endpoints
- Input validation and sanitization
- CORS handling for cross-origin requests

## Next Steps

1. **Test the integration** with the mock server
2. **Replace mock server** with real backend when available
3. **Add OAuth integration** for Google/GitHub (currently commented out)
4. **Implement refresh token logic** for automatic token renewal
5. **Add rate limiting** and additional security measures

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the mock server is running and accessible
2. **Network Errors**: Check if the backend URL is correct
3. **Validation Errors**: Verify form data matches expected format
4. **Token Issues**: Check localStorage for stored tokens

### Debug Mode

Enable debug logging by checking the browser console for API calls and responses.

## Migration Notes

- Social login functionality is temporarily disabled
- Form validation has been simplified
- Demo helper text has been removed
- All text content remains localized
- Existing authentication flow is preserved
