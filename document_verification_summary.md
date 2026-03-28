# Document Verification System Update

## Changes Made

All documents are now marked as **required** for student verification. The system now requires **9 total documents** to be uploaded and verified before students gain full access.

### Required Documents (9 Total)

1. **Birth Certificate** - Official birth certificate document
2. **Mark Sheet 10th** - 10th grade mark sheet  
3. **Mark Sheet 12th** - 12th grade mark sheet
4. **Aadhaar Card** - National ID card
5. **Passport Size Photo** - Recent passport size photograph
6. **Transfer Certificate** - Transfer certificate from previous institution
7. **Migration Certificate** - Migration certificate (now required)
8. **Income Certificate** - Family income certificate (now required)
9. **Domicile Certificate** - State domicile certificate (now required)

### Database Changes

#### Schema Updates
- `database_schema_mysql_final.sql`: Updated document types to mark all 9 as required
- `sample_data_mysql_final.sql`: Updated sample data to reflect all documents as required
- `sample_data_mysql.sql`: Updated sample data to reflect all documents as required

#### Backend Validation Updates
- `document_routes.py`: Updated verification logic to check against 9 required documents
- `faculty_routes.py`: Updated faculty verification logic to use 9 required documents
- `registrar_routes.py`: Added validation to ensure all 9 documents are verified before student verification

#### Frontend Updates
- `StudentDashboard.tsx`: Updated to show 9 total required documents instead of dynamic count
- Category progress updated to show 9 total required documents

### Verification Logic

The system now enforces that:
1. Students must upload all 9 required documents
2. Faculty must verify all 9 documents before student is marked as verified
3. Dashboard shows consistent count of 9 required documents
4. Bulk verification operations check for all 9 documents

### File Requirements

- **File Size Limit**: 5MB for most documents, 2MB for photos
- **Allowed Formats**: PDF, JPG, JPEG for most documents; JPG, JPEG, PNG for photos
- **Verification Process**: All documents go through faculty verification

### Impact

- Students now need to provide 3 additional documents (Migration, Income, Domicile certificates)
- System validation is consistent across all components
- Frontend and backend both use the fixed count of 9 required documents
- Verification status updates only when all 9 documents are verified
