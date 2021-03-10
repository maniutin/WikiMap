SELECT DISTINCT map_points.user_id AS user_id, maps.id AS map_id, maps.title AS title, maps.description AS description, maps.category AS category, maps.map_image_url AS map_image
FROM map_points JOIN maps ON map_id = maps.id
WHERE user_id = $1;
