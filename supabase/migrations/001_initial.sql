-- Teacher initial schema

create table sequences (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  emoji text not null default '📚',
  topic text,
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid not null references sequences(id) on delete cascade,
  filename text not null,
  file_path text not null,
  mime_type text not null,
  raw_text text not null default '',
  created_at timestamptz not null default now()
);

create table evaluations (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid not null references sequences(id) on delete cascade,
  level integer not null,
  questions text not null,
  answers text not null default '{}',
  score integer,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_documents_sequence_id on documents(sequence_id);
create index idx_evaluations_sequence_id on evaluations(sequence_id);
