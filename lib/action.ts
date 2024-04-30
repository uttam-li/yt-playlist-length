"use server";
import axios from "axios";

const client = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
});

export async function getPlaylist(url: string) {
  const playlistURL = new URL(url);
  const playlistId = playlistURL.searchParams.get("list");
  let nextPageToken = "";
  let allItems: any = [];
  let res;
  try {
    do {
      res = await client.get(
        `/playlistItems?part=snippet&part=id&part=contentDetails&part=status&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${process.env.API_KEY}`
      );
      allItems = allItems.concat(res.data.items);
      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken);

    const videoIds = allItems
      .map((item: any) => item.contentDetails.videoId)
      .join(",");
      const videoRes = await client.get(
        `/videos?part=snippet&part=contentDetails&id=${videoIds}&key=${process.env.API_KEY}`
      );
      videoRes.data.items.forEach((video: any, index: number) => {
        const item = allItems.find(
          (item: any) => item.contentDetails.videoId === video.id
        );
        if (item) {
          item.videoTitle = video.snippet.title;
          item.videoThumbnail = video.snippet.thumbnails.default.url;
          item.videoDuration = video.contentDetails.duration;
          item.index = index + 1;
        }
      });
    
      const { items, ...result } = res.data;
      return { items: allItems, ...result };
  } catch (error) {
    console.error(error);
  }
  return null;
}

export async function getPlaylistByParams(
  url: string,
  start: number,
  end: number
) {
  const playlistURL = new URL(url);
  const playlistId = playlistURL.searchParams.get("list");
  let nextPageToken = "";
  let allItems: any = [];
  let itemIndex = 1;
  let res;

  try {
    do {
      res = await client.get(
        `/playlistItems?part=snippet&part=id&part=contentDetails&part=status&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${process.env.API_KEY}`
      );
      res.data.items.forEach((item: any) => {
        if (itemIndex >= start && itemIndex <= end) {
          item.index = itemIndex;
          allItems.push(item);
        }
        itemIndex++;
      });
      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken && itemIndex <= end);

    const videoIds = allItems
      .map((item: any) => item.contentDetails.videoId)
      .join(",");
    const videoRes = await client.get(
      `/videos?part=snippet&part=contentDetails&id=${videoIds}&key=${process.env.API_KEY}`
    );
    videoRes.data.items.forEach((video: any) => {
      const item = allItems.find(
        (item: any) => item.contentDetails.videoId === video.id
      );
      if (item) {
        item.videoTitle = video.snippet.title;
        item.videoThumbnail = video.snippet.thumbnails.default.url;
        item.videoDuration = video.contentDetails.duration;
      }
    });

    const { items, ...result } = res.data;
    return { items: allItems, ...result };
  } catch (error) {
    console.error(error);
  }
  return null;
}