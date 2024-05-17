create table if not exists products (
id serial primary key not null,
title varchar(255) not null,
handle varchar(255) not null unique,
description  text,
sku  varchar(255),
grams varchar(255),
stock int,
price decimal(10,4),
compare_Price decimal(10,4),
barcode varchar(255)
);