// Live Google reviews for the Dange Associates Maps listing, via the Places API (New).
// Needs GOOGLE_PLACES_API_KEY (server-only). GOOGLE_PLACE_ID is optional; without it the
// place is looked up once by name. Responses are cached for a day to stay inside the free tier.

const PLACE_QUERY = "DANGE ASSOCIATES &DEVELOPERS, Kalmeshwar, Maharashtra";
const DAY = 60 * 60 * 24;

async function findPlaceId(key) {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({ textQuery: PLACE_QUERY }),
    next: { revalidate: DAY * 30 },
  });
  if (!res.ok) throw new Error(`Place search failed: ${res.status}`);
  const data = await res.json();
  return data.places?.[0]?.id;
}

export async function GET(request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return Response.json({ error: "not_configured" }, { status: 503 });

  const lang = new URL(request.url).searchParams.get("lang") === "mr" ? "mr" : "en";

  try {
    const placeId = await findPlaceId(key);
    if (!placeId) return Response.json({ error: "place_not_found" }, { status: 404 });

    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=${lang}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: DAY },
    });
    if (!res.ok) throw new Error(`Place details failed: ${res.status}`);
    const place = await res.json();

    const reviews = (place.reviews ?? [])
      .filter((r) => (r.text?.text || r.originalText?.text)?.trim())
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri ?? null,
        photo: r.authorAttribution?.photoUri ?? null,
        rating: r.rating ?? 5,
        text: (r.text ?? r.originalText).text,
        when: r.relativePublishTimeDescription ?? "",
      }));

    return Response.json(
      { rating: place.rating ?? null, total: place.userRatingCount ?? 0, mapsUrl: place.googleMapsUri ?? null, reviews },
      { headers: { "Cache-Control": `public, s-maxage=${DAY}, stale-while-revalidate=${DAY}` } },
    );
  } catch (err) {
    console.error("Google reviews:", err.message);
    return Response.json({ error: "upstream_failed" }, { status: 502 });
  }
}
