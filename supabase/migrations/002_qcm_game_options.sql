-- Add help_mode to evaluations (expert mode is implicit when level = 4)
alter table evaluations
  add column if not exists help_mode boolean not null default false;
