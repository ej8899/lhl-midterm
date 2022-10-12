-- Tables seeds here (Example)

DELETE FROM favourites;
DELETE FROM points;
DELETE FROM maps;
DELETE FROM users;
select setval ('favourites_id_seq', 1, false);
select setval ('points_id_seq', 1, false);
select setval ('maps_id_seq', 1, false);
select setval ('users_id_seq', 1, false);

INSERT INTO users (
name, email, password)
VALUES (
'Devin Sanders', 'tristanjacobs@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Iva Harrison', 'allisonjackson@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Lloyd Jefferson', 'asherpoole@gmx.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
