# Sign-In API Request

Use this `curl` command to test the `POST /auth/sign-in` endpoint:

```bash
curl -X POST http://localhost:3000/auth/sign-in \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securePass123",
  "confirmPassword": "securePass123"
}'
