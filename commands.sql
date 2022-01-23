\d
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);
insert into blogs (author, url, title) values ('Kent C. Dodds', 'https://kentcdodds.com/blog', 'The Kent C. Dodds Blog');
insert into blogs (author, url, title) values ('YCombinator', 'https://news.ycombinator.com/', 'Hacker News');
SELECT * FROM blogs;