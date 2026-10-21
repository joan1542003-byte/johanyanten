-- Only the owner registers (from /admin); once an admin exists, nobody else can sign up
create or replace function private.block_signups_after_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.admins) then
    raise exception 'Signups are closed';
  end if;
  return new;
end;
$$;

create trigger block_signups_after_admin
  before insert on auth.users
  for each row execute function private.block_signups_after_admin();
