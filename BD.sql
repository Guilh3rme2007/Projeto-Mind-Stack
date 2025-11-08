create database MindStack_DB;
use MindStack_DB;

create table user(
user_id int auto_increment primary key, 
username varchar(100) not null unique,
email varchar(100) not null unique,
password varchar(255) not null,
created_at timestamp default current_timestamp
);

DELIMITER//
create procedure insertUser(
in f_username varchar(100),
in f_email varchar(100),
in f_password varchar(255)
)
begin
insert into user(username, email, password)
values(f_username, f_email, f_password);
end
//
DELIMITER;

