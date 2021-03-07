-- Users table seeds here (Example)
INSERT INTO users (name, email, password, thumbnail_url)
VALUES ('Alice Glass', 'glass@example.com', 'password', 'https://ph-files.imgix.net/1dedf6e6-bd75-4d14-9a94-f5fafbbc7415?auto=format&auto=compress&codec=mozjpeg&cs=strip');
INSERT INTO users (name, email, password, thumbnail_url)
VALUES ('John Dough', 'dough@example.com', 'password', 'https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png');
INSERT INTO users (name, email, password, thumbnail_url)
VALUES ('Mary Jane', 'mj@example.com', 'password', 'http://happyfacesparty.com/wp-content/uploads/2019/06/avataaars-Frances.png');


INSERT INTO maps (owner_id, title, description, category, map_image_url)
VALUES (1, 'Healthy Food', 'Healthy food spots in Tor', 'Food', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd');
INSERT INTO maps (owner_id, title, description, category, map_image_url)
VALUES (2, 'BC Hikes', 'Great weekend Hiking trips', 'Nature', 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c');
INSERT INTO maps (owner_id, title, description, category, map_image_url)
VALUES (3, 'Sport Fields', 'Places to meet and have fun with friends', 'Nature', 'https://images.unsplash.com/photo-1500871872539-d3fff9af3ce7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D');


INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description)
VALUES (2, 1, 41.40338, 2.17403, 'Carrer de Sardenya', 'Some random building in Barcelona');
INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description)
VALUES (1, 3, 21.40338, 22.17403, 'Cool Mountain Place', 'Some random rockface in Libya');
INSERT INTO map_points (user_id, map_id, latitude, longitude, title, description)
VALUES (3, 2, 71.40338, 52.17403, 'Russian Island Peninsula', 'Middle of a body of water in Russia');
