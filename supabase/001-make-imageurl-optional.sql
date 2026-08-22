-- Run this once if your `creators` table was created with `imageurl text not null`.
-- The prework treats imageURL as optional, so the column must allow NULL.

alter table creators alter column imageurl drop not null;

-- Normalize any rows that stored a blank string while the column was NOT NULL.
update creators set imageurl = null where imageurl = '';
