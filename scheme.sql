
    create sequence achievement_seq start with 1 increment by 50

    create sequence certification_seq start with 1 increment by 50

    create sequence client_seq start with 1 increment by 50

    create sequence coursework_seq start with 1 increment by 50

    create sequence education_seq start with 1 increment by 50

    create sequence location_seq start with 1 increment by 50

    create sequence project_seq start with 1 increment by 50

    create sequence responsibility_seq start with 1 increment by 50

    create sequence technology_topic_rate_seq start with 1 increment by 50

    create sequence translation_string_seq start with 1 increment by 50

    create sequence work_experience_seq start with 1 increment by 50

    create table achievement (
        description_id bigint unique,
        education_id bigint,
        id bigint not null,
        project_id bigint,
        primary key (id)
    )

    create table certification (
        expiry_date date,
        issue_date date,
        description_id bigint unique,
        id bigint not null,
        name_id bigint unique,
        badge_url varchar(255),
        issuer varchar(255),
        logo varchar(255),
        primary key (id)
    )

    create table certification_technologies (
        certification_id bigint not null,
        technologies_id bigint not null unique
    )

    create table client (
        id bigint not null,
        logo varchar(255),
        name varchar(255),
        primary key (id)
    )

    create table coursework (
        course_education_id bigint,
        id bigint not null,
        project_education_id bigint,
        title_id bigint unique,
        primary key (id)
    )

    create table education (
        degree_id bigint unique,
        end_date timestamp(6) with time zone,
        gpa bigint,
        id bigint not null,
        location_id bigint,
        start_date timestamp(6) with time zone,
        institution varchar(255),
        primary key (id)
    )

    create table location (
        city_id bigint unique,
        country_id bigint,
        id bigint not null,
        primary key (id)
    )

    create table project (
        company_id bigint,
        end_date timestamp(6) with time zone,
        id bigint not null,
        project_description_id bigint unique,
        start_date timestamp(6) with time zone,
        methodology varchar(255) check (methodology in ('SCRUM','KANBAN','XP','WATERFALL','V_MODEL','RAD','RUP','AGILE','LEAN','DEVOPS','DSDM','SAFe','TDD','BDD','FDD')),
        project_name varchar(255),
        team_size varchar(255),
        primary key (id)
    )

    create table project_client (
        client_id bigint not null,
        project_id bigint not null
    )

    create table responsibility (
        description_id bigint unique,
        id bigint not null,
        project_id bigint,
        primary key (id)
    )

    create table technology_topic_rate (
        rate numeric(38,2),
        certification_id bigint,
        description_id bigint unique,
        id bigint not null,
        project_id bigint,
        covered_topic varchar(255),
        name varchar(255),
        technology varchar(255) check (technology in ('BACKEND','FRONTEND','DEVOPS','CLOUD','LANGUAGE','BPM','DATABASE','MESSAGING','TESTING','DOCUMENTATION','ARCHITECTURE','DEPLOYMENT','TOOLS')),
        primary key (id)
    )

    create table translation_string (
        id bigint not null,
        en TEXT,
        fr TEXT,
        primary key (id)
    )

    create table work_experience (
        active boolean,
        end_date date,
        start_date date,
        description_id bigint,
        id bigint not null,
        location_id bigint,
        position_id bigint,
        company_logo varchar(255),
        company_name varchar(255),
        primary key (id)
    )