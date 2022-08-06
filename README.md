<h2 align="center">React Native + Next.js Monorepo | Authentication with Supabase</h2>

<p align="center">
  <img src="https://img.shields.io/badge/-React Native-gray" />
  <img src="https://img.shields.io/badge/-Next.js-green" />
  <img src="https://img.shields.io/badge/-Monorepo-blue" />
  <img src="https://img.shields.io/badge/-React Native Web-red" />
   <img src="https://img.shields.io/badge/-Supabase-darkgreen" />
</p>

https://user-images.githubusercontent.com/20783123/183242429-c8229e10-5e64-4271-94d3-55e2f203412f.mov

Authentication starter kit for React Native and Next.js in a monorepo using Supabase for the DB and React Native Web to share components across the projects.

## Getting started

Fork or clone this repo and then follow the steps below.

## Project set up

Note: Some steps were taken from https://supabase.com/docs/guides/with-nextjs

Before we start using the starter kit we're going to set up our Database and API. This is as simple as starting a new Project in Supabase and then creating a "schema" inside the database.

### Create a project

- Go to app.supabase.com.
- Click on "New Project".
- Enter your project details.
- Wait for the new database to launch.

### Set up the database schema

Now we are going to set up the database schema. We can use the "User Management Starter" quickstart in the SQL Editor, or you can just copy/paste the SQL from below and run it yourself.

1. Go to the "SQL Editor" section.
2. Click "User Management Starter".
3. Click "Run".

```
-- Create a table for public "profiles"
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
```

### Get the API Keys

Now that you've created some database tables, you are ready to insert data using the auto-generated API. We just need to get the URL and anon key from the API settings.

1. Go to the "Settings" section.
2. Click "API" in the sidebar.
3. Find your API URL in this page.
4. Find your "anon" and "service_role" keys on this page.

Now that you have the API URL and keys, let's create the environment variable files.

1. Navigate to `packages/mobile` and create a `.env` file. You can use the `.env.sample` file as a template and then paste your API URL and key.

2. Navigate to `packages/next` and create a `.env.local` file. You can use the `.env.local.sample` file as a template and then paste your API URL and key.

I am working on a way to unify this environment variable setup, bare with me :)

## Building the project

Install the dependencies:

```bash
yarn install
cd packages/mobile && npx pod-install
```

Then you can run the project:

```bash
yarn all
```

To run the app in iOS, Android & web.

Or

```bash
yarn ios
yarn android
yarn web
```

Note: To run the project in a specific platform.
