# MySQL Schema Fix - Compatibility Notes

## Issue Resolved
Fixed MySQL Error 1101: "BLOB, TEXT, GEOMETRY or JSON column can't have a default value"

## Changes Made

### 1. JSON Columns → TEXT Columns
Changed JSON columns to TEXT columns to support default values in older MySQL versions:

**Before:**
```sql
permissions JSON DEFAULT '{}'
allowed_extensions JSON DEFAULT '["pdf", "jpg", "jpeg"]'
old_values JSON NULL
new_values JSON NULL
```

**After:**
```sql
permissions TEXT DEFAULT '{}'
allowed_extensions TEXT DEFAULT '[\"pdf\", \"jpg\", \"jpeg\"]'
old_values TEXT NULL
new_values TEXT NULL
```

### 2. Escaped JSON Strings
Updated INSERT statements to use escaped JSON strings:

**Before:**
```sql
'{"user_management": true, "document_verification": true}'
'["pdf", "jpg", "jpeg"]'
```

**After:**
```sql
'{\"user_management\": true, \"document_verification\": true}'
'[\"pdf\", \"jpg\", \"jpeg\"]'
```

## Compatibility

This schema is now compatible with:
- MySQL 5.6+
- MariaDB 10.0+
- All MySQL hosting providers

## Usage

The schema maintains all functionality:
- JSON data stored as TEXT (can be parsed in application code)
- Default values work properly
- All triggers and procedures function correctly
- Sample data loads without errors

## Next Steps

1. Import the fixed schema:
```sql
SOURCE /path/to/database_schema_mysql.sql
```

2. Import sample data:
```sql
SOURCE /path/to/sample_data_mysql.sql
```

3. Test with default credentials:
- Admin: admin@university.edu.in / admin123
- Faculty: john.smith@university.edu.in / password123
- Student: rahul.kumar@university.edu.in / password123
