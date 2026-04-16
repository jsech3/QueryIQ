export const SCHEMA_SQL = `
CREATE TABLE directors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year INTEGER,
  country TEXT
);

CREATE TABLE genres (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE actors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year INTEGER
);

CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  release_year INTEGER,
  runtime_minutes INTEGER,
  director_id INTEGER REFERENCES directors(id),
  genre_id INTEGER REFERENCES genres(id),
  rating REAL
);

CREATE TABLE movie_actors (
  movie_id INTEGER REFERENCES movies(id),
  actor_id INTEGER REFERENCES actors(id),
  role TEXT,
  PRIMARY KEY (movie_id, actor_id)
);
`

export const SEED_SQL = `
INSERT INTO genres (id, name) VALUES
  (1,'Drama'),(2,'Sci-Fi'),(3,'Action'),(4,'Crime'),(5,'Thriller'),
  (6,'Animation'),(7,'Musical'),(8,'Horror'),(9,'Comedy'),(10,'War');

INSERT INTO directors (id, name, birth_year, country) VALUES
  (1,'Francis Ford Coppola',1939,'USA'),
  (2,'Christopher Nolan',1970,'UK'),
  (3,'Quentin Tarantino',1963,'USA'),
  (4,'Robert Zemeckis',1951,'USA'),
  (5,'Lana Wachowski',1965,'USA'),
  (6,'Bong Joon-ho',1969,'South Korea'),
  (7,'Hayao Miyazaki',1941,'Japan'),
  (8,'Frank Darabont',1959,'France'),
  (9,'Martin Scorsese',1942,'USA'),
  (10,'David Fincher',1962,'USA'),
  (11,'Damien Chazelle',1985,'USA'),
  (12,'George Miller',1945,'Australia'),
  (13,'Jordan Peele',1979,'USA'),
  (14,'Daniel Kwan',1988,'USA'),
  (15,'Wes Anderson',1969,'USA'),
  (16,'Joel Coen',1954,'USA'),
  (17,'Todd Phillips',1970,'USA'),
  (18,'Sam Mendes',1965,'UK'),
  (19,'Denis Villeneuve',1967,'Canada'),
  (20,'Greta Gerwig',1983,'USA'),
  (21,'Anthony Russo',1970,'USA'),
  (22,'Barry Jenkins',1979,'USA');

INSERT INTO movies (id, title, release_year, runtime_minutes, director_id, genre_id, rating) VALUES
  (1,'The Godfather',1972,175,1,1,9.2),
  (2,'Inception',2010,148,2,2,8.8),
  (3,'The Dark Knight',2008,152,2,3,9.0),
  (4,'Pulp Fiction',1994,154,3,4,8.9),
  (5,'Forrest Gump',1994,142,4,1,8.8),
  (6,'The Matrix',1999,136,5,2,8.7),
  (7,'Parasite',2019,132,6,5,8.6),
  (8,'Spirited Away',2001,125,7,6,8.6),
  (9,'The Shawshank Redemption',1994,142,8,1,9.3),
  (10,'Interstellar',2014,169,2,2,8.7),
  (11,'Goodfellas',1990,146,9,4,8.7),
  (12,'Fight Club',1999,139,10,1,8.8),
  (13,'Whiplash',2014,107,11,1,8.5),
  (14,'Mad Max: Fury Road',2015,120,12,3,8.1),
  (15,'La La Land',2016,128,11,7,8.0),
  (16,'Get Out',2017,104,13,8,7.8),
  (17,'Everything Everywhere All at Once',2022,139,14,2,7.8),
  (18,'The Grand Budapest Hotel',2014,99,15,9,8.1),
  (19,'No Country for Old Men',2007,122,16,5,8.2),
  (20,'The Social Network',2010,120,10,1,7.8),
  (21,'Joker',2019,122,17,1,8.4),
  (22,'1917',2019,119,18,10,8.3),
  (23,'Dune',2021,155,19,2,8.0),
  (24,'Oppenheimer',2023,180,2,1,8.3),
  (25,'Barbie',2023,114,20,9,6.8),
  (26,'Avengers: Endgame',2019,181,21,3,8.4),
  (27,'Blade Runner 2049',2017,164,19,2,8.0),
  (28,'Arrival',2016,116,19,2,7.9),
  (29,'Lady Bird',2017,94,20,9,7.4),
  (30,'Moonlight',2016,111,22,1,7.4);

INSERT INTO actors (id, name, birth_year) VALUES
  (1,'Leonardo DiCaprio',1974),
  (2,'Joseph Gordon-Levitt',1981),
  (3,'Christian Bale',1974),
  (4,'Heath Ledger',1979),
  (5,'Matthew McConaughey',1969),
  (6,'Anne Hathaway',1982),
  (7,'Tom Hanks',1956),
  (8,'Keanu Reeves',1964),
  (9,'Laurence Fishburne',1961),
  (10,'Brad Pitt',1963),
  (11,'Edward Norton',1969),
  (12,'Miles Teller',1987),
  (13,'J.K. Simmons',1955),
  (14,'Ryan Gosling',1980),
  (15,'Emma Stone',1988),
  (16,'Jesse Eisenberg',1983),
  (17,'Joaquin Phoenix',1974),
  (18,'Michelle Yeoh',1962),
  (19,'Cillian Murphy',1976),
  (20,'Margot Robbie',1990),
  (21,'Marlon Brando',1924),
  (22,'Al Pacino',1940),
  (23,'Samuel L. Jackson',1948),
  (24,'Uma Thurman',1970),
  (25,'Robert Downey Jr.',1965);

INSERT INTO movie_actors (movie_id, actor_id, role) VALUES
  (1,21,'Don Vito Corleone'),(1,22,'Michael Corleone'),
  (2,1,'Cobb'),(2,2,'Arthur'),
  (3,3,'Bruce Wayne'),(3,4,'Joker'),
  (4,23,'Jules'),(4,24,'Mia'),
  (5,7,'Forrest Gump'),
  (6,8,'Neo'),(6,9,'Morpheus'),
  (10,5,'Cooper'),(10,6,'Brand'),
  (12,10,'Tyler Durden'),(12,11,'Narrator'),
  (13,12,'Andrew'),(13,13,'Fletcher'),
  (15,14,'Sebastian'),(15,15,'Mia'),
  (17,18,'Evelyn'),
  (20,16,'Mark Zuckerberg'),
  (21,17,'Arthur Fleck'),
  (24,19,'Oppenheimer'),
  (25,20,'Barbie'),(25,14,'Ken'),
  (26,25,'Tony Stark'),
  (27,14,'K');
`

export type TableInfo = { name: string; columns: { name: string; type: string }[] }

export const TABLES: TableInfo[] = [
  {
    name: 'movies',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'title', type: 'TEXT' },
      { name: 'release_year', type: 'INTEGER' },
      { name: 'runtime_minutes', type: 'INTEGER' },
      { name: 'director_id', type: 'INTEGER → directors.id' },
      { name: 'genre_id', type: 'INTEGER → genres.id' },
      { name: 'rating', type: 'REAL' },
    ],
  },
  {
    name: 'directors',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
      { name: 'birth_year', type: 'INTEGER' },
      { name: 'country', type: 'TEXT' },
    ],
  },
  {
    name: 'genres',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
    ],
  },
  {
    name: 'actors',
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'name', type: 'TEXT' },
      { name: 'birth_year', type: 'INTEGER' },
    ],
  },
  {
    name: 'movie_actors',
    columns: [
      { name: 'movie_id', type: 'INTEGER → movies.id' },
      { name: 'actor_id', type: 'INTEGER → actors.id' },
      { name: 'role', type: 'TEXT' },
    ],
  },
]
