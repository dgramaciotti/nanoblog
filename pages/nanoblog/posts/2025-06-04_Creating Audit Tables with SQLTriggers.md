---
title: "Creating Audit Tables with SQL Triggers"
date: "04/06/2025"
author: "Daniel Guedes"
description: "A walkthrough on creating audit tables using SQL triggers in SQLite to store data history."
coverImage: "sql.svg"
---

### Introduction

This article is a walkthrough on how to create a simple application with _audit tables_ along with the main tables of the application. Audit tables are tables that store the history of a data table, that is, data that was updated or deleted. If you have worked with some complete frameworks, such as Ruby on Rails and Springboot you'll notice this auditing logic comes out of the box, or with minimal changes.

Auditing may be required because of sensitive information, users with different kinds of responsibilities that handle the same data, store for future handling, and so on.

There are many ways to handle these audit tables, one of the most common is by using _triggers._ Triggers are database-level event handlers, that may fire and run a SQL script when something happens. There are some benefits to using triggers in these scenarios:

*   Triggers separate database logic from the application logic;
*   Triggers are more portable since they are already written in SQL, and most times only require small adjustments when changing to a different DBMS;
*   Triggers tend to be quicker than application-level logic since they are performed inside the database already;

With that said, let’s present a simple NodeJS + SQlite and Sequelize ORM+ express application that uses triggers to save the change history of a table.

![sqlite logo](/nanoblog/assets/sqlite.webp)

SQLite

### Setup

Let’s begin by initializing the project and installing the required dependencies

```javascript
npm init -y && npm install --save-dev nodemon ts-node && npm install --save @types/express @types/node express sequelize sqlite3
```

It’s not the objective of this article to show how to create an express API, so let’s jump straight to the models and the triggers. In this example, we’ll use a _User_ model and a _Todo_ model, where the relation is of one to many. The columns can have any value, with the addition of the _createdAt_ and _updatedAt_ columns, automatically set by Sequelize, which are important information in any auditable table.

````javscript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
});

export default sequelize;
````

````javascript
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../src/config/database';

export class Todo extends Model {}

Todo.init({
    task: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
},{
    sequelize,
    modelName: 'Todo'
});

export class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
},{
    sequelize: sequelize,
    modelName: 'User'
});

User.hasMany(Todo);
````

With that, Sequelize will set up the tables for _todos_ and _users._ Now we can create a structure for our audit table and the triggers.

### Creating the triggers

First, we’ll create the table that will hold the audit information:

```sql
CREATE TABLE todos_audit(
    task TEXT,
    completed BOOLEAN,
    createdAt DATE,
    updatedAt DATE,
    UserId INTEGER,
    auditDate DATE
);
```

Then we can create the trigger. The trigger basic syntax is the following:

```sql
create trigger \[trigger\_name\]   
\[before | after\]    
{insert | update | delete}    
on \[table\_name\]    
\[for each row\]    
\[trigger\_body\]
```

In this scenario, we’ll audit our _Todos_ table on Update and Delete, so we’ll create two triggers to handle that.

```sql
/* Syntax for SQLITE (DATETIME('now') */
CREATE TRIGGER audit_todos_update
BEFORE UPDATE ON todos
BEGIN
INSERT INTO todos_audit (task, createdat, updatedat, completed, UserId, auditDate) 
    VALUES (old.task, old.createdat, old.updatedat, old.completed, old.UserId, DATETIME('now'));
END
```

In this trigger, we are taking the information from the _old_ temporary table that contains the information of the updated value and saving it to the audit table, along with a column _auditDate_ that saves the date-time when the audit was added. The _old_ keyword is used in SQlite, other RDMS may have a different name for this temporary table.

The syntax for the delete trigger is pretty similar, the only difference being the event handler, in this case, it’s the BEFORE DELETE.

```sql
CREATE TRIGGER audit_todos_delete 
BEFORE DELETE ON todos
BEGIN
INSERT INTO todos_audit (task, createdat, updatedat, completed, UserId, auditDate) 
    VALUES (old.task, old.createdat, old.updatedat, old.completed, old.UserId, DATETIME('now'));
END
```

### Wrap up

After creating the triggers, we have to execute the commands for the triggers and the audit table creation on the first run of our application, and after that for every update or delete action inside the Todos table the audit table should be automatically updated!

With this configuration, we don’t have to worry about the audit logic when dealing with the code. However, I wouldn't recommend applying this trigger logic in the situation you have complex business logic surrounding audits. The main idea behind audits is to leave your code mainly to business logic and developing your product. If you start to have a necessity of changing and manipulating this code, leaving it on the database (and thus normally not tracked as well as we do for code with git and the surrounding tools) will most likely lead to confusion and more problems than it solves.

#### Links

If you have any questions/suggestions you can contact me on my GitHub or LinkedIn

[https://github.com/dgramaciotti](https://github.com/dgramaciotti)

[https://www.linkedin.com/in/daniel-guedes-79a05a176/](https://www.linkedin.com/in/daniel-guedes-79a05a176/)

This example is available fully with endpoints aswell on this [link](https://github.com/dgramaciotti/trigger-example-sqlite).