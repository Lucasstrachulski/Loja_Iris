-- Rodar uma vez no Supabase: SQL Editor → New query → colar tudo → Run.

-- Conteúdo do site (uma linha só, id = 1, com tudo em JSON).
create table if not exists public.site_conteudo (
  id int primary key,
  dados jsonb not null,
  atualizado_em timestamptz not null default now()
);
alter table public.site_conteudo enable row level security;

-- Qualquer visitante pode ler; só quem está logado no painel pode alterar.
create policy "site: leitura publica" on public.site_conteudo
  for select using (true);
create policy "site: admin insere" on public.site_conteudo
  for insert to authenticated with check (true);
create policy "site: admin altera" on public.site_conteudo
  for update to authenticated using (true) with check (true);

-- Fotos: bucket público para leitura; só quem está logado envia.
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "fotos: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'fotos');
