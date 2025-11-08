# TODO: Integrate Admin Panel Backend with Reader Website

## Backend Updates (news-portal-main (2)/backend)
- [x] Add new API endpoints to routes/newsRoute.js
- [x] Implement controller methods in controllers/newsController.js
- [x] Test endpoints for correct JSON responses
- [ ] Remove auth middleware from new reader endpoints (currently failing with Unauthorized)

## Next.js Reader Site Updates (news_portal_nextjs-main)
- [x] Verify config/config.js points to correct backend URL
- [x] Test fetching from new endpoints in components
- [x] Run Next.js dev server and check integration
- [x] Fix runtime errors in Next.js
- [x] Fix image configuration in Next.js

## Testing
- [x] Start backend server
- [x] Start Next.js server
- [ ] Test homepage, news details, category pages, search
