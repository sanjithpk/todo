# todo

navigate to frontend

```
npm i
npm run dev
```

navigate to backend

make sure to have postgres table with

```
 CREATE TABLE todo (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done'))
    );
```

then run

```
npm i
node app
```
