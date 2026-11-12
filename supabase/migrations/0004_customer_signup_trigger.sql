-- Auto-create a row in `customers` whenever a new user signs up via
-- Supabase Auth. Without this, auth.users gets a row on signup but
-- `customers` (which orders/addresses/admin checks all key off of)
-- stays empty until something else inserts into it.
-- Run after 0001_init.sql.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: copy across any auth users that signed up before this
-- trigger existed and don't have a matching customers row yet.
insert into public.customers (id, email, full_name)
select u.id, u.email, u.raw_user_meta_data ->> 'full_name'
from auth.users u
left join public.customers c on c.id = u.id
where c.id is null;
