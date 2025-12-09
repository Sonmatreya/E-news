# TODO: Fix Published News Not Appearing in Reader - COMPLETED

## Issue
Published news are not showing in the reader because the backend queries use `status: 'active'`, but the model uses `status: 'published'` for published news.

## Plan
Update all reader-facing methods in `newsController.js` to query for `status: 'published'` instead of `status: 'active'`.

## Steps
- [x] Update `get_recent_news` method: change `status: 'active'` to `status: 'published'`
- [x] Update `get_category_news` method: change `status: 'active'` to `status: 'published'`
- [x] Update `news_search` method: change `status: 'active'` to `status: 'published'`
- [x] Update `get_all_news` method: change `status: 'active'` to `status: 'published'`
- [x] Update `get_news` method: change `status: 'active'` in relateNews query to `status: 'published'`
- [x] Update `get_categories` method: change `status: 'active'` to `status: 'published'`
- [x] Update `get_popular_news` method: change `status: 'active'` to `status: 'published'`
- [x] Update `get_latest_news` method: change `status: 'active'` to `status: 'published'`
- [x] Update `get_images` (website method): change `status: 'active'` to `status: 'published'`
- [x] Update `get_news_list` method: change `status: 'active'` to `status: 'published'`
- [x] Update `get_single_news` method: change `news.status !== 'active'` to `news.status !== 'published'`
- [x] Update `get_categories_list` method: change `status: 'active'` to `status: 'published'`

## Followup
- [ ] Test the reader endpoints to ensure published news now appear.
- [ ] Verify no other parts of the code are affected.
