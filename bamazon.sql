create database Bamazon;

use Bamazon;

create table products(
item_id int auto_increment not null,
product_name varchar (100),
department_name varchar(100),
price decimal(10, 2),
stock_quantity int (11),
primary key(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Tums', 'Health', 7.98, 98);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Clue', 'Toys', 15.76, 43);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Worsted Yarn', 'Crafts', 6.97, 472);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Harry Potter and the Chamber of Secrets', 'Books', 8.99, 74);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Lamp', 'Home', 56.23, 32);



