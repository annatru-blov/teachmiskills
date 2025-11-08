create table if not exists users (
  id bigserial primary key,
  first_name text not null,
  last_name text not null,
  date_birth date,
  is_active bool not null default false
);


insert into users (first_name, last_name, date_birth, is_active) values 
('Anna', 'Trublovskaya', '14-10-2002', true),
('Sasha', 'Minkova', '15-12-2003', false),
('Pavel', 'Strishko', '19-03-2000', true),
('Vanya', 'Drozd', '18-05-1999', true);

select * from users;

select * from users where is_active = true;