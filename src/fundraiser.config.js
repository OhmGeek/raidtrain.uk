// JustGiving settings used by the donation overlays (/overlay/*).
//
// The app ID comes from https://developer.justgiving.com (register an app).
// It is designed to be used from browsers, so it is fine to commit it here.
export const JUSTGIVING_APP_ID = '5bffc41a'

// The short name of the fundraising page: everything after justgiving.com/.
// Newer pages keep the "page/" prefix, e.g. https://www.justgiving.com/page/foo
// is "page/foo" - without it the REST API returns 404.
// Streamers can override this per overlay with ?page=<short-name>
export const JUSTGIVING_PAGE = 'page/twitch-raidtrain-2026-for-mft'
