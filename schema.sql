DROP TABLE if exists cities;

CREATE TABLE cities (
  id SERIAL PRIMARY KEY, 
  search_query VARCHAR(255)
);