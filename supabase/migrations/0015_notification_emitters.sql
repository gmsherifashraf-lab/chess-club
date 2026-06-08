-- =============================================================================
-- 0015_notification_emitters.sql
-- First real caller of public.notify(): when a coach grades a submission
-- (reviewed_at transitions NULL -> set), the player gets an in-app notification.
--
-- This proves the notification system end-to-end. Add further emitters
-- (task assigned, tournament starting, rating changed) on the same pattern.
-- Depends on 0014_notifications.sql.
-- =============================================================================

create or replace function public.tg_notify_submission_graded()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_title text;
begin
  -- Fire only on the NULL -> set transition of reviewed_at (the grading event).
  if old.reviewed_at is not null or new.reviewed_at is null then
    return new;
  end if;

  select title into v_title from public.tasks where id = new.task_id;

  perform public.notify(
    p_recipient    => new.player_id,
    p_template_key => 'assignment.graded',
    p_title        => 'Task reviewed: ' || coalesce(v_title, 'your task'),
    p_body         => case
                        when new.score is not null
                          then 'Your coach reviewed it — score ' || new.score || '/100. Open to see feedback.'
                        else 'Your coach left feedback. Open to see it.'
                      end,
    p_data         => jsonb_build_object('task_id', new.task_id, 'submission_id', new.id),
    p_category     => 'assignment',
    p_priority     => 'normal',
    p_link         => '/dashboard/player'
  );

  return new;
exception
  -- Never let a notification failure block the grading write.
  when others then
    return new;
end;
$$;

drop trigger if exists notify_submission_graded on public.submissions;
create trigger notify_submission_graded
  after update on public.submissions
  for each row execute function public.tg_notify_submission_graded();
