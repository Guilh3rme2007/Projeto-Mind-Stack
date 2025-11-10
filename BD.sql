create database if not exists MindStack_DB;
use MindStack_DB;

create table if not exists user(
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
);
begin
insert into user(username, email, password)
values(f_username, f_email, f_password);
end
//
DELIMITER;

create user if not exists 'remote_user'@'%' identified by 'Gu1lh3rm3';
grant all privileges on mindstack_db.* to 'remote_user'@'%' with grant option;
flush privileges;

select * from user;

create table if not exists note (
    note_id int auto_increment primary key,
    user_id int not null,
    group_name varchar(100) not null,
    content TEXT,
    color varchar(10) default '#ffff76ff',
    position_x int default 0,
    position_y int default 0,
    created_at timestamp default current_timestamp,
    update_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references user(user_id) on delete cascade
);

select * from note;