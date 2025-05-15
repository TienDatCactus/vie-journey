create table account (
    id serial primary key,
    email varchar(255) unique not null,
    `password` text not null,
    `role` varchar(255) not null,
    `active` boolean not null default false,
    constraint account_role_check check(role in ('ADMIN', 'USER'))
);

create table if not exists trip (
	id int primary key auto_increment,
    title nvarchar(255) not null,
    general_destination nvarchar(255) not null,
    budget decimal(10,2),
    start_date date not null,
    end_date date not null
);

create table if not exists trip_mate (
	trip_id int not null,
    mate_id int not null,
    primary key (trip_id, mate_id),
    foreign key (trip_id) references trip(id),
    foreign key (mate_id) references `account`(id)
);

create table if not exists plan_section (
	id int primary key auto_increment,
    trip_id int not null,
	foreign key (trip_id) references trip(id),
    title nvarchar(255),
	`type` varchar(255) not null,
    constraint plan_section_type_check check(`type` in ('GENERAL', 'ITINERARY'))
);

create table if not exists section_note (
	id int primary key auto_increment,
    section_id int not null,
    foreign key (section_id) references plan_section(id),
    `text` text not null,
    important boolean default false
);

create table if not exists section_destination (
	id int primary key auto_increment,
    section_id int not null,
    foreign key (section_id) references plan_section(id),
    start_time datetime,
    end_time datetime,
    api_link varchar(255) not null -- (pending for change) need to check how gg map works
);

create table if not exists section_transit (
	id int primary key auto_increment,
    section_id int not null,
    foreign key (section_id) references plan_section(id),
    depart_time datetime not null,
    depart_location varchar(255) not null,
    arrive_time datetime not null,
    arrive_location varchar(255) not null,
    note nvarchar(255)
);

create table if not exists plan_expense (
	id int primary key auto_increment,
    amount decimal(10,2) not null,
    `description` nvarchar(255),
	category varchar(255) not null,
    constraint plan_expense_category_check check(category in 
    ('FLIGHTS', 'FOOD', 'SHOPPING', 'LODGING',
	 'DRINKS', 'GAS', 'CAR_RENTAL', 'SIGHTSEEING',
	 'GROCERIES', 'TRANSIT', 'ACTIVITIES', 'OTHER')),
	`paid_date` date,
	trip_id int not null,
	foreign key (trip_id) references trip(id),
    paider_id int not null,
    foreign key (paider_id) references `account`(id),
    spliter_ids varchar(255) -- 1,2,3
);
