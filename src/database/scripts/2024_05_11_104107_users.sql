create table if not exists users (
  id serial primary key not null,
  nickname varchar(255) not null unique,
  name  varchar(255) not null ,
  last_name varchar(255) ,
  ci varchar(255) unique,
  phone varchar(255) ,
  address varchar(255) ,
  email  varchar(255),
  password  varchar(255) not null,
  status integer default 1 not null,
  security_question varchar(255)
);

insert into users (nickname, name,last_name, email, password)
values (
    'admin',
    'admin',
    'admin',
    'admin@gmail.com',
    '$2b$10$uj4vBH/APtgrNvKf.qhoW.RyyE6Ulvt.y9izCAwBbVtVO7Q4NnOnO'
  );
