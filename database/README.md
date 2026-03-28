# University Document Management System

A comprehensive web application for managing student document verification, task assignments, and academic workflows in universities.

## Features

### 🔐 **Multi-Role Authentication**
- **Student Login**: Upload documents, view dashboard, submit assignments
- **Faculty Login**: Verify documents, assign tasks, grade submissions
- **Admin Login**: Manage users, generate credentials, oversee system

### 📋 **Document Management**
- Students upload required documents (birth certificate, mark sheets, ID cards)
- Faculty verify/reject documents with feedback
- Automatic dashboard access upon document verification
- File validation (size, type, format)

### 📚 **Task Management**
- Faculty assign tasks to individual students or departments
- Students submit work with file attachments
- Automated grading and feedback system
- Priority-based task organization

### 🎯 **Access Control**
- Dashboard access only after document verification
- Role-based permissions for all actions
- Secure JWT authentication
- Complete audit trail

## Database Schema

The system uses PostgreSQL with the following key tables:

- **users**: Base authentication for all roles
- **students**: Student academic records and verification status
- **faculties**: Faculty information and permissions
- **admins**: Administrator permissions
- **student_documents**: Document uploads and verification tracking
- **tasks**: Task assignments by faculty
- **task_submissions**: Student work submissions
- **audit_logs**: Complete system audit trail

## Quick Start

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb university_system

# Import schema
psql -d university_system -f database_schema.sql

# Import sample data (optional)
psql -d university_system -f sample_data.sql
```

### 2. Default Credentials

- **Admin**: `admin@university.edu.in` / `admin123`
- **Faculty**: `john.smith@university.edu.in` / `password123`
- **Student**: `rahul.kumar@university.edu.in` / `password123`

### 3. Access Control Demo

- **Verified Student**: `rahul.kumar@university.edu.in` (full dashboard access)
- **Pending Student**: `priya.sharma@university.edu.in` (documents pending)
- **Rejected Student**: `amit.patel@university.edu.in` (documents rejected)

## Workflow Overview

### Student Registration Flow
1. Admin creates student credentials using management panel
2. Student receives login email with credentials
3. Student logs in and uploads required documents
4. Faculty review and verify documents
5. Student gains dashboard access after verification

### Document Verification Process
1. Student uploads documents (PDF, JPG, PNG)
2. System validates file format and size
3. Faculty review pending documents
4. Faculty approve/reject with feedback
5. System updates student verification status
6. Automatic dashboard access on full verification

### Task Assignment Workflow
1. Faculty create tasks (assignments, projects, exams)
2. Tasks assigned to individuals or departments
3. Students receive task notifications
4. Students submit work before deadlines
5. Faculty grade and provide feedback
6. Students view grades and feedback

## Technical Architecture

### Backend Requirements
- **Node.js** + Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **bcrypt** for password hashing

### Frontend Requirements
- **React.js** + TypeScript
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router** for navigation

### File Storage
- **Local**: `/uploads/` directory structure
- **Cloud**: AWS S3 or similar (configurable)
- **Organization**: `/uploads/documents/{enrollment}/` and `/uploads/submissions/{task_id}/`

## Security Features

### Authentication & Authorization
- JWT-based authentication with role claims
- Password hashing with bcrypt
- Email verification for account activation
- Session management with token expiration

### Data Protection
- Complete audit trail of all actions
- Role-based access control
- File upload validation
- SQL injection prevention

### Access Control Logic
```sql
-- Dashboard access check
SELECT documents_verified = TRUE AND verification_status = 'verified'
FROM students WHERE user_id = :current_user_id;

-- Document verification permission
SELECT can_verify_documents = TRUE AND is_active = TRUE
FROM faculties WHERE user_id = :current_user_id;
```

## API Documentation

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete API documentation including:

- Authentication endpoints
- Student dashboard and document management
- Faculty verification and task management
- Admin user management
- File upload specifications

## Database Documentation

See [SCHEMA_DOCUMENTATION.md](./SCHEMA_DOCUMENTATION.md) for detailed schema information including:

- Table relationships and constraints
- Triggers and automated workflows
- Views for common queries
- Stored functions for user creation

## Sample Data

The [sample_data.sql](./sample_data.sql) file includes:

- 4 sample students with different verification statuses
- 3 sample faculty members
- Various tasks and submissions
- Document upload examples
- Audit log entries

## Development Setup

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=university_system
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd university-system

# Install dependencies
npm install

# Setup database
npm run db:setup

# Start development server
npm run dev
```

## Production Deployment

### Database Configuration
- PostgreSQL 12+ required
- Configure connection pooling
- Set up automated backups
- Enable SSL connections

### File Storage
- Use cloud storage for scalability
- Configure CDN for file delivery
- Set up file cleanup policies
- Implement virus scanning

### Security
- Use HTTPS in production
- Configure CORS properly
- Set up rate limiting
- Monitor audit logs

## Monitoring & Maintenance

### System Health
- Database connection monitoring
- File storage usage tracking
- API response time monitoring
- Error rate tracking

### User Activity
- Login frequency analysis
- Document verification rates
- Task completion statistics
- System usage patterns

## Support & Troubleshooting

### Common Issues

1. **Document Upload Fails**
   - Check file size limits
   - Verify allowed file types
   - Ensure directory permissions

2. **Dashboard Access Denied**
   - Verify document status
   - Check student verification flag
   - Review faculty approval

3. **Task Submission Issues**
   - Verify due dates
   - Check file format requirements
   - Review submission status

### Debug Queries

```sql
-- Check student verification status
SELECT * FROM student_verification_status;

-- View pending document verifications
SELECT * FROM pending_document_verifications;

-- Monitor faculty workload
SELECT * FROM faculty_workload;

-- System statistics
SELECT * FROM system_statistics;
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support and inquiries:
- Email: support@university.edu.in
- Documentation: See docs folder
- Issues: GitHub Issues tracker
