-- Tables seeds here (Example)

DELETE FROM favourites;
DELETE FROM points;
DELETE FROM maps;
DELETE FROM users;
select setval ('favourites_id_seq', 1, false);
select setval ('points_id_seq', 1, false);
select setval ('maps_id_seq', 1, false);
select setval ('users_id_seq', 1, false);

INSERT INTO users (name, email, password) VALUES ('Devin Sanders', 'tristanjacobs@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Iva Harrison', 'allisonjackson@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (name, email, password) VALUES ('Lloyd Jefferson', 'asherpoole@gmx.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO maps (name, owner_id, description, category, is_private) VALUES ('Fine cafes', 1, 'Fine cafes near my office', 'Cafe', true);
INSERT INTO maps (name, owner_id, description, category, is_private) VALUES ('Best fishing spots', 1, 'Fishing for fun Club', 'Fishing', true);
INSERT INTO maps (name, owner_id, description, category, is_private) VALUES ('Instagrammable spots', 2, 'Most nstagrammable places in Vancouver', 'Photos', false);

INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();
INSERT INTO points (title, map_id, contributor_id, description, image_url, longitude, latitude) VALUES ();

INSERT INTO favourites (map_id, user_id) VALUES (2, 1);
INSERT INTO favourites (map_id, user_id) VALUES (1, 2);
INSERT INTO favourites (map_id, user_id) VALUES (2, 3);
