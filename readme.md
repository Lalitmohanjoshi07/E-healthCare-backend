
---

# E-Healthcare Backend API

## Overview
The E-Healthcare backend API enables seamless interaction between patients, doctors, and the admin panel. It supports functionalities such as user authentication, doctor lookup, session management, and prescription handling.

### Base URL
```
http://localhost:5000
```

---

## Authentication

### 1. Register User
- **Endpoint:** `POST /auth/register`
- **Description:** Register a new user (patient).
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01"
  }
  ```
- **Response:**  
  - `201 Created`: User registered successfully.  
  - `400 Bad Request`: Invalid input.

### 2. Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate user and get a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**  
  - `200 OK`: Returns user details and token.  
  - `401 Unauthorized`: Invalid credentials.

---

## Doctors

### 3. Get Doctors
- **Endpoint:** `GET /api/doctors`
- **Description:** Fetch the list of available doctors.
- **Headers:**
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Filters (Optional):**
  - `specialization`: Filter by specialty.
  - `search`: Search doctors by name.
- **Response:** Array of doctor profiles.

---

## Sessions

### 4. Create Session
- **Endpoint:** `POST /api/request`
- **Description:** Patients can request a session with a doctor.
- **Headers:**
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body:**
  ```json
  {
    "doctorId": "unique_doctor_id"
  }
  ```
- **Response:**  
  - `201 Created`: Session request created.  
  - `404 Not Found`: Doctor not found.

### 5. Get Patient Sessions
- **Endpoint:** `GET /api/sessions/patient`
- **Description:** Retrieve all sessions for a patient.
- **Headers:**
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** Array of session objects with doctor details.

### 6. Get Doctor Sessions
- **Endpoint:** `GET /api/sessions/doctor`
- **Description:** Retrieve all sessions for a doctor.
- **Headers:**
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:** Array of session objects with patient details.

### 7. Update Session Status
- **Endpoint:** `PATCH /api/sessions/:sessionId/status`
- **Description:** Doctors update session status (e.g., "completed").
- **Headers:**
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body:**
  ```json
  {
    "status": "completed"
  }
  ```
- **Response:**  
  - `200 OK`: Status updated.  
  - `400 Bad Request`: Invalid status transition.

---

## Prescriptions

### 8. Create Prescription
- **Endpoint:** `POST /prescriptions`
- **Description:** Doctors create prescriptions for patients.
- **Headers:**
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body:**
  ```json
  {
    "patientId": "unique_patient_id",
    "medications": [
      {
        "name": "Paracetamol",
        "dosage": "500mg",
        "frequency": "Twice daily"
      }
    ],
    "instructions": "Take after meals"
  }
  ```
- **Response:**  
  - `201 Created`: Prescription created.  
  - `400 Bad Request`: Invalid data.

---

## Error Handling
- **`400 Bad Request`:** Invalid input or request.
- **`401 Unauthorized`:** JWT missing or invalid.
- **`403 Forbidden`:** Insufficient permissions.
- **`404 Not Found`:** Resource not found.
- **`500 Internal Server Error`:** Server-side error.

---

## Usage Notes for Frontend Engineers (Arjun ha tujhe hi bolra)

1. **JWT Token**  
   - Most APIs require an `Authorization` header with a valid JWT token:
     ```plaintext
     Authorization: Bearer <JWT_TOKEN>
     ```

2. **Endpoints for Patients:**
   - **Login/Registration:** Use `/auth/register` and `/auth/login`.
   - **Doctor Lookup:** Fetch available doctors via `/api/doctors`.
   - **Sessions:** Manage via `/api/request` and `/api/sessions/patient`.

3. **Endpoints for Doctors:**
   - **Sessions:** Use `/api/sessions/doctor` for retrieving and `/api/sessions/:sessionId/status` for updating session statuses.
   - **Prescriptions:** Manage via `/prescriptions`.

4. **Development Tips:**  
   - Use Postman/Thunder Client to test endpoints during integration.
   - Ensure proper error handling based on the status codes.

---

## Security Considerations
- Passwords are hashed using bcrypt.
- JWT tokens are used for authentication.
- Role-based access control is implemented.
- HTTPS is recommended in production.

---

## Version
**Current API Version:** 1.0.0  
**Last Updated:** December 3, 2024
```
