# Lost and Found

A full-stack web application for managing lost and found items with authentication and image uploads.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT, Google OAuth 2.0

## Setup

### Backend

```bash
cd server
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
```

Start server:
```bash
node server.js
```

### Frontend

```bash
cd client
npm install
npm start
```

Access at `http://localhost:5500`

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect repository
4. Set environment variables in Render dashboard
5. Deploy

**Live Backend:** `https://lost-and-found-9cwe.onrender.com`

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Deploy

**Live Frontend:** `https://lost-and-found-omega.vercel.app`

## API Endpoints

- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `POST /api/users/google-login` - Google OAuth login
- `GET /api/items/lost` - Get lost items
- `POST /api/items/lost` - Create lost item
- `GET /api/items/found` - Get found items
- `POST /api/items/found` - Create found item
- `DELETE /api/items/:type/:id` - Delete item

## License

MIT
