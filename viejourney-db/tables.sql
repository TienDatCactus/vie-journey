begin;
drop table if exists registration_token;
drop table if exists account;

create table account (
    id serial primary key,
    email varchar(255) unique not null,
    password text not null,
    role varchar(255) not null,
    active boolean not null default false,
    constraint account_role_check check(role in ('ADMIN', 'USER'))
);

create table registration_token (
    id serial primary key,
    user_id integer not null,
    token text not null,
    created_at timestamp not null default now(),
    expires_at timestamp not null,
    confirmed_at timestamp,
    foreign key (user_id) references account(id) on delete cascade
);

insert into account(email, password, role, active)
values ('user1@gmail.com', '$2a$10$pyPVhX2LBHdXLBIMAjkyDeC6BZask.svEU8Uk6U9JmS5g629ZIrey', 'USER', true),
('user2@gmail.com', '$2a$10$zsTC3K1GmDHjgfXsjqWfneagNvoN0vl6BXFVCJ14AyqlvLgsbDZCW', 'USER', true),
('user3@gmail.com', '$2a$10$pyPVhX2LBHdXLBIMAjkyDeC6BZask.svEU8Uk6U9JmS5g629ZIrey', 'USER', false);

insert into registration_token(user_id, token, created_at, expires_at, confirmed_at)
values (1, '432acc3d-af71-4378-b186-ac0cf05cf710', '2024-12-28 23:00:57.917734'::timestamp, '2024-12-28 23:15:57.917734'::timestamp, '2024-12-28 23:04:27.274496'::timestamp),
(2, '9fdfa395-1f5d-4293-b341-00c55f26967d', '2024-12-28 23:05:46.975897'::timestamp, '2024-12-28 23:20:46.975897'::timestamp, '2024-12-28 23:20:43.967746'::timestamp),
(3, '9fdfa395-1f5d-4293-b341-00c55f26967d', '2024-12-28 23:08:46.975897'::timestamp, '2024-12-28 23:23:46.975897'::timestamp, null);

commit;
