-- Users table seeds here (Example)
INSERT INTO users (name, email, password, thumbnail_url)
VALUES ('Alice Glass', 'glass@example.com', '$2b$10$cx0LCM6I8GWlvrSIq4Z3KOFtgjxGJEVVFs6eXnggw1AdpC2z8lfZa', 'https://ph-files.imgix.net/1dedf6e6-bd75-4d14-9a94-f5fafbbc7415?auto=format&auto=compress&codec=mozjpeg&cs=strip');
INSERT INTO users (name, email, password, thumbnail_url)
VALUES ('John Dough', 'dough@example.com', '$2b$10$cx0LCM6I8GWlvrSIq4Z3KOFtgjxGJEVVFs6eXnggw1AdpC2z8lfZa', 'https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png');
INSERT INTO users (name, email, password, thumbnail_url)
VALUES ('Mary Jane', 'mj@example.com', '$2b$10$cx0LCM6I8GWlvrSIq4Z3KOFtgjxGJEVVFs6eXnggw1AdpC2z8lfZa', 'http://happyfacesparty.com/wp-content/uploads/2019/06/avataaars-Frances.png');
INSERT INTO users (name, email, password, thumbnail_url)
VALUES ('Nick Bick', 'user@example.com', '$2b$10$cx0LCM6I8GWlvrSIq4Z3KOFtgjxGJEVVFs6eXnggw1AdpC2z8lfZa', 'http://happyfacesparty.com/wp-content/uploads/2019/06/avataaars-Frances.png');


INSERT INTO maps (owner_id, title, description, category, start_lat, start_long, map_image_url)
VALUES (1, 'Healthy Food', 'Healthy food spots in Tor', 'Food', 43.67967373431558, -79.35131027709444, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd');
INSERT INTO maps (owner_id, title, description, category, start_lat, start_long, map_image_url)
VALUES (2, 'BC Hikes', 'Great weekend Hiking trips', 'Nature', 54.08602088317381, -126.16173755038751, 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c');
INSERT INTO maps (owner_id, title, description, category, start_lat, start_long, map_image_url)
VALUES (3, 'Sport Fields', 'Places to meet and have fun with friends', 'Nature', 43.39013188839061, -80.06310397360107, 'https://images.unsplash.com/photo-1500871872539-d3fff9af3ce7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D');
INSERT INTO maps (owner_id, title, description, category, start_lat, start_long, map_image_url)
VALUES (1, 'Parquor Spots', 'Cityscapes for ideal parqouring', 'Outdoor Recreation', 51.50280339972994, -0.2474303699636878, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd');
INSERT INTO maps (owner_id, title, description, category, start_lat, start_long, map_image_url)
VALUES (4, 'Parquor Spots', 'Cityscapes for ideal parqouring', 'Outdoor Recreation', 51.50280339972994, -0.2474303699636878, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd');

INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description, address)
VALUES (2, 1, 43.68234793251599, -79.32528046252345, 'Carrer de Sardenya', 'The healthiest food in Toronto, hands down', '1153 Craven Rd, Toronto, ON M4J 4V7, Canada');
INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description, address)
VALUES (1, 3, 43.26244161530249, -79.91768044760742, 'Rec Center Complex', 'It has a soccer field and baseball diamond', 'STERLING at UNIVERSITY, Hamilton, ON L8S 4E8, Canada');
INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description, address)
VALUES (3, 2, 49.78322723310748, -122.44748388603935, 'Fraser Valley Hike', 'Leisure hike, not too strenuous, beautiful sights.', 'Fraser Valley C, BC, Canada');
INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description, address)
VALUES (2, 1, 43.64737973021612, -79.41381454467773, 'Trinity Bellwoods Bar', 'Not the healthiest but so freakin hype!', 'Trinity Cir, Toronto, ON M6J 2V5, Canada');
INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description, address)
VALUES (2, 1, 43.64689134798197, -79.39717470222169, 'Hole in the Wall', 'This place is off the beaten path, but most authentic ethiopian food you will find', '29 Camden St, Toronto, ON M5V 3N3, Canada');

INSERT INTO favourites (user_id, map_id) VALUES (2, 1);
INSERT INTO favourites (user_id, map_id) VALUES (2, 4);
INSERT INTO favourites (user_id, map_id) VALUES (1, 3);
INSERT INTO favourites (user_id, map_id) VALUES (3, 2);
INSERT INTO favourites (user_id, map_id) VALUES (4, 2);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO labber;
GRANT ALL ON sequence users_id_seq to labber;
GRANT ALL ON sequence map_points_id_seq to labber;
