const getMapPoints = (db, queryParams) => {
  return db.query(
    `SELECT user_id, latitude, longitude,
          map_points.title as title, map_points.description as descr,
          address, map_point_image_url as image, map_points.id
          FROM map_points
          JOIN maps ON maps.id = map_points.map_id
          WHERE map_id = $1
          ORDER BY map_points.id;`,
    queryParams
  );
};

module.exports = { getMapPoints };
