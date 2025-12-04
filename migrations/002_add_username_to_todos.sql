-- Add username column to todos table
ALTER TABLE todos ADD COLUMN username VARCHAR(100) NOT NULL DEFAULT 'Anonymous';

-- Create index on username for filtering queries
CREATE INDEX idx_username ON todos(username);
