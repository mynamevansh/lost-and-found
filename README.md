# Lost and Found Application

> A modern full-stack web application for reporting and tracking lost items with secure authentication and image uploads.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- 🔐 **Secure Authentication** - Email/Password & Google OAuth 2.0
- 📝 **Item Management** - Report lost and found items with detailed information
- 📸 **Image Uploads** - Upload photos to help identify items
- 🎨 **Responsive Design** - Modern UI with smooth animations
- 🔍 **Real-time Updates** - Dynamic item cards with instant feedback

## Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript, Google Identity Services  
**Backend:** Node.js, Express.js, JWT, Multer  
**Database:** MongoDB Atlas with Mongoose ODM  
**Authentication:** bcrypt, google-auth-library

## Project Structure

```
copy/
├── client/                    # Frontend application
│   ├── *.html                # Pages (index, lost, found, main)
│   ├── css/                  # Stylesheets
│   ├── js/                   # Client-side logic
│   ├── images/               # Static assets
│   └── package.json
│
├── server/                    # Backend application
│   ├── server.js             # Entry point
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── uploads/              # File storage
│   └── package.json
│
└── docs/                      # Documentation files
```

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Google Cloud Console project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mynamevansh/lost-and-found.git
   cd lost-and-found
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env` file:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/lostandfound
   PORT=5000
   JWT_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Google OAuth**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google+ API and create OAuth 2.0 credentials
   - Add authorized origins: `http://localhost:5500`, `http://127.0.0.1:5500`

### Running

**Terminal 1 - Backend:**
```bash
cd server && node server.js
```

**Terminal 2 - Frontend:**
```bash
cd client && npm start
```

Access at `http://localhost:5500`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Email/password login |
| POST | `/api/users/google-login` | Google OAuth login |
| POST | `/api/items/lost` | Create lost item |
| GET | `/api/items/lost` | Get all lost items |
| POST | `/api/items/found` | Create found item |
| GET | `/api/items/found` | Get all found items |
| DELETE | `/api/items/:id` | Delete item |

## Development

**Test Credentials:**
```
Email: vansh@gmail.com
Password: 0000
```

**Debug Mode:** Check browser console (F12) for detailed logs

## Troubleshooting

- **Google OAuth 403:** Verify origins in Google Cloud Console, wait 5-10 minutes
- **Connection Issues:** Check MongoDB URI and ensure port 5000 is available
- **CORS Errors:** Verify CORS configuration in `server.js`

See `GOOGLE_SETUP_GUIDE.md` for detailed OAuth setup instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

**Vansh** - [@mynamevansh](https://github.com/mynamevansh)

---

⭐ Star this repo if you find it helpful!
