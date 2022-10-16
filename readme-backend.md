# ERD
!["Screenshot of URLs Index"](https://github.com/ej8899/lhl-midterm/blob/document/readme-backend/screenshots/ERD.png)

# ROUTES

## User API Routes
- POST /api/users/login
Login a user.

- POST /api/users/logout
Logout a user.

- POST /api/users
Add a new user to the database.

## Widget API Routes

### maps
- GET /api/widgets/maps
Get maps by owner id.

- POST /api/widgets/no-private-maps
Get all maps which are not private.

- POST /api/widgets/maps
Add a new user to the database.

### points
- GET /api/widgets/points
Get all points by map id.

- POST /api/widgets/points
Add a new point to the database.

### facourites
- POST /api/widgets/favourites
Add a new favourite map to the database.
