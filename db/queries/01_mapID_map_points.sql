SELECT user_id, latitude, longitude, map_points.title as title, map_points.description as descr, address, map_point_image_url as image
FROM map_points
JOIN maps ON maps.id = map_points.map_id
WHERE map_id = 3;
