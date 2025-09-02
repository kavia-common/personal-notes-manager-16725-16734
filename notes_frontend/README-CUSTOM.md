# Notes Frontend

Features:
- User authentication (client-side mock by default)
- Create, edit, delete notes
- Notes list with search, tags and folders filters
- Responsive, modern, minimal light theme
- REST API client with mock fallback (set NEXT_PUBLIC_API_BASE_URL to use a backend)

Dev:
- npm run dev
- Open / for landing, /login, /register, /notes

To integrate a backend, provide NEXT_PUBLIC_API_BASE_URL in the environment and ensure endpoints:
- POST /auth/login
- POST /auth/register
- GET /notes?search=&tag=&folder=
- GET /notes/:id
- POST /notes
- PUT /notes/:id
- DELETE /notes/:id
