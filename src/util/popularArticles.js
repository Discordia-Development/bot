const { google } = require('googleapis');
const path = require('path');

module.exports = async () => {
  const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
  const viewId = '170311537';

  const jwt = await google.auth.getClient({
    keyFile: path.join(__dirname, '../jwt.keys.json'),
    scopes
  });

  const analyticsReporting = google.analyticsreporting({
    version: 'v4',
    auth: jwt
  });

  const res = await analyticsReporting.reports.batchGet({
    requestBody: {
      reportRequests: [{
        viewId,
        dateRanges: {
          startDate: '30daysAgo',
          endDate: 'today',
        },
        dimensions: [{
          name: 'ga:pageTitle'
        }, {
          name: 'ga:pagePath'
        }],
        metrics: {
          expression: 'ga:pageviews' // ga:pageviews / ga:uniquePageviews
        },
        orderBys: {
          fieldName: 'ga:pageviews',
          sortOrder: 'descending'
        }
      }]
    }
  });

  const report = res.data.reports[0].data.rows.map(row => {
    return {
      path: row.dimensions[1],
      views: row.metrics[0].values[0]
    };
  });

  return report.slice(0, 5);
};