-- BRIFAN TECH: enforce profile visibility and remove public access to role.
-- Review and test in an isolated Supabase branch before applying to production.
-- This migration intentionally keeps public.is_admin() executable by anon because
-- existing RLS policies call it; it returns false for anonymous sessions.

begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.can_view_profile(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select case
    when target_user_id = (select auth.uid()) then true
    when exists (
      select 1
      from public.profiles as viewer
      where viewer.id = (select auth.uid())
        and viewer.role = 'admin'
    ) then true
    when coalesce(
      (
        select preferences.profile_visibility
        from public.user_preferences as preferences
        where preferences.user_id = target_user_id
      ),
      'public'
    ) = 'public' then true
    when (select auth.uid()) is not null
      and coalesce(
        (
          select preferences.profile_visibility
          from public.user_preferences as preferences
          where preferences.user_id = target_user_id
        ),
        'public'
      ) = 'members' then true
    else false
  end;
$function$;

revoke all on function private.can_view_profile(uuid) from public;
grant execute on function private.can_view_profile(uuid) to anon, authenticated;

-- is_admin() is referenced by existing RLS policies across articles, comments,
-- categories and article_tags. Keep it callable by anon, but run its role lookup
-- with the function owner's privileges so role column grants can be narrowed.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$function$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- The role-change trigger also needs to inspect the caller's role after column
-- privileges are narrowed. Keep its existing rule and make the lookup safe.
create or replace function public.guard_profile_role_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.role is distinct from old.role
     and not exists (
       select 1
       from public.profiles as profile
       where profile.id = (select auth.uid())
         and profile.role = 'admin'
     ) then
    raise exception 'Only an administrator can change account roles';
  end if;
  return new;
end;
$function$;

drop policy if exists "Profiles are public" on public.profiles;
drop policy if exists "Profiles respect visibility" on public.profiles;

create policy "Profiles respect visibility"
on public.profiles
for select
to anon, authenticated
using (private.can_view_profile(id));

-- Remove broad table-level grants. The application only needs these public
-- profile fields and these self-editable columns.
revoke all privileges on table public.profiles from anon, authenticated;

grant select (
  id,
  username,
  display_name,
  bio,
  avatar_url,
  website,
  created_at,
  updated_at
) on table public.profiles to anon, authenticated;

grant update (
  display_name,
  bio,
  avatar_url,
  website
) on table public.profiles to authenticated;

commit;
