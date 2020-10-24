DROP TABLE if exists cities;

CREATE TABLE cities (
  id SERIAL PRIMARY KEY, 
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255)
);