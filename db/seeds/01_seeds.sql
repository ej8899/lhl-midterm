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

INSERT INTO maps (name, owner_id, description, category, map_pins, is_private) VALUES ('Fine cafes', 1, 'Fine cafes near my office', 'Cafe', '', true);
INSERT INTO maps (name, owner_id, description, category, map_pins, is_private) VALUES ('Best fishing spots', 1, 'Fishing for fun Club', 'Fishing', '', true);
INSERT INTO maps (name, owner_id, description, category, map_pins, is_private) VALUES ('Instagrammable spots', 2, 'Most nstagrammable places in Vancouver', 'Photos', '', false);

INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Starbucks', 1, 1, 'It is a great place to meet people.', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665597771/samples/food/dessert.jpg', 51.048418, -114.066993);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Caffe Artigiano', 1, 1, 'Great iced coffee and super affordable :)', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665597772/samples/food/pot-mussels.jpg', 51.0480195,-114.0700058);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Analog Coffee Bow Valley Square', 1, 1, 'Fantastic place e to stop by for an amazing coffee. The staff are friendly and the service is fantastic.', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665597772/samples/food/fish-vegetables.jpg', 51.048393, -114.065788);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Chemainus Lake', 2, 1, 'Chemainus Lake is a lake located just 1.4 miles from Chemainus, in the Cowichan Valley Regional District. Fishermen will find a variety of fish including rainbow trout, cutthroat trout and small mouth bass.', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665597782/samples/landscapes/nature-mountains.jpg', 48.913156, -123.751907);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Fuller Lake', 2, 2, 'The park is north of Duncan, the lake is small, and the government trout together three times a year.', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665600002/samples/landscapes/Fuller_lake_xscocb.jpg', 48.9078181,-123.7216959);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Westwood Lake', 2, 3, '6 km round trail, easy access for walking around,  jogging or mountain biking. There is also a short loop can be accessed from right hand side facing the lake.', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665600001/samples/landscapes/Westwood_lake_atbwid.jpg', 49.1633042,-123.9978599);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Totem poles', 3, 1, 'Totem Poles in Stanley Park', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665598388/samples/landscapes/totem_poles_vpfs3m.jpg', 49.299186, -123.120878);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('Lions Gate Bride', 3, 2, 'Picture of lions gate bridge from low angle', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665598387/samples/landscapes/lions_gate_bridge_tdxg4d.jpg', 49.313712,-123.1411809);
INSERT INTO points (title, map_id, contributor_id, description, image_url, latitude, longitude) VALUES ('A-Maze-Ing Laughter', 3, 3, 'A-maze-ing Laughter was designed by Yue Minjun and installed in Morton Park (Davie and Denman) along the English Bay in West End, Vancouver in 2009.', 'https://res.cloudinary.com/dliugwbpa/image/upload/v1665598390/samples/landscapes/english_bay_pen50h.jpg', 49.287594, -123.141925);

INSERT INTO favourites (map_id, user_id) VALUES (2, 1);
INSERT INTO favourites (map_id, user_id) VALUES (1, 2);
INSERT INTO favourites (map_id, user_id) VALUES (2, 3);
