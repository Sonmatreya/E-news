# TODO: Fix Published News Not Appearing in Reader

## Issue
Published news are not showing in the reader because the backend queries use `status: 'active'`, but the model uses `status: 'published'` for published news.

## Plan
Update all reader-facing methods in `newsController.js` to query for `status: 'published'` instead of `status: 'active'`.

## Steps
- [ ] Update `get_recent_news` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `get_category_news` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `news_search` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `get_all_news` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `get_news` method: change `status: 'active'` in relateNews query to `status: 'published'`
- [ ] Update `get_categories` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `get_popular_news` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `get_latest_news` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `get_images` (website method): change `status: 'active'` to `status: 'published'`
- [ ] Update `get_news_list` method: change `status: 'active'` to `status: 'published'`
- [ ] Update `get_single_news` method: change `news.status !== 'active'` to `news.status !== 'published'`
- [ ] Update `get_categories_list` method: change `status: 'active'` to `status: 'published'`

## Followup
- Test the reader endpoints to ensure published news now appear.
- Verify no other parts of the code are affected.
