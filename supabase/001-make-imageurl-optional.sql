-- Run this once if imageurl was originally set as required.
-- Image URLs are optional, so this column must allow NULL values.

alter table creators alter column imageurl drop not null;

-- Replace empty image URLs with NULL values.
update creators set imageurl = null where imageurl = '';