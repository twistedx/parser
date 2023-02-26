const RSSParser = require("rss-parser");
const cron = require("node-cron");

const parseUrl = (feedUrl) => {
  const parse = async (url) => {
    const feed = await new RSSParser().parseURL(url);
    let debug = true;

    feed.items.forEach((item) => {
      const isoDate = item.isoDate;
      const dateObj = new Date(isoDate);
      const currentTime = Date.now();
      const timeDiff = currentTime - dateObj.getTime();

      if (timeDiff <= 600000) {
        console.log(
          "The ISO date string was created within the last 10 minutes."
        );
        let url = `feedUrl`;

        let data = {
          username: "Webhook",
          avatar_url: "https://i.imgur.com/4M34hi2.png",
          content: "Upwork Job delivered right to you",
          embeds: [
            {
              author: {
                name: "UTM Capture",
                url: "https://www.reddit.com/r/cats/",
                icon_url: "https://i.imgur.com/R66g1Pe.jpg",
              },
              fields: [
                {
                  name: "Title",
                  value: item.title,
                  inline: true,
                },
                {
                  name: "Content",
                  value: item.contentSnippet,
                  inline: false,
                },
                {
                  name: "Link",
                  value: item.link,
                  inline: false,
                },
              ],
            },
          ],
        };
        let options = {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        };
        // Send the data to the endpoint
        fetch(url, options)
          .then((res) => {
            if (res.ok) {
              if (debug) {
                console.log("SC: Fetch Success: ", res);
              }
            }
          })
          .catch((error) => console.log("SC: Fetch Error: ", error));
      } else {
        console.log(
          "The ISO date string was not created within the last 10 minutes."
        );
      }
    });
  };

  console.log("Parsing " + feedUrl);

  parse(feedUrl);
};
cron.schedule("*/10 * * * *", async function () {
  console.log("running a task every 10 minutes");
  const feedTagUrl =
    "https://www.upwork.com/ab/feed/jobs/rss?q=google+tag+manager&user_location_match=1&sort=recency&paging=0%3B10&api_params=1&securityToken=6242d9a652b217edd62c63a6611322e89db5de940972c16aef72c4b9deea866319a05251ce90694efba950d27961370983a7479570787f8bdfab7e225716b209&userUid=1324762654929563648&orgUid=1324772939820150784";
  const feedWebflowUrl =
    "https://www.upwork.com/ab/feed/jobs/rss?q=webflow&sort=recency&user_location_match=1&paging=0%3B10&api_params=1&securityToken=6242d9a652b217edd62c63a6611322e89db5de940972c16aef72c4b9deea866319a05251ce90694efba950d27961370983a7479570787f8bdfab7e225716b209&userUid=1324762654929563648&orgUid=1324772939820150784";
  const ga4FeedUrl = `https://www.upwork.com/ab/feed/jobs/rss?q=ga4+implementation&sort=recency&user_location_match=1&paging=0%3B10&api_params=1&securityToken=6242d9a652b217edd62c63a6611322e89db5de940972c16aef72c4b9deea866319a05251ce90694efba950d27961370983a7479570787f8bdfab7e225716b209&userUid=1324762654929563648&orgUid=1324772939820150784`;
  await parseUrl(feedTagUrl);
  await parseUrl(feedWebflowUrl);
  await parseUrl(ga4FeedUrl);
});
